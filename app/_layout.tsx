import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar, useColorScheme } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { LiveAppState, SettingsStore, UserStore } from "../store/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertNotificationRoot, Toast } from "react-native-alert-notification";
import { BASE_URL, darkMode, lightMode } from "../constants";
import { Download, ThemeType } from "../types/types";
import { fetchUtil } from "../utils";

const _layout = () => {
	const [reRender, setRerender] = useState(1);

	SettingsStore.theme.onChange((newTheme) => {
		updateTheme(newTheme);
		setRerender(Math.random());
	});
	const preferredTheme = useColorScheme();

	function updateTheme(theme: ThemeType) {
		if (theme === "auto") {
			if (preferredTheme === "dark") {
				LiveAppState.themeValue.set(darkMode);
			}

			if (preferredTheme === "light") {
				LiveAppState.themeValue.set(lightMode);
			}
		} else {
			if (theme === "dark") {
				LiveAppState.themeValue.set(darkMode);
			}

			if (theme === "light") {
				LiveAppState.themeValue.set(lightMode);
			}
		}
	}

	async function fetchUserDownloads() {
		const { data, error, status } = await fetchUtil<{ downloads: Download[] }>(
			`${BASE_URL}/get_downloads?user_id=${UserStore.account.id.get()}`
		);

		if (data && data.downloads) {
			UserStore.downloads.set(data.downloads);
		}

		if (error) {
			Toast.show({
				title: "Error Fetching Past Downloads",
				textBody: error.message,
			});
		}
	}

	useEffect(() => {
		const theme = SettingsStore.theme.get();
		updateTheme(theme);
		fetchUserDownloads();
	}, [reRender]);
	return (
		<AlertNotificationRoot theme="light">
			<PaperProvider theme={LiveAppState.themeValue.get()}>
				<StatusBar translucent />
				<SafeAreaView style={{ flex: 1 }}>
					<Stack screenOptions={{ headerShown: false }} />
				</SafeAreaView>
			</PaperProvider>
		</AlertNotificationRoot>
	);
};

export default _layout;
