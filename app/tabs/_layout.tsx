import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, UIManager, View, useColorScheme } from "react-native";
import { LiveAppState, SettingsStore, UserStore } from "../../store/store";
import {
	MaterialBottomTabNavigationOptions,
	createMaterialBottomTabNavigator,
} from "@react-navigation/material-bottom-tabs";
import { withLayoutContext } from "expo-router";
import { darkMode, lightMode } from "../../constants";
import { ThemeType } from "../../types/types";

if (Platform.OS === "android") {
	if (UIManager.setLayoutAnimationEnabledExperimental) {
		UIManager.setLayoutAnimationEnabledExperimental(true);
	}
}

const { Navigator } = createMaterialBottomTabNavigator();

export const Tabs = withLayoutContext<
	MaterialBottomTabNavigationOptions,
	typeof Navigator
>(Navigator);

function AppLayout() {
	const preferredTheme = useColorScheme();

	const [reRender, setRerender] = useState(1);

	UserStore.account.onChange(() => {
		setRerender(Math.random());
		// //console.log("Rerender");
	});

	SettingsStore.theme.onChange((newTheme) => {
		updateTheme(newTheme);
	});

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
		setRerender(Math.random());
	}

	useEffect(() => {
		const theme = SettingsStore.theme.get();
		updateTheme(theme);
	}, []);

	return (
		<Tabs safeAreaInsets={{ bottom: 0 }} initialRouteName="search">
			<Tabs.Screen
				name="index"
				options={{
					title: `Search`,
					tabBarIcon: ({ color, focused }) => {
						return (
							<MaterialCommunityIcons
								name={focused ? "book-search" : "book-search-outline"}
								size={24}
								color={color}
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
								name={focused ? "star" : "star-outline"}
								size={24}
								color={color}
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
									color={color}
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
									color={color}
								/>
							</View>
						);
					},
				}}
			/>
		</Tabs>
	);
}

export default AppLayout;
