import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, UIManager, View, useColorScheme } from "react-native";
import { LiveAppState, SettingsStore, UserStore } from "../../store/store";
import {
	MaterialBottomTabNavigationOptions,
	createMaterialBottomTabNavigator,
} from "@react-navigation/material-bottom-tabs";
import { withLayoutContext } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import { darkMode, lightMode, theme } from "../../constants";
import { ThemeType } from "../../types/types";

if (Platform.OS === "android") {
	if (UIManager.setLayoutAnimationEnabledExperimental) {
		UIManager.setLayoutAnimationEnabledExperimental(true);
	}
}

const { Navigator } = createMaterialBottomTabNavigator();

const modifiedTheme = {
	...theme,
	colors: {
		...theme.colors,
		secondaryContainer: "#9258FF",
	},
};

export const Tabs = withLayoutContext<
	MaterialBottomTabNavigationOptions,
	typeof Navigator
>(Navigator);

function AppLayout() {
	const [reRender, setRerender] = useState(1);

	SettingsStore.theme.onChange((newTheme) => {
		setRerender(Math.random());
	});

	useEffect(() => {}, [reRender]);
	return (
		<PaperProvider theme={modifiedTheme}>
			<Tabs
				safeAreaInsets={{ bottom: 0 }}
				initialRouteName="search"
				barStyle={{
					backgroundColor: LiveAppState.themeValue.colors.background.get(),
				}}
				inactiveColor={LiveAppState.themeValue.colors.text.get()}
				activeColor={LiveAppState.themeValue.colors.text.get()}
				labeled={false}
				theme={LiveAppState.themeValue.get()}
			>
				<Tabs.Screen
					name="search"
					options={{
						title: `Search`,
						tabBarIcon: ({ color, focused }) => {
							return (
								<MaterialCommunityIcons
									name={focused ? "book-search" : "book-search-outline"}
									size={24}
									color={
										focused
											? LiveAppState.themeValue.colors.background.get()
											: LiveAppState.themeValue.colors.text.get()
									}
								/>
							);
						},
					}}
				/>
				<Tabs.Screen
					name="explore"
					options={{
						title: `Explore`,
						tabBarIcon: ({ color, focused }) => {
							return (
								<MaterialCommunityIcons
									name={focused ? "compass" : "compass-outline"}
									size={24}
									color={
										focused
											? LiveAppState.themeValue.colors.background.get()
											: LiveAppState.themeValue.colors.text.get()
									}
								/>
							);
						},
					}}
				/>
				<Tabs.Screen
					name="library"
					options={{
						title: "Library",
						tabBarIcon: ({ color, focused }) => {
							return (
								<View>
									<MaterialCommunityIcons
										name={focused ? "book" : "book-outline"}
										size={24}
										color={
											focused
												? LiveAppState.themeValue.colors.background.get()
												: LiveAppState.themeValue.colors.text.get()
										}
									/>
								</View>
							);
						},
					}}
				/>
				<Tabs.Screen
					name="account"
					options={{
						title: "Account",
						tabBarIcon: ({ color, focused }) => {
							return (
								<View>
									<MaterialCommunityIcons
										name={focused ? "account" : "account-outline"}
										size={24}
										color={
											focused
												? LiveAppState.themeValue.colors.background.get()
												: LiveAppState.themeValue.colors.text.get()
										}
									/>
								</View>
							);
						},
					}}
				/>
			</Tabs>
		</PaperProvider>
	);
}

export default AppLayout;
