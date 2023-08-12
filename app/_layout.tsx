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
import Text from "../components/Text";

const _layout = () => {
	const [appTheme, setAppTheme] = useState(LiveAppState.themeValue.get());

	const systemTheme = useColorScheme();

	// User Changes the theme
	SettingsStore.theme.onChange((newTheme) => {
		updateTheme(newTheme);
	});

	LiveAppState.themeValue.onChange((theme) => {
		setAppTheme(theme);
	});

	function updateTheme() {
		const settingsTheme = SettingsStore.theme.get();

		if (settingsTheme === "system") {
			if (systemTheme === "dark") {
				LiveAppState.themeValue.set(darkMode);
			}

			if (systemTheme === "light") {
				LiveAppState.themeValue.set(lightMode);
			}
		} else {
			if (settingsTheme === "dark") {
				LiveAppState.themeValue.set(darkMode);
			}

			if (settingsTheme === "light") {
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
		fetchUserDownloads();
	}, []);

	useEffect(() => {
		const settingsTheme = SettingsStore.theme.get();

		updateTheme();
	}, [systemTheme]);
	return (
		<AlertNotificationRoot
			theme={
				SettingsStore.theme.get() === "system"
					? systemTheme
					: SettingsStore.theme.get() === "dark"
					? "dark"
					: "light"
			}
		>
			<PaperProvider theme={appTheme}>
				<StatusBar
					backgroundColor={LiveAppState.themeValue.colors.background.get()}
					barStyle={
						SettingsStore.theme.get() === "dark"
							? "light-content"
							: SettingsStore.theme.get() === "light"
							? "dark-content"
							: "default"
					}
				/>

				<SafeAreaView style={{ flex: 1 }}>
					<Stack screenOptions={{ headerShown: false, animation: "none" }} />
				</SafeAreaView>
			</PaperProvider>
		</AlertNotificationRoot>
	);
};

export default _layout;
