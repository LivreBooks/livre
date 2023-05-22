import { StyleSheet, View } from "react-native";
import React, { ReactNode, useEffect, useState } from "react";
import BasePage from "../components/BasePage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { LiveAppState, SettingsStore } from "../store/store";
import { Button, Avatar, SegmentedButtons, Switch, Text, ActivityIndicator } from "react-native-paper";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { theme } from "../constants";
import { UserType } from "../types";


function Card({ title, children }: { title: string, children: ReactNode }) {
  return (
    <View style={{ paddingVertical: 10, paddingHorizontal: 20, marginVertical: 10, backgroundColor: LiveAppState.themeValue.get().colors.surface, borderRadius: 10 }}>
      <Text
        style={{ marginBottom: 10, fontWeight: "bold", fontSize: 20, textAlign: 'center' }}
        theme={LiveAppState.themeValue.get()}
      >
        {title}
      </Text>
      {children}
    </View>
  )
}

WebBrowser.maybeCompleteAuthSession();

const account = () => {
  const [theme, setTheme] = useState(SettingsStore.theme.get());

  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(SettingsStore.user.get());
  const [creatingAccount, setCreatingAccount] = useState(false)
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "119960243223-vvjr9qm1qt7ekcennt9mb6q0vnnhva85.apps.googleusercontent.com",
  });

  function createAccount(user: { id: string, name: string; email: string; picture: string }): Promise<UserType> {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      headers.append("Content-Type", "application/json")
      fetch(`https://livre.deno.dev/create_account`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.picture
        })
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          resolve(data.data)
        })
        .catch((err) => {
          reject(err)
          console.log(err);
        })
        .finally(() => {
          console.log("Account Request Done")
        });
    })
  }

  function signOut() {
    SettingsStore.user.set(null)
    setUserInfo(null);
  }

  useEffect(() => {
    if (response) {
      if (response?.type === "success") {
        setToken(response.authentication.accessToken);
        console.log({ token: response.authentication.accessToken })
        getUserInfo();
      } else {
        console.log("Error")
      }
    }
  }, [response, token]);

  const getUserInfo = async () => {
    if (!token) return
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const userData = await response.json();
      const user = await createAccount(userData);
      setUserInfo(user);
      const _user = { ...user, token }
      console.log(_user)
      SettingsStore.user.set(_user)
    } catch (error) {
      // Add your own error handler here
      console.log(error)
    }
    setCreatingAccount(false)
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
        <Card title="Details">
          {
            userInfo === null && creatingAccount === false &&
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
              <Button icon={"google"} buttonColor={'white'} onPress={() => { setCreatingAccount(true); promptAsync() }}> Sign In With Google </Button>
            </View>
          }
          {
            creatingAccount &&
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
              <ActivityIndicator size={"small"} color={LiveAppState.themeValue.get().colors.primary} />
            </View>
          }
          {
            userInfo &&
            <View>
              <View style={{ padding: 10, alignItems: 'center' }}>
                <Avatar.Image source={{ uri: userInfo.avatar }} />
                <Text theme={LiveAppState.themeValue.get()} style={{ fontSize: 20, fontWeight: 'bold' }}>{userInfo.name}</Text>
                <Text theme={LiveAppState.themeValue.get()}>{userInfo.email}</Text>
                <Button onPress={() => signOut()} mode="text" textColor={LiveAppState.themeValue.get().colors.error} style={{ marginBottom: -10 }} >Sign Out</Button>
              </View>
            </View>
          }
        </Card>
        <Card title="Theme">
          <SegmentedButtons
            value={theme}
            onValueChange={(value: 'auto' | 'light' | 'dark') => {
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
        </Card>
        <Card title="Payments">
        </Card>
      </View>
    </BasePage>
  );
};


export default account;

const styles = StyleSheet.create({});
