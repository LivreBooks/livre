import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import BasePage from "../components/BasePage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { LiveAppState, SettingsStore } from "../store/store";
import { Button, Card, SegmentedButtons, Switch, Text } from "react-native-paper";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { theme } from "../constants";


WebBrowser.maybeCompleteAuthSession();

const account = () => {
  const [theme, setTheme] = useState(SettingsStore.theme.get());

  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "GOOGLE_GUID.apps.googleusercontent.com",
    iosClientId: "GOOGLE_GUID.apps.googleusercontent.com",

  });

  useEffect(() => {
    if (response?.type === "success") {
      setToken(response.authentication.accessToken);
      getUserInfo();
    }
  }, [response, token]);

  const getUserInfo = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      setUserInfo(user);
    } catch (error) {
      // Add your own error handler here
      console.log(error)
    }
  };

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
        <View>
          <Button icon={"google"} buttonColor={'white'}> Sign In With Google </Button>
        </View>
      </View>
    </BasePage>
  );
};

export default account;

const styles = StyleSheet.create({});
