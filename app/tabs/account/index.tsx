import { View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import BasePage from "../../../components/BasePage";
import { LiveAppState, UserStore } from "../../../store/store";
import { IconButton } from "react-native-paper";
import * as WebBrowser from "expo-web-browser";
import * as Animatable from "react-native-animatable";
import DownloadsBottomSheet from "../../../components/account/DownloadsBottomSheet";
import ThemeManager from "../../../components/account/ThemeManager";
import ProfileManger from "../../../components/account/ProfileManger";
import Spacer from "../../../components/Spacer";
import Text from "../../../components/Text";
import CloutBottomSheet from "../../../components/account/CloutBottomSheet";

const BottomSheetOpener = ({
	label,
	onPress,
}: {
	label: string;
	onPress: () => void;
}) => {
	const [appTheme, setAppTheme] = useState(LiveAppState.themeValue.get());

	LiveAppState.themeValue.onChange((theme) => {
		setAppTheme(theme);
	});

	return (
		<TouchableOpacity activeOpacity={0.8} onPress={onPress}>
			<View
				style={{
					padding: 5,
					paddingLeft: 20,
					borderRadius: 20,
					backgroundColor: appTheme.colors.surface,
					width: "100%",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<Text weight="bold">{label}</Text>
				<IconButton icon={"chevron-up"} iconColor={appTheme.colors.text} />
			</View>
		</TouchableOpacity>
	);
};

WebBrowser.maybeCompleteAuthSession();

const account = () => {
	const [reRender, setReRender] = useState(1);

	const [showThemeManager, setShowThemeManager] = useState(false);

	const [showDownloads, setShowDownloads] = useState(false);

	const [showCloutSheet, setShowCloutSheet] = useState(false);

	UserStore.onChange(() => {
		setReRender(Math.random());
	});

	return (
		<>
			<BasePage headerInfo={{ title: "Account", icon: "account" }}>
				<Animatable.View
					animation={"fadeInUp"}
					delay={10}
					style={{
						height: "100%",
						width: "100%",
						paddingHorizontal: 5,
					}}
				>
					<ProfileManger />

					<Spacer height={10} />

					<BottomSheetOpener
						label="Theme"
						onPress={() => setShowThemeManager(true)}
					/>

					<Spacer height={10} />

					<BottomSheetOpener
						label="Downloads"
						onPress={() => setShowDownloads(true)}
					/>

					<Spacer height={10} />

					<BottomSheetOpener
						label="About"
						onPress={() => setShowCloutSheet(true)}
					/>
				</Animatable.View>
			</BasePage>

			{showDownloads && (
				<DownloadsBottomSheet close={() => setShowDownloads(false)} />
			)}
			{showThemeManager && (
				<ThemeManager close={() => setShowThemeManager(false)} />
			)}
			{showCloutSheet && (
				<CloutBottomSheet close={() => setShowCloutSheet(false)} />
			)}
		</>
	);
};

export default account;
