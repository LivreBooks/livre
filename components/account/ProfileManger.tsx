import { ActivityIndicator, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Button, Text } from "react-native-paper";
import { LiveAppState, SettingsStore, UserStore } from "../../store/store";
import { Account, GoogleUser, NewUser, UserProfile } from "../../types/types";
import * as Google from "expo-auth-session/providers/google";
import { FetchResponse, fetchUtil } from "../../utils";
import { BASE_URL } from "../../constants";

const ProfileManger = () => {
  const [accountInfo, setAccountInfo] = useState<Account | null>(
    UserStore.account.get()
  );

  const [googleToken, setGoogleToken] = useState("");

  const [creatingAccount, setCreatingAccount] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "119960243223-vvjr9qm1qt7ekcennt9mb6q0vnnhva85.apps.googleusercontent.com",
  });

  const [fetchingUserProfile, setFetchingUserProfile] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const createAccount = async (user: NewUser): Promise<Account> => {
    const response: FetchResponse<{ data: Account }> = await fetchUtil<{
      data: Account;
    }>(`${BASE_URL}/create_account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user.id,
        fullname: user.name,
        email: user.email,
        avatar_url: user.picture,
      }),
    });

    if (response.error) {
      console.error(response.error);
      throw response.error; // Reject the Promise if there's an error
    }

    UserStore.account.set(response.data.data);
    setAccountInfo(response.data.data);
    return response.data.data;
  };

  const getUserInfoFromGoogle = async () => {
    if (!googleToken) return;

    try {
      const response: FetchResponse<GoogleUser> = await fetchUtil<GoogleUser>(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: {
            Authorization: `Bearer ${googleToken}`,
          },
        }
      );

      if (response.error) {
        console.error(response.error);
        throw response.error; // Add your own error handling logic here
      }

      const user = await createAccount(response.data);
      await fetchUserProfile();
    } catch (error) {
      // Add your own error handling logic here
      console.log(error);
    }

    setCreatingAccount(false);
  };

  async function fetchUserProfile() {
    const user_id = UserStore.account.id.get();
    if (!user_id) {
      return;
    }
    setFetchingUserProfile(true);
    const { data, error, status } = await fetchUtil<UserProfile>(
      `${BASE_URL}/get_user_profile?user_id=${user_id}`
    );
    setFetchingUserProfile(false);
    if (error) {
      console.log(error);
      return;
    }
    setAccountInfo(data.account);
    UserStore.account.set(data.account);
    UserStore.downloads.set(data.downloads);
    UserStore.purchases.set(data.purchases);
  }

  function signOut() {
    SettingsStore.user.set(null);
    setAccountInfo(null);
  }

  useEffect(() => {
    if (response) {
      if (response?.type === "success") {
        console.log("=================");
        setGoogleToken(response.authentication.accessToken);
        console.log({ token: response.authentication.accessToken });
        getUserInfoFromGoogle();
      } else {
        console.log("Error");
      }
    }
  }, [response, googleToken]);

  useEffect(() => {
    // console.log(UserStore.account.get());
    fetchUserProfile();
  }, []);
  return (
    <View
      style={{
        backgroundColor: LiveAppState.themeValue.colors.surface.get(),
        padding: 15,
        borderRadius: 20,
      }}
    >
      {accountInfo === null && creatingAccount === false && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            mode="contained"
            icon={"google"}
            onPress={() => {
              setCreatingAccount(true);
              promptAsync();
            }}
            labelStyle={{ fontWeight: "bold" }}
          >
            Sign In
          </Button>
        </View>
      )}
      {creatingAccount && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 20,
          }}
        >
          <ActivityIndicator
            size={"small"}
            color={LiveAppState.themeValue.get().colors.primary}
          />
        </View>
      )}
      {accountInfo && (
        <View>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 20,
            }}
          >
            {accountInfo.avatar_url && (
              <Avatar.Image source={{ uri: accountInfo.avatar_url }} />
            )}
            <View
              style={{
                marginLeft: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 5,
                }}
              >
                {accountInfo.fullname}
              </Text>
              <Text>{accountInfo.email}</Text>
            </View>
          </View>
          <Button
            mode="text"
            onPress={() => signOut()}
            textColor={LiveAppState.themeValue.get().colors.error}
          >
            Sign Out
          </Button>
        </View>
      )}
    </View>
  );
};

export default ProfileManger;

const styles = StyleSheet.create({});
