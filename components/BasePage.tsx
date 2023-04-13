import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native-animatable";
import { theme } from "../constants";
import { ViewStyle } from "react-native/types";

function BasePage(props: {
  styles: ViewStyle;
  children:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal;
}) {
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
          backgroundColor: theme.colors.background,
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
