import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import BasePage from "../components/BasePage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { LiveAppState, SettingsStore } from "../store/store";
import { Card, SegmentedButtons, Switch, Text } from "react-native-paper";
import { theme } from "../constants";

const account = () => {
  const [theme, setTheme] = useState(SettingsStore.theme.get());

  return (
    <BasePage>
      <View
        style={{
          height: "100%",
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <Animatable.View
          animation={"fadeInUp"}
          style={{ marginTop: 10, marginBottom: 20, flexDirection: "row" }}
        >
          <MaterialCommunityIcons
            name="account"
            size={35}
            color={LiveAppState.themeValue.get().colors.primary}
          />
          <Text
            variant="headlineLarge"
            style={{
              marginLeft: 5,
              fontWeight: "bold",
              color: LiveAppState.themeValue.get().colors.primary,
            }}
          >
            Account
          </Text>
        </Animatable.View>
        <View>
          <View style={{ padding: 10 }}>
            <Text
              style={{ marginBottom: 10, fontWeight: "bold", fontSize: 18 }}
              theme={LiveAppState.themeValue.get()}
            >
              Theme
            </Text>
            <SegmentedButtons
              value={theme}
              onValueChange={(value) => {
                SettingsStore.theme.set(value);
                setTheme(value);
              }}
              theme={LiveAppState.themeValue.get()}
              buttons={[
                {
                  value: "light",
                  label: "Light",
                  icon: "brightness-7",
                },
                {
                  value: "auto",
                  label: "Auto",
                  icon: "brightness-auto",
                },
                { value: "dark", label: "Dark", icon: "brightness-1" },
              ]}
            />
          </View>
        </View>
      </View>
    </BasePage>
  );
};

export default account;

const styles = StyleSheet.create({});
