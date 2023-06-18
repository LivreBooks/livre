import React, { useEffect, useState } from "react";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Provider as PaperProvider } from "react-native-paper";
import {
  Platform,
  UIManager,
  View,
  Text,
  Settings,
  useColorScheme,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { LiveAppState, SettingsStore } from "../store/store";
// import {
//   MaterialBottomTabNavigationOptions,
//   createMaterialBottomTabNavigator,
// } from "@react-navigation/material-bottom-tabs";
import { Tabs, withLayoutContext } from "expo-router";
import { darkMode, lightMode } from "../constants";

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

// console.log(Tabs);

function AppLayout() {
  const [theme, setTheme] = useState(SettingsStore.theme.get());
  const preferredTheme = useColorScheme();

  SettingsStore.theme.onChange((newTheme) => {
    if (newTheme === "dark") {
      LiveAppState.themeValue.set(darkMode);
    }

    if (newTheme === "light") {
      LiveAppState.themeValue.set(lightMode);
    }

    if (newTheme === "auto") {
      if (preferredTheme === "dark") {
        LiveAppState.themeValue.set(darkMode);
      }

      if (preferredTheme === "light") {
        LiveAppState.themeValue.set(lightMode);
      }
    }
    setTheme(newTheme);
  });

  useEffect(() => {
    setTheme(SettingsStore.theme.get())
    console.log(SettingsStore.theme.get());
    if (SettingsStore.theme.get() === "auto") {
      if (SettingsStore.theme.get() === "dark") {
        LiveAppState.themeValue.set(darkMode);
      }

      if (SettingsStore.theme.get() === "light") {
        LiveAppState.themeValue.set(lightMode);
      }
    } else {
      if (SettingsStore.theme.get() === "dark") {
        LiveAppState.themeValue.set(darkMode);
      }

      if (SettingsStore.theme.get() === "light") {
        LiveAppState.themeValue.set(lightMode);
      }
    }
  }, [theme]);

  return (
    <ThemeProvider value={LiveAppState.themeValue.get()}>
      <PaperProvider theme={LiveAppState.themeValue.get()}>
        <StatusBar
          style={SettingsStore.theme.get()}
          backgroundColor={LiveAppState.themeValue.get().colors.text}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <Tabs
            safeAreaInsets={{ bottom: 0 }}
            initialRouteName="search"
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarStyle: {
                backgroundColor:
                  LiveAppState.themeValue.get().colors.background,
                paddingBottom: 5,
                borderTopWidth: 0,
                borderTopColor: LiveAppState.themeValue.get().colors.secondary,
              },
              tabBarActiveTintColor:
                LiveAppState.themeValue.get().colors.primary,
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
    </ThemeProvider>
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
