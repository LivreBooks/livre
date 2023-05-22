import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native-animatable";
import { darkMode, lightMode, theme } from "../constants";
import { ViewStyle } from "react-native/types";
import { LiveAppState, SettingsStore } from "../store/store";

function BasePage(props: {
  styles?: ViewStyle;
  children:
  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
  | React.ReactFragment
  | React.ReactPortal;
}) {
  const [theme, setTheme] = useState(SettingsStore.theme.get());

  SettingsStore.theme.onChange((newTheme) => {
    setTheme(newTheme);
  });

  useEffect(() => {
  }, [theme]);
  return (
    <SafeAreaProvider>
      <View
        style={{
          paddingTop: 10,
          paddingHorizontal: 10,
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          width: "100%",
          backgroundColor: LiveAppState.themeValue.get().colors.background,
          ...props.styles,
        }}
      >
        <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
          {props.children}
        </View>
      </View>
    </SafeAreaProvider>
  );
}

export default BasePage;
