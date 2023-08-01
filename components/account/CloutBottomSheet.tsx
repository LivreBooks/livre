import { BackHandler, View } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { LiveAppState, SettingsStore } from "../../store/store";
import BottomSheet from "@gorhom/bottom-sheet";
import CustomBackdrop from "../CustomBackdrop";
import Text from "../Text";
import Box from "../Box";
import Spacer from "../Spacer";
import Button from "../Button";
import * as Linking from "expo-linking";

const CloutBottomSheet = ({ close }: { close: () => void }) => {
	const [theme, setTheme] = useState(SettingsStore.theme.get());

	const bottomSheetRef = useRef<BottomSheet>(null);

	const snapPoints = useMemo(() => ["20%"], []);

	function openWebsite() {
		Linking.openURL("https://patrickwaweru.xyz");
	}

	useEffect(() => {
		const handle = BackHandler.addEventListener("hardwareBackPress", () => {
			close();
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
			backgroundStyle={{
				backgroundColor: LiveAppState.themeValue.colors.background.get(),
				borderRadius: 25,
			}}
			handleIndicatorStyle={{
				width: "12%",
				backgroundColor: LiveAppState.themeValue.colors.text.get(),
				height: 6,
			}}
			enablePanDownToClose
			backdropComponent={CustomBackdrop}
			onClose={() => close()}
		>
			<Box
				color={LiveAppState.themeValue.colors.background.get()}
				px={15}
				py={5}
				gap={10}
				block
			>
				<Box>
					<Text>Patrick aka (Just Patrick)</Text>
					<Text>You can reach me on my personal website</Text>
				</Box>
				<Button mode="contained" onPress={openWebsite}>
					Open Website
				</Button>
			</Box>
		</BottomSheet>
	);
};

export default CloutBottomSheet;
