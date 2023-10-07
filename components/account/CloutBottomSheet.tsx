import { BackHandler, Pressable } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { LiveAppState } from "../../store/store";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import CustomBackdrop from "../CustomBackdrop";
import Text from "../Text";
import Box from "../Box";
import * as Linking from "expo-linking";
import { MD3Theme } from "react-native-paper";

const CloutBottomSheet = ({ close }: { close: () => void }) => {
	const bottomSheetRef = useRef<BottomSheet>(null);

	const snapPoints = useMemo(() => ["60%"], []);

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

	const [appTheme, setAppTheme] = useState(LiveAppState.themeValue.get());

	LiveAppState.themeValue.onChange((theme) => {
		setAppTheme(theme);
	});

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
			<BottomSheetScrollView>
				<Box
					color={LiveAppState.themeValue.colors.background.get()}
					px={15}
					gap={10}
					block
				>
					<Box
						gap={10}
						align="center"
						color={appTheme.colors.surface}
						radius={20}
						pa={20}
					>
						<Text weight="600" size={16}>
							Creator
						</Text>
						<Text>Patrick aka (Just Patrick)</Text>
						<Box direction="row" gap={10} block align="center" justify="center">
							<LinkButton
								label="My Website"
								icon="account-hard-hat"
								onPress={() => {
									Linking.openURL("https://patrickwaweru.xyz");
								}}
								appTheme={appTheme}
							/>
							<LinkButton
								label="Github"
								icon="github"
								onPress={() => {
									Linking.openURL("https://github.com/LivreBooks/livre");
								}}
								appTheme={appTheme}
							/>
						</Box>
					</Box>
					<Box gap={10} color={appTheme.colors.surface} radius={20} pa={20}>
						<Text weight="600" size={18}>
							Services Used
						</Text>
						<Text weight="300">Books sourced from https://libgen.is</Text>
						<Text weight="300">Server Hosted on Deno Deploy</Text>
					</Box>
					<Box gap={10} color={appTheme.colors.surface} radius={20} pa={20}>
						<Text weight="600" size={18}>
							Libraries Used
						</Text>
						<Text weight="300">React Native</Text>
						<Text weight="300">expo</Text>
						<Text weight="300">expo-router</Text>
						<Text weight="300">react-native-pdf</Text>
						<Text weight="300">react-native-paper</Text>
						<Text weight="300">react-native-paper</Text>
						<Text weight="300">react-native-mmkv</Text>
						<Text weight="300">react-native-alert-notification</Text>
						<Text weight="300">@gorhom/bottom-sheet</Text>
						<Text weight="300">@epubjs-react-native</Text>
						<Text weight="300">@shopify/flash-list</Text>
						<Text weight="300">expo-skeleton-loader</Text>
						<Text weight="300">@legendapp/state</Text>
						<Text weight="300">react-native-reanimated</Text>
						<Text weight="300">rn-fetch-blob</Text>
					</Box>
				</Box>
			</BottomSheetScrollView>
		</BottomSheet>
	);
};

export default CloutBottomSheet;

const LinkButton = ({
	appTheme,
	onPress,
	label,
	icon,
}: {
	appTheme: MD3Theme;
	label: string;
	icon: string;
	onPress: () => void;
}) => {
	return (
		<Pressable onPress={onPress}>
			<Text
				color={appTheme.colors.background}
				icon={{ name: icon, color: appTheme.colors.background, size: 14 }}
				wrapperProps={{
					color: appTheme.colors.onSurface,
					px: 10,
					py: 5,
					radius: 20,
				}}
				size={12}
			>
				{label}
			</Text>
		</Pressable>
	);
};
