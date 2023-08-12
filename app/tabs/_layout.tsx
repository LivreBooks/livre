import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, UIManager, View } from "react-native";
import { LiveAppState } from "../../store/store";
import {
	MaterialBottomTabNavigationOptions,
	createMaterialBottomTabNavigator,
} from "@react-navigation/material-bottom-tabs";
import { withLayoutContext } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import { theme } from "../../constants";

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
	const [appTheme, setAppTheme] = useState(LiveAppState.themeValue.get());

	LiveAppState.themeValue.onChange((theme) => {
		setAppTheme(theme);
	});

	return (
		<PaperProvider theme={modifiedTheme}>
			<Tabs
				safeAreaInsets={{ bottom: 0 }}
				initialRouteName="search"
				barStyle={{
					backgroundColor: appTheme.colors.background,
				}}
				inactiveColor={appTheme.colors.text}
				activeColor={appTheme.colors.text}
				labeled={false}
				theme={appTheme}
				sceneAnimationType="opacity"
				sceneAnimationEnabled={false}
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
										focused ? appTheme.colors.background : appTheme.colors.text
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
										focused ? appTheme.colors.background : appTheme.colors.text
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
												? appTheme.colors.background
												: appTheme.colors.text
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
												? appTheme.colors.background
												: appTheme.colors.text
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
