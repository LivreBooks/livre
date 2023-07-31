import { Alert, Keyboard, Pressable, View } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { overlayColors, theme } from "../../constants";
import PdfViewer from "./PdfViewer";
import { Bookmark, DownloadType } from "../../types/types";
import EpubViewer from "./EpubViewer";
import { Foundation } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Card, ProgressBar, IconButton, TextInput } from "react-native-paper";
import { animateLayout, layoutAnimate } from "../../utils";
import { Slider } from "@miblanchard/react-native-slider";
import { ReaderProvider } from "@epubjs-react-native/core";
import { DownloadsStore, LiveAppState } from "../../store/store";
import Spacer from "../Spacer";
import Box from "../Box";
import Text from "../Text";
import Button from "../Button";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const BaseViewer = ({ download }: { download: DownloadType }) => {
	const [overlayBrightness, setOverlayBrightness] = useState(0.3);
	const [overlayColor, setOverlayColor] = useState(overlayColors[0]);
	const [currentPage, setCurrentPage] = useState(
		download.readingInfo.currentPage
	);
	const [totalPages, setTotalPages] = useState(1);
	const [scale, setScale] = useState(1);

	const [viewerDetails, setViewerDetails] = useState(null);

	const pdfViewerRef = useRef();

	function goToPage(page: number) {
		if (download.book.extension === "pdf") {
			pdfViewerRef.current.jumpToPage(page);
		}
	}

	function updateCurrentPage(page: number) {
		const allDownloads = DownloadsStore.downloads.get();
		const updatedDownloads = allDownloads.map((_download) => {
			if (_download?.book.id === download?.book.id) {
				const _updatedDownload = {
					..._download,
					readingInfo: {
						..._download.readingInfo,
						currentPage: page,
					},
				};
				return _updatedDownload;
			}
			return _download;
		});
		DownloadsStore.downloads.set(updatedDownloads);
	}

	return (
		<ReaderProvider>
			<View style={{ height: "100%" }}>
				<View
					style={{
						height: "94%",
						justifyContent: "flex-start",
						position: "relative",
						backgroundColor: theme.colors.background,
					}}
				>
					<View
						style={{
							top: 0,
							left: 0,
							width: "100%",
							height: "110%",
							backgroundColor: overlayColor,
							opacity: overlayBrightness,
							position: "absolute",
							zIndex: 1,
						}}
						pointerEvents={"none"}
					/>
					{download.book.extension === "pdf" && (
						<PdfViewer
							bookCover={download.book.base64Cover}
							fileUri={download.filepath}
							setPages={(totalPages: number) => setTotalPages(totalPages)}
							setCurrentpage={(currentPage: number) => {
								setCurrentPage(currentPage);
								updateCurrentPage(currentPage);
							}}
							page={download.readingInfo.currentPage}
							ref={pdfViewerRef}
						/>
					)}
					{download.book.extension === "djvu" && (
						<View>
							<Text>DJVU Reader</Text>
						</View>
					)}
					{download.book.extension === "epub" && (
						<EpubViewer
							bookCover={download.book.base64Cover}
							fileUri={download.filepath}
							onLoad={() => {
								//console.log("Epub loaded");
							}}
						/>
					)}
				</View>
				<Controls
					download={download}
					fileType={download.book.extension}
					setScale={setScale}
					overlayColor={overlayColor}
					setOverlayColor={setOverlayColor}
					overlayBrightness={overlayBrightness}
					setOverlayBrightness={setOverlayBrightness}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					goToPage={goToPage}
					totalPages={totalPages}
					setTotalPages={setTotalPages}
				/>
			</View>
		</ReaderProvider>
	);
};

