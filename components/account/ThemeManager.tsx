import { BackHandler, View } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { SegmentedButtons } from "react-native-paper";
import { LiveAppState, SettingsStore } from "../../store/store";
import BottomSheet from "@gorhom/bottom-sheet";
import CustomBackdrop from "../CustomBackdrop";
import Text from "../Text";
import Box from "../Box";
import { ThemeType } from "../../types/types";

const ThemeManger = ({ close }: { close: () => void }) => {
	const [theme, setTheme] = useState(SettingsStore.theme.get());

	const bottomSheetRef = useRef<BottomSheet>(null);

	const snapPoints = useMemo(() => ["22%"], []);

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
				align="center"
				color={LiveAppState.themeValue.colors.background.get()}
				px={15}
				py={5}
				block
			>
				<Box
					pa={20}
					mb={10}
					color={LiveAppState.themeValue.get().colors.surface}
					radius={20}
					block
				>
					<Text
						style={{
							marginBottom: 10,
						}}
					>
						Select Theme
					</Text>
					<SegmentedButtons
						value={theme}
						onValueChange={(value: ThemeType) => {
							SettingsStore.theme.set(value);
							setTheme(value);
						}}
						theme={LiveAppState.themeValue.get()}
						buttons={[
							{
								value: "light",
								label: "Light",
								icon: "brightness-7",
							},
							{
								value: "system",
								label: "System",
								icon: "brightness-auto",
							},
							{ value: "dark", label: "Dark", icon: "brightness-1" },
						]}
						density="regular"
					/>
				</Box>
			</Box>
		</BottomSheet>
	);
};

export default ThemeManger;
