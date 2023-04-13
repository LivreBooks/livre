import React from "react";
import { Tabs } from "expo-router";
// import {BottomNavigationAction} from "react-native-paper"
import { ThemeProvider, DarkTheme } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Provider as PaperProvider } from "react-native-paper";
import { Platform, UIManager, View, Text } from "react-native";
import { theme } from "../constants";
import { StatusBar } from "expo-status-bar";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import { useObservable } from "@legendapp/state/react";
import { DownloadsStore } from "../store/store";
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function AppLayout() {
  // const downloads = useObservable(DownloadsStore.downloads.get());
  // DownloadsStore.downloads.onChange((_downloads) => {
  //   downloads.set(_downloads);
  // });

  return (
    <ThemeProvider value={DarkTheme}>
      <PaperProvider theme={theme}>
        <StatusBar style="light" backgroundColor={theme.colors.background} />
        <SafeAreaView style={{ flex: 1 }}>
          <Tabs
            initialRouteName="search"
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarStyle: {
                backgroundColor: theme.colors.surface,
                height: 50,
              },
              tabBarActiveTintColor: theme.colors.text,
            })}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "Search",
                href: "/",
                tabBarIcon: ({ color, size }) => {
                  return (
                    <MaterialCommunityIcons
                      name="book-search-outline"
                      size={size}
                      color={color}
                    />
                  );
                },
              }}
            />
            <Tabs.Screen
              name="explore"
              options={{
                title: "Explore",
                href: "/explore",
                tabBarIcon: ({ color, size }) => {
                  return (
                    <MaterialCommunityIcons
                      name="star-shooting-outline"
                      size={size}
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
                href: "/library",
                tabBarIcon: ({ color, size }) => {
                  return (
                    <View>
                      <MaterialCommunityIcons
                        name="bookshelf"
                        size={size}
                        color={color}
                      />
                      {/* {downloads.filter(
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
                      )} */}
                    </View>
                  );
                },
              }}
            />
          </Tabs>
        </SafeAreaView>
      </PaperProvider>
    </ThemeProvider>
  );
}

export default AppLayout;
