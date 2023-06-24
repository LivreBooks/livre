import { StyleSheet } from "react-native";
import React from "react";
import * as Animatable from "react-native-animatable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";
import { LiveAppState } from "../store/store";

const BasePageHeader = ({ title, icon }: { title: string; icon: string }) => {
  return (
    <Animatable.View
      animation={"fadeInUp"}
      style={{
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Text
        variant="headlineMedium"
        style={{
          fontWeight: "bold",
          color: LiveAppState.themeValue.get().colors.primary,
        }}
      >
        {title}
      </Text>
    </Animatable.View>
  );
};

export default BasePageHeader;

const styles = StyleSheet.create({});
