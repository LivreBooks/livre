import { View, Dimensions, ToastAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import { BASE_URL, theme } from "../constants";
import { ActivityIndicator, Card, ProgressBar } from "react-native-paper";
import { DownloadsStore, LiveAppState } from "../store/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { downloadBook, sentryCapture, trimText } from "../utils";
import { BookType, FullBookType } from "../types/types";
import { useRouter } from "expo-router";
import BaseImage from "./BaseImage";
import { getBook } from "../services/services";
import Button from "./Button";
import Box from "./Box";
import Text from "./Text";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Spacer from "./Spacer";

const BookDetails = ({
	bookPreview = null,
	fullBook = null,
}: {
	bookPreview?: BookType;
	fullBook?: FullBookType;
}) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [fetchinDownloadLinks, setFetchingDownloadLinks] = useState(false);
	const [downloadedFilepath, setDownloadedFilepath] = useState(null);
	const [downloadProgress, setDownloadProgress] = useState(null);
	const [_fullbook, setFullBook] = useState(fullBook);
	const [book] = useState(bookPreview || _fullbook);

	DownloadsStore.downloads.onChange((downloads) => {
		const found = downloads
			.filter((download) => (download ? true : false))
			.find((download) => download.book.id === book.id);
		if (found) {
			setDownloadedFilepath(found.filepath);
			setDownloadProgress(found.progress);
		}
	});

	function checkIfDownloaded() {
		const found = DownloadsStore.downloads.find(
			(download) => download.book.id === book.id
		);
		if (found) {
			setDownloadedFilepath(found.filepath);
		}
	}

	function fetchFullBook() {
		setLoading(true);
		getBook(bookPreview.id)
			.then((data) => {
				data.coverurl = bookPreview.cover;
				console.log("Setting Fullbook");
				setFullBook(data);
			})
			.catch((error) => {
				sentryCapture(error);
				Toast.show({
					title: "Error Fetching Full Book Details",
					textBody: error?.message || "",
					type: ALERT_TYPE.DANGER,
				});
			})
			.finally(() => {
				setLoading(false);
			});
	}

	function fetchDownloadLinks() {
		setFetchingDownloadLinks(true);

		fetch(`${BASE_URL}/download/${_fullbook.md5}`)
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				downloadBook(_fullbook, data)
					.then((result) => {
						Toast.show({
							title: "Download Complete",
							textBody: _fullbook.title,
							type: ALERT_TYPE.SUCCESS,
							onPress() {
								openReader();
							},
							autoClose: true,
						});
					})
					.catch((error) => {
						sentryCapture(error);
						Toast.show({
							title: "Error Downloading Book",
							textBody: error?.message,
							autoClose: false,
						});
					});
			})
			.catch((error) => {
				sentryCapture(error);
				Toast.show({
					title: "Error Getting Download Link",
					textBody: error?.message || "",
					type: ALERT_TYPE.DANGER,
				});
				console.log(error);
			})
			.finally(() => {
				setFetchingDownloadLinks(false);
			});
	}

	function openReader() {
		const downloadId = DownloadsStore.get().downloads.find(
			(download) => download.book.id === _fullbook.id
		).downloadId;
		if (downloadId) {
			router.push(`/tabs/library/reader?downloadId=${downloadId}`);
		} else {
			ToastAndroid.show("Book Not Found", ToastAndroid.SHORT);
		}
	}
	useEffect(() => {
		checkIfDownloaded();
		if (bookPreview?.id) {
			fetchFullBook();
		}
	}, []);

	return (
		<BottomSheetScrollView>
			<Box width={"100%"} height={"100%"}>
				<Box>
					<Box gap={10}>
						<View
							style={{
								width: "100%",
								height: 240,
								alignItems: "center",
								justifyContent: "center",
								marginBottom: 10,
							}}
						>
							<BaseImage
								source={{
									uri: bookPreview?.cover || _fullbook.coverurl,
								}}
								style={{
									height: "100%",
									width: "100%",
									position: "absolute",
									top: 0,
									left: 0,
									opacity: 0.5,
								}}
								blurRadius={20}
								placeholderStyles={{ height: "100%", width: "100%" }}
							/>
							<View
								style={{
									flex: 1,
									width: "100%",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<BaseImage
									source={{
										uri: bookPreview?.cover || _fullbook.coverurl,
									}}
									style={{ height: "90%", width: "40%", borderRadius: 10 }}
									placeholderStyles={{ height: "95%", width: "40%" }}
								/>
							</View>
						</View>
						<Box mx={10} gap={10}>
							<Box gap={5}>
								<Text weight="bold" size={16}>
									{bookPreview?.title || _fullbook.title}
								</Text>
								<Text style={{ opacity: 0.9 }}>
									{bookPreview?.authors[0]?.name || _fullbook.author || ""}
								</Text>
							</Box>
							<BookInfo
								publisher={bookPreview?.publisher || _fullbook?.publisher || ""}
								pages={bookPreview?.pages || _fullbook?.pages}
								year={bookPreview?.year || _fullbook.year}
								size={
									bookPreview?.size ||
									(parseInt(_fullbook.filesize) / 1e6).toFixed(2).toString()
								}
								type={`.${bookPreview?.extension || _fullbook.extension}`}
							/>
						</Box>
					</Box>

					{_fullbook ? (
						<Box mx={10} py={10} gap={10}>
							{downloadedFilepath ? (
								<Button
									mode="contained"
									icon={"book-open-blank-variant"}
									onPress={openReader}
								>
									Read
								</Button>
							) : downloadProgress === null ? (
								<Button
									mode="contained"
									loading={fetchinDownloadLinks}
									onPress={fetchDownloadLinks}
								>
									Download
								</Button>
							) : (
								<Box
									pa={5}
									radius={10}
									color={LiveAppState.themeValue.colors.surface.get()}
								>
									<Text
										style={{
											fontWeight: "bold",
											textAlign: "center",
											width: "100%",
										}}
									>
										Downloading...
									</Text>
									<ProgressBar
										progress={downloadProgress}
										style={{
											height: 35,
											marginHorizontal: 5,
											marginVertical: 5,
											borderRadius: 20,
										}}
									/>
								</Box>
							)}
							<BookDescription content={_fullbook.descr} />
						</Box>
					) : (
						<View>
							<ActivityIndicator size={"small"} />
						</View>
					)}
				</Box>
			</Box>
		</BottomSheetScrollView>
	);
};

export default BookDetails;

interface BookInfoProps {
	publisher: string;
	pages: string;
	year: string;
	size: string;
	type: string;
}

export const BookInfo = ({
	publisher,
	pages,
	year,
	size,
	type,
}: BookInfoProps) => {
	return (
		<Box style={{ opacity: 0.9 }} gap={10} block>
			<BookInfoCard icon="post" label="Publisher" value={publisher} />
			<Box direction="row" justify="space-between" gap={10} block>
				<BookInfoCard
					icon="page-next-outline"
					label="Pages"
					value={pages?.replace(/\[.*?\]/g, "") || null}
				/>
				<BookInfoCard icon="calendar-outline" label="Year" value={year} />
				<BookInfoCard
					icon="database-outline"
					label="Size"
					value={`${
						size.toLowerCase().includes("mb") ||
						size.toLowerCase().includes("kb")
							? size
							: size + " mb"
					}`}
				/>
				<BookInfoCard icon="file-document-outline" label="Type" value={type} />
			</Box>
		</Box>
	);
};

interface BookInfoCardProps {
	icon: string;
	label: string;
	value: string;
}

const BookInfoCard = ({ label, value, icon }: BookInfoCardProps) => {
	const [appTheme, setAppTheme] = useState(LiveAppState.themeValue.get());

	LiveAppState.themeValue.onChange((theme) => {
		setAppTheme(theme);
	});
	return (
		<Box color={appTheme.colors.surface} radius={10} py={6.5} px={6.5}>
			<Box direction="row" align="center" gap={5}>
				<MaterialCommunityIcons
					name={icon as any}
					size={14}
					color={appTheme.colors.text}
				/>
				<Text
					style={{
						marginRight: 10,
					}}
				>
					{label}
				</Text>
			</Box>
			{value ? (
				<Text>{value}</Text>
			) : (
				<Text style={{ textDecorationLine: "line-through" }}>missing</Text>
			)}
		</Box>
	);
};

export const BookDescription = ({ content }: { content: string }) => {
	const [appTheme, setAppTheme] = useState(LiveAppState.themeValue.get());

	LiveAppState.themeValue.onChange((theme) => {
		setAppTheme(theme);
	});
	return (
		<Box
			style={{
				padding: 10,
				backgroundColor: appTheme.colors.surface,
				borderRadius: 15,
			}}
		>
			<Text style={{ marginBottom: 5 }}>Description</Text>
			{content ? (
				<Text style={{ marginBottom: 15 }}>
					{content.replace(/<[^>]*>/g, "")}
				</Text>
			) : (
				<Text style={{ textDecorationLine: "line-through" }}>missing</Text>
			)}
		</Box>
	);
};
