import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BackHandler } from "react-native";
import { IconButton } from "react-native-paper";
import { theme } from "../../constants";
import { DownloadsStore, LiveAppState } from "../../store/store";
import { DownloadType } from "../../types/types";
import BaseImage from "../BaseImage";
import { BookDescription, BookInfo } from "../BookDetails";
import Box from "../Box";
import Button from "../Button";
import CustomBackdrop from "../CustomBackdrop";
import Text from "../Text";

const DownloadViewerBottomSheet = ({
	download,
	setSelectedDownload,
}: {
	download: DownloadType;
	setSelectedDownload: (value: null | DownloadType) => void;
}) => {
	const router = useRouter();
	const bottomSheetRef = useRef<BottomSheet>(null);

	const snapPoints = useMemo(() => ["60%", "98%"], []);

	function openBook() {
		const link = `/tabs/library/reader?downloadId=${download.downloadId}`;
		router.push(link);
	}

	function deleteDownload() {
		const updatedDownloads = DownloadsStore.get().downloads.filter(
			(_download) => _download.downloadId != download.downloadId
		);
		DownloadsStore.downloads.set(updatedDownloads);
		setSelectedDownload(null);
	}

	useEffect(() => {
		const handle = BackHandler.addEventListener("hardwareBackPress", () => {
			setSelectedDownload(null);
			return true;
		});
		return () => {
			handle.remove();
		};
	}, []);

	const [appTheme, setAppTheme] = useState(LiveAppState.themeValue.get());

	LiveAppState.themeValue.onChange((theme) => {
		setAppTheme(theme);
	});

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={0}
			snapPoints={snapPoints}
			style={{ marginBottom: 20, overflow: "hidden", borderRadius: 20 }}
			backgroundStyle={{
				backgroundColor: appTheme.colors.background,
			}}
			handleStyle={{
				display: "none",
			}}
			enablePanDownToClose
			backdropComponent={CustomBackdrop}
			onClose={() => {
				setSelectedDownload(null);
			}}
		>
			<BottomSheetScrollView
				style={{
					width: "100%",
					height: "100%",
				}}
			>
				<Box block height={"100%"}>
					<Box>
						<Box
							style={{
								width: "100%",
								height: 240,
								alignItems: "center",
								justifyContent: "center",
								marginBottom: 10,
							}}
						>
							<BaseImage
								source={{ uri: download.book.base64Cover }}
								style={{
									height: "100%",
									width: "100%",
									position: "absolute",
									top: 0,
									left: 0,
									opacity: 0.5,
								}}
								blurRadius={25}
								placeholderStyles={{ height: "100%", width: "100%" }}
							/>
							<Box block align="center" justify="center" height={"100%"}>
								<BaseImage
									source={{ uri: download.book.base64Cover }}
									style={{ height: "85%", width: "36%", borderRadius: 10 }}
									placeholderStyles={{ height: "85%", width: "36%" }}
								/>
							</Box>
						</Box>
						<Box mx={15} gap={10}>
							<Box gap={5}>
								<Text weight="bold" size={16}>
									{download.book.title}
								</Text>
								<Text style={{ opacity: 0.9 }}>{download.book.author}</Text>
							</Box>
							<Box
								direction="row-reverse"
								justify="space-between"
								align="center"
								block
								my={15}
							>
								{download.filepath !== null && (
									<Button
										mode="contained"
										onPress={openBook}
										icon={"book-open-blank-variant"}
										style={{ width: "75%", borderRadius: 40 }}
									>
										READ
									</Button>
								)}
								<IconButton
									containerColor={theme.colors.errorContainer}
									onPress={deleteDownload}
									style={{ width: "20%" }}
									icon={"delete"}
									iconColor={theme.colors.error}
								/>
							</Box>
							<BookInfo
								pages={download.book.pages}
								publisher={download.book.publisher}
								size={(parseInt(download.book.filesize) / 1e6).toFixed(2)}
								type={"." + download.book.extension}
								year={download.book.year}
							/>
							<BookDescription content={download.book.descr} />
						</Box>
					</Box>
				</Box>
			</BottomSheetScrollView>
		</BottomSheet>
	);
};

export default DownloadViewerBottomSheet;
