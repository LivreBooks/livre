import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useRef, useMemo, useEffect, useState } from "react";
import { BackHandler, View, StyleSheet } from "react-native";
import { LiveAppState, UserStore } from "../../store/store";
import { Download } from "../../types/types";
import CustomBackdrop from "../CustomBackdrop";
import BaseImage from "../BaseImage";
import Text from "../Text";
import Box from "../Box";
import Spacer from "../Spacer";

const DownloadsBottomSheet = ({ close }: { close: () => void }) => {
	const [downloads, setDownloads] = useState(UserStore.downloads.get());

	const bottomSheetRef = useRef<BottomSheet>(null);

	const snapPoints = useMemo(() => ["96%"], []);

	useEffect(() => {
		const handle = BackHandler.addEventListener("hardwareBackPress", () => {
			close();
			return true;
		});
		return () => {
			handle.remove();
		};
	}, []);

	useEffect(() => {
		console.log(downloads);
	}, []);

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={0}
			snapPoints={snapPoints}
			backgroundStyle={{
				backgroundColor: LiveAppState.themeValue.get().colors.background,
				borderRadius: 25,
			}}
			handleIndicatorStyle={{
				width: "12%",
				backgroundColor: LiveAppState.themeValue.get().colors.onSurface,
				height: 6,
				borderRadius: 10,
			}}
			enablePanDownToClose
			backdropComponent={CustomBackdrop}
			onClose={() => close()}
		>
			<BottomSheetScrollView
				style={{ width: "100%", height: "100%" }}
				contentContainerStyle={{
					paddingBottom: 20,
					paddingHorizontal: 10,
					width: "100%",
					alignItems: "center",
				}}
			>
				<Text weight="bold" size={22} align="center">
					Downloads
				</Text>

				<Spacer height={10} />

				{downloads.map((download) => (
					<DownloadCard download={download} key={download.id} />
				))}
			</BottomSheetScrollView>
		</BottomSheet>
	);
};

const DownloadCard = ({ download }: { download: Download }) => {
	return (
		<View
			style={{
				...styles.container,
				flexDirection: "row",
				borderRadius: 15,
				backgroundColor: LiveAppState.themeValue.colors.background.get(),
			}}
		>
			<BaseImage
				style={{ height: 160 + 50, width: 100 + 40, borderRadius: 5 }}
				source={{ uri: download.book_cover }}
				placeholderStyles={{
					height: 200 + 40,
					width: 140 + 40,
					borderRadius: 5,
					top: 10,
					left: 10,
				}}
			/>
			<View
				style={{
					paddingLeft: 10,
					paddingVertical: 5,
					justifyContent: "space-between",
					flex: 1,
				}}
			>
				<View>
					<Text style={{ fontWeight: "bold", fontSize: 16 }}>
						{download.book_name}
					</Text>
					<Text style={{ marginBottom: 20, opacity: 0.8 }}>
						{download.book_author}
					</Text>
				</View>
				<View>
					<Text style={{ fontSize: 12 }}>Downloaded On</Text>
					<Text>{new Date(download.read_on).toDateString()}</Text>
				</View>
			</View>
		</View>
	);
};

export default DownloadsBottomSheet;

const styles = StyleSheet.create({
	container: {
		padding: 10,
		borderRadius: 8,
	},
	label: {
		fontWeight: "bold",
		marginBottom: 4,
	},
	value: {
		marginBottom: 8,
	},
});
