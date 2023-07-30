import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Provider as PaperProvider } from "react-native-paper";
import { Platform, UIManager, View, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { LiveAppState, SettingsStore, UserStore } from "../store/store";
// import {
//   MaterialBottomTabNavigationOptions,
//   createMaterialBottomTabNavigator,
// } from "@react-navigation/material-bottom-tabs";
import { Tabs } from "expo-router";
import { darkMode, lightMode } from "../constants";
import { ThemeType } from "../types/types";

if (Platform.OS === "android") {
	if (UIManager.setLayoutAnimationEnabledExperimental) {
		UIManager.setLayoutAnimationEnabledExperimental(true);
	}
}

// const { Navigator } = createMaterialBottomTabNavigator();

// export const Tabs = withLayoutContext<
//   MaterialBottomTabNavigationOptions,
//   typeof Navigator
// >(Navigator);

// //console.log(Tabs);

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
		<PaperProvider theme={LiveAppState.themeValue.get()}>
			<StatusBar
				style={SettingsStore.theme.get()}
				backgroundColor={LiveAppState.themeValue.get().colors.background}
			/>
			<SafeAreaView style={{ flex: 1 }}>
				<Tabs
					safeAreaInsets={{ bottom: 0 }}
					initialRouteName="search"
					screenOptions={({ route }) => ({
						headerShown: false,
						tabBarStyle: {
							backgroundColor: LiveAppState.themeValue.get().colors.background,
							paddingBottom: 5,
							borderTopWidth: 0,
							borderTopColor: LiveAppState.themeValue.get().colors.secondary,
						},
						tabBarActiveTintColor: LiveAppState.themeValue.get().colors.primary,
					})}
				>
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
					<Tabs.Screen
						name="[...unmatched]"
						options={{
							title: "404",
							href: null,
						}}
					/>
				</Tabs>
			</SafeAreaView>
		</PaperProvider>
	);
}

export default AppLayout;

{
	/* {downloads.filter(
                        (download) => download?.filepath === null
                      ).length > 0 && (
                        <Animatable.View
                          animation={"tada"}
                          iterationCount={"infinite"}
                          style={{
                            position: "absolute",
                            top: -15,
                            right: -15,
                            backgroundColor: theme.colors.primaryContainer,
                            height: 28,
                            width: 28,
                            borderColor: theme.colors.surface,
                            borderWidth: 4,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 30,
                          }}
                        >
                          <Text
                            style={{
                              color: theme.colors.onPrimaryContainer,
                              fontWeight: "bold",
                            }}
                          >
                            {
                              downloads.filter(
                                (download) => download.filepath === null
                              ).length
                            }
                          </Text>
                        </Animatable.View>
                      )} */
}
