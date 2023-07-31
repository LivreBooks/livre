import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useMemo, useRef } from "react";
import { Feather, Foundation } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { IconButton } from "react-native-paper";
import { DownloadsStore, LiveAppState } from "../../store/store";
import { DownloadType } from "../../types/types";
import { trimText } from "../../utils";
import BaseImage from "../BaseImage";
import CustomBackdrop from "../CustomBackdrop";
import Text from "../Text";
import Button from "../Button";
import Box from "../Box";
import { BookDescription, BookInfo } from "../BookDetails";
import { theme } from "../../constants";

const DownloadViewerBottomSheet = ({
	download,
	setSelectedDownload,
}: {
	download: DownloadType;
	setSelectedDownload: (value: any) => void;
}) => {
	const router = useRouter();
	const bottomSheetRef = useRef<BottomSheet>(null);

	const snapPoints = useMemo(() => ["60%", "100%"], []);

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

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={0}
			snapPoints={snapPoints}
			style={{ marginBottom: 20, overflow: "hidden", borderRadius: 20 }}
			backgroundStyle={{
				backgroundColor: LiveAppState.themeValue.get().colors.surface,
			}}
			handleIndicatorStyle={{
				width: "12%",
				backgroundColor: LiveAppState.themeValue.get().colors.background,
				height: 6,
				borderRadius: 10,
			}}
			handleStyle={{
				position: "absolute",
			}}
			enablePanDownToClose
			backdropComponent={CustomBackdrop}
			onClose={() => {
				setSelectedDownload(null);
			}}
		>
			<View
				style={{
					flex: 1,
					width: "100%",
					backgroundColor: LiveAppState.themeValue.get().colors.background,
				}}
			>
				<View>
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
							source={{ uri: download.book.base64Cover }}
							style={{
								height: "100%",
								width: "100%",
								position: "absolute",
								top: 0,
								left: 0,
								opacity: 0.5,
							}}
							blurRadius={5}
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
								source={{ uri: download.book.base64Cover }}
								style={{ height: "85%", width: "36%", borderRadius: 10 }}
								placeholderStyles={{ height: "85%", width: "36%" }}
							/>
						</View>
					</View>
					<View style={{ marginHorizontal: 10 }}>
						<Box gap={5}>
							<Text weight="700">{download.book.title}</Text>
							<Text style={{ opacity: 0.6 }}>{download.book.author}</Text>
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
					</View>
				</View>
			</View>
		</BottomSheet>
	);
};

export default DownloadViewerBottomSheet;

const styles = StyleSheet.create({});