const Controls = ({
	download,
	overlayColor,
	setOverlayColor,
	overlayBrightness,
	setOverlayBrightness,
	currentPage,
	totalPages,
	goToPage,
}: {
	download: DownloadType;
	fileType: string;
	setScale: React.Dispatch<React.SetStateAction<number>>;
	overlayColor: string;
	setOverlayColor: (value: string) => void;
	overlayBrightness: number;
	setOverlayBrightness: (value: number) => void;
	currentPage: number;
	setCurrentPage: (value: number) => void;
	goToPage: (value: number) => void;
	totalPages: number;
	setTotalPages: (value: number) => void;
}) => {
	const bottomSheetRef = useRef<BottomSheet>(null);
	const snapPoints = useMemo(() => ["3.8%", "50%"], []);

	const [jumpToPage, setJumpToPage] = useState("");

	const [showBookmarks, setShowBookmarks] = useState(false);

	const keyboardHandler = Keyboard;

	const [theme] = useState(LiveAppState.themeValue.colors.get());

	const [currentPageBookmark, setCurrentPageBookmark] = useState(
		download.readingInfo.bookmarks.find(
			(_bookmark) => _bookmark.page === currentPage
		)
	);

	const [bookmarks, setBookmarks] = useState(download.readingInfo.bookmarks);

	function triggerJumpTo() {
		const targetPage = parseInt(jumpToPage);
		if (targetPage >= 1 && targetPage <= totalPages) {
			goToPage(targetPage);
			setJumpToPage("");
			bottomSheetRef.current.snapToIndex(0);
		} else {
			Alert.alert("Invalid Page Number");
		}
		keyboardHandler.dismiss();
	}

	function addBookMark() {
		const allDownloads = DownloadsStore.downloads.get();
		const updatedDownloads = allDownloads.map((_download) => {
			// Check if the current download matches the target book
			if (_download.book.id === download.book.id) {
				let updatedBookmarks;

				// If a bookmark for the current page already exists, remove it
				if (currentPageBookmark) {
					updatedBookmarks = _download.readingInfo.bookmarks.filter(
						(_bookmark) => _bookmark.page !== currentPageBookmark.page
					);
					setCurrentPageBookmark(null);
				} else {
					// If no bookmark exists for the current page, create a new one
					const newBookmark: Bookmark = {
						name: "",
						page: currentPage,
					};
					updatedBookmarks = [..._download.readingInfo.bookmarks, newBookmark];
					setCurrentPageBookmark(newBookmark);
				}

				// Update the bookmarks and return the updated download
				setBookmarks(updatedBookmarks);

				Toast.show({ title: "Bookmark Added", type: ALERT_TYPE.SUCCESS });

				return {
					..._download,
					readingInfo: {
						..._download.readingInfo,
						bookmarks: updatedBookmarks,
					},
				};
			}

			// Return the unchanged download if it doesn't match the target book
			return _download;
		});

		// Set the updated downloads in the store
		DownloadsStore.downloads.set(updatedDownloads);
	}

	useEffect(() => {
		const currentDownloadState = DownloadsStore.downloads.find(
			(dl) => dl.downloadId === download.downloadId
		);
		setCurrentPageBookmark(
			currentDownloadState.readingInfo.bookmarks.find(
				(_bookmark) => _bookmark.page === currentPage
			)
		);
	}, [currentPage]);

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={0}
			snapPoints={snapPoints}
			style={{
				zIndex: 20,
				borderRadius: 40,
				overflow: "hidden",
			}}
			backgroundStyle={{
				backgroundColor: LiveAppState.themeValue.colors.background.get(),
			}}
			handleIndicatorStyle={{
				width: "15%",
				backgroundColor: "white",
				height: 6,
				borderRadius: 10,
			}}
			handleHeight={30}
			onChange={() => {}}
		>
			<Box px={15} block>
				<Box
					style={{ borderRadius: 40 }}
					radius={40}
					direction="row"
					align="center"
					justify="space-between"
					color={LiveAppState.themeValue.colors.surface.get()}
					block
				>
					<View
						style={{
							borderRadius: 10,
							margin: 20,
							width: "40%",
						}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 5,
							}}
						>
							<Foundation
								name="page-multiple"
								size={16}
								color={LiveAppState.themeValue.colors.get().text}
								style={{ marginRight: 5 }}
							/>
							<Text>
								{currentPage}/{totalPages}
							</Text>
						</View>
						<ProgressBar
							progress={currentPage / totalPages}
							style={{ height: 10, borderRadius: 10 }}
							color={
								overlayColor === "transparent"
									? LiveAppState.themeValue.colors.primary.get()
									: overlayColor
							}
						/>
					</View>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginRight: 10,
							borderRadius: 20,
						}}
					>
						<TextInput
							keyboardType="number-pad"
							mode="flat"
							dense
							placeholder="Jump To"
							value={jumpToPage}
							style={{
								width: 100,
								borderRadius: 20,
								borderTopLeftRadius: 20,
								borderTopRightRadius: 20,
								backgroundColor:
									LiveAppState.themeValue.colors.background.get(),
							}}
							onChangeText={(value) => setJumpToPage(value)}
							underlineStyle={{ height: 0, borderRadius: 20 }}
							outlineStyle={{ borderRadius: 20 }}
							blurOnSubmit
							onSubmitEditing={() => triggerJumpTo()}
							theme={LiveAppState.themeValue.get()}
						/>
						<IconButton
							icon={"check"}
							mode="contained-tonal"
							size={20}
							disabled={jumpToPage ? false : true}
							onPress={() => triggerJumpTo()}
							theme={LiveAppState.themeValue.get()}
						/>
					</View>
				</Box>
				<Spacer height={10} />
				<Box
					pa={10}
					radius={40}
					block
					color={LiveAppState.themeValue.colors.surface.get()}
				>
					<Box block justify="space-between" direction="row" align="flex-start">
						<Box
							gap={showBookmarks ? 10 : 0}
							pa={showBookmarks ? 10 : 0}
							radius={25}
							align="center"
							block={showBookmarks ? true : false}
						>
							<Button
								icon={"bookmark-multiple"}
								mode={showBookmarks ? "contained" : "text"}
								textColor={LiveAppState.themeValue.colors.text.get()}
								onPress={() => {
									animateLayout();
									setShowBookmarks(!showBookmarks);
								}}
							>
								Bookmarks
							</Button>
							{showBookmarks && (
								<Box
									direction="row"
									wrap="wrap"
									align="center"
									justify="space-between"
									block
								>
									{bookmarks.map((bookmark) => (
										<Button
											mode={
												currentPageBookmark?.page === bookmark.page
													? "contained"
													: "contained-tonal"
											}
											key={bookmark.page}
											onPress={() => {
												goToPage(bookmark.page);
												setShowBookmarks(false);
											}}
										>
											{bookmark.page}
										</Button>
									))}
									{bookmarks.length === 0 && (
										<Text align="center" style={{ width: "100%" }}>
											No Bookmarks
										</Text>
									)}
								</Box>
							)}
						</Box>
						{!showBookmarks && (
							<Button
								mode={currentPageBookmark ? "contained" : "text"}
								icon={"bookmark"}
								textColor={LiveAppState.themeValue.colors.text.get()}
								onPress={() => addBookMark()}
							>
								Bookmark
							</Button>
						)}
					</Box>
				</Box>
				{/* <View style={{ flexDirection: "row" }}>
          <IconButton
            icon={"magnify-plus-outline"}
            mode="contained-tonal"
            style={{ borderRadius: 8 }}
            onPress={() => setScale((prev: number) => prev + 0.1)}
          />
          <IconButton
            icon={"magnify-minus-outline"}
            mode="contained-tonal"
            style={{ borderRadius: 8 }}
            onPress={() => setScale((prev: number) => prev - 0.1)}
          />
        </View> */}
				<Spacer height={10} />

				<Box
					pa={20}
					radius={30}
					block
					color={LiveAppState.themeValue.colors.surface.get()}
				>
					<Text style={{ marginBottom: 2 }}>Reader Theme</Text>
					<View
						style={{
							width: "100%",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							paddingVertical: 5,
						}}
					>
						{overlayColors.map((color, index) => (
							<View key={index}>
								{color == overlayColor ? (
									<IconButton
										icon={"check"}
										size={15}
										iconColor={
											color === "transparent" ? theme.text : theme.background
										}
										style={{
											backgroundColor: color,
											width: 30,
											height: 30,
											margin: 0,
											borderWidth: 1.5,
											borderColor:
												color === "transparent" ? theme.text : "transparent",
										}}
									/>
								) : (
									<Pressable
										onPress={() => {
											layoutAnimate();
											setOverlayColor(color);
										}}
									>
										<View
											style={{
												backgroundColor: color,
												borderWidth: 1.5,
												borderColor:
													color === "transparent" ? theme.text : "transparent",
												width: 30,
												height: 30,
												borderRadius: 5,
											}}
										/>
									</Pressable>
								)}
							</View>
						))}
					</View>

					<View
						style={{
							height: overlayColor === "transparent" ? 0 : 40,
							marginTop: 5,
							overflow: "hidden",
						}}
					>
						<Slider
							containerStyle={{ flex: 0.95 }}
							trackStyle={{
								height: "100%",
								borderRadius: 30,
								backgroundColor: theme.onSurface,
							}}
							thumbStyle={{
								backgroundColor:
									overlayColor === "transparent" ? theme.primary : overlayColor,
								borderColor: theme.text,
								borderWidth: 2,
							}}
							minimumTrackStyle={{
								backgroundColor:
									overlayColor === "transparent" ? theme.primary : overlayColor,
								height: "80%",
								marginLeft: 5,
							}}
							value={overlayBrightness}
							maximumValue={0.7}
							minimumValue={0.2}
							onValueChange={(value) => {
								setOverlayBrightness(value[0]);
							}}
						/>
					</View>
				</Box>
			</Box>
		</BottomSheet>
	);
};

export default BaseViewer;
