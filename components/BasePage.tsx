import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native-animatable";
import { ViewStyle } from "react-native/types";
import { LiveAppState, SettingsStore } from "../store/store";
import BasePageHeader from "./BasePageHeader";

function BasePage(props: {
  styles?: ViewStyle;
  headerInfo?: {
    title: string;
    icon: string;
  };
  children:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal;
}) {
  const [theme, setTheme] = useState(SettingsStore.theme.get());

  SettingsStore.theme.onChange((newTheme) => {
    setTheme(newTheme);
  });

  useEffect(() => {}, [theme]);

  return (
    <SafeAreaProvider>
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          width: "100%",
          backgroundColor: LiveAppState.themeValue.get().colors.background,
          ...props.styles,
        }}
      >
        {props.headerInfo && (
          <BasePageHeader
            title={props.headerInfo.title}
            icon={props.headerInfo.icon}
          />
        )}

        <View
          style={{
            paddingHorizontal: props.headerInfo ? 10 : 0,
            width: "100%",
          }}
        >
          {props.children}
        </View>
      </View>
    </SafeAreaProvider>
  );
}

export default BasePage;
