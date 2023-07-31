import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { LiveAppState, SettingsStore } from "../store/store";
import { SafeAreaView } from "react-native-safe-area-context";

const _layout = () => {
	return (
		<PaperProvider theme={LiveAppState.themeValue.get()}>
			<StatusBar translucent />
			<SafeAreaView style={{ flex: 1 }}>
				<Stack />
			</SafeAreaView>
		</PaperProvider>
	);
};

export default _layout;
