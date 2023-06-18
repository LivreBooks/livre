import BottomSheet from "@gorhom/bottom-sheet";
import { View, StyleSheet, TouchableOpacity, BackHandler } from "react-native";
import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import BasePage from "../components/BasePage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { LiveAppState, SettingsStore } from "../store/store";
import {
  Text,
  Button,
  Avatar,
  SegmentedButtons,
  ActivityIndicator,
  IconButton,
  TextInput,
} from "react-native-paper";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  Account,
  Download,
  GoogleUser,
  NewUser,
  Purchase,
  UserProfile,
  UserType,
  WebviewRequirements,
  WebviewReturnType,
} from "../types";
import { BASE_URL } from "../constants";
import { FetchResponse, fetchUtil, objectToSearchParams } from "../utils";
import { ScrollView } from "react-native-gesture-handler";
import CustomBackdrop from "../components/CustomBackdrop";
import BaseImage from "../components/BaseImage";
import WebView from "react-native-webview";

const PaymentBottomSheet = ({
  data,
  close,
}: {
  data: WebviewRequirements;
  close: () => void;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const webviewRef = useRef<WebView>();

  const snapPoints = useMemo(() => ["95%"], []);

  const [url] = useState(
    `https://livre.framer.website/paypal?${objectToSearchParams(data)}`
  );

  function onWebviewMessage(e: any) {
    let data = e.nativeEvent.data as WebviewReturnType;
    console.log(data);
    close();
  }

  useEffect(() => {
    const handle = BackHandler.addEventListener("hardwareBackPress", () => {
      close();
      return true;
    });
    return () => {
      handle.remove();
    };
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={{
        backgroundColor: LiveAppState.themeValue.get().colors.surface,
      }}
      handleIndicatorStyle={{
        width: "12%",
        backgroundColor: LiveAppState.themeValue.get().colors.background,
        height: 6,
        borderRadius: 10,
      }}
      enablePanDownToClose
      backdropComponent={CustomBackdrop}
      onClose={() => close()}
    >
      <WebView
        ref={webviewRef}
        source={{ uri: url }}
        onMessage={onWebviewMessage}
      />
    </BottomSheet>
  );
};

const BottomSheetOpener = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View
        style={{
          padding: 5,
          paddingLeft: 20,
          borderRadius: 20,
          marginBottom: 10,
          backgroundColor: LiveAppState.themeValue.colors.surface.get(),
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontWeight: "bold" }}>{label}</Text>
        <IconButton icon={"chevron-down"} />
      </View>
    </TouchableOpacity>
  );
};

const DownloadsBottomSheet = ({
  downloads,
  close,
}: {
  downloads: Download[];
  close: () => void;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["85%"], []);

  useEffect(() => {
    const handle = BackHandler.addEventListener("hardwareBackPress", () => {
      close();
      return true;
    });
    return () => {
      handle.remove();
    };
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={{
        backgroundColor: LiveAppState.themeValue.get().colors.surface,
      }}
      handleIndicatorStyle={{
        width: "12%",
        backgroundColor: LiveAppState.themeValue.get().colors.background,
        height: 6,
        borderRadius: 10,
      }}
      enablePanDownToClose
      backdropComponent={CustomBackdrop}
      onClose={() => close()}
    >
      <View style={{ padding: 10, paddingHorizontal: 15, height: "99.8%" }}>
        <Text
          style={{
            marginBottom: 20,
            fontWeight: "bold",
            fontSize: 22,
            textAlign: "center",
          }}
        >
          Downloads
        </Text>
        <ScrollView>
          {downloads.map((download) => (
            <DownloadCard download={download} key={download.id} />
          ))}
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

const DownloadCard = ({ download }: { download: Download }) => {
  return (
    <View
      style={{
        ...styles.container,
        flexDirection: "row",
        padding: 15,
        borderRadius: 15,
        backgroundColor: LiveAppState.themeValue.colors.background.get(),
      }}
    >
      <BaseImage
        style={{ height: 160, width: 100, borderRadius: 5 }}
        source={{ uri: download.book_cover }}
        placeholderStyles={{
          height: 200,
          width: 140,
          borderRadius: 5,
          top: 10,
          left: 10,
        }}
      />
      <View
        style={{
          paddingLeft: 10,
          paddingVertical: 5,
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            {download.book_name}
          </Text>
          <Text style={{ marginBottom: 20 }}>{download.book_author}</Text>
        </View>
        <View>
          <Text style={{ fontSize: 12 }}>Downloaded on</Text>
          <Text>{new Date(download.read_on).toDateString()}</Text>
        </View>
      </View>
    </View>
  );
};

const PurchasesBottomSheet = ({
  purchases,
  close,
}: {
  purchases: Purchase[];
  close: () => void;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["85%"], []);

  useEffect(() => {
    const handle = BackHandler.addEventListener("hardwareBackPress", () => {
      close();
      return true;
    });
    return () => {
      handle.remove();
    };
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={{
        backgroundColor: LiveAppState.themeValue.get().colors.surface,
      }}
      handleIndicatorStyle={{
        width: "12%",
        backgroundColor: LiveAppState.themeValue.get().colors.background,
        height: 6,
        borderRadius: 10,
      }}
      enablePanDownToClose
      backdropComponent={CustomBackdrop}
      onClose={() => close()}
    >
      <View style={{ padding: 10, paddingHorizontal: 15, height: "99.8%" }}>
        <Text
          style={{
            marginBottom: 20,
            fontWeight: "bold",
            fontSize: 22,
            textAlign: "center",
          }}
        >
          Purchases
        </Text>
        <ScrollView>
          {purchases.map((purchase) => (
            <PurchaseCard purchase={purchase} key={purchase.id} />
          ))}
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

const PurchaseCard = ({ purchase }: { purchase: Purchase }) => {
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: LiveAppState.themeValue.colors.background.get(),
      }}
    >
      {/* <Text style={{ ...styles.value, textAlign: "center" }}>
        {purchase.id}
      </Text> */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.value}>
          {purchase.price} {purchase.currency}
        </Text>
        <Text style={{ ...styles.value, fontWeight: "bold" }}>
          {purchase.tokens} Tokens
        </Text>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.value}>{purchase.purchase_date}</Text>
        <Text style={styles.value}>via {purchase.provider}</Text>
      </View>
    </View>
  );
};

function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <View
      style={{
        padding: 20,
        marginBottom: 10,
        backgroundColor: LiveAppState.themeValue.get().colors.surface,
        borderRadius: 20,
      }}
    >
      {title && (
        <Text
          style={{
            marginBottom: 10,
            fontWeight: "bold",
            fontSize: 20,
            textAlign: "center",
          }}
        >
          {title}
        </Text>
      )}
      {children}
    </View>
  );
}

WebBrowser.maybeCompleteAuthSession();

const account = () => {
  const [theme, setTheme] = useState(SettingsStore.theme.get());

  const [googleToken, setGoogleToken] = useState("");

  const [accountInfo, setAccountInfo] = useState<Account | null>(
    SettingsStore.user.get()
  );

  const [livreToken, setLivreTokens] = useState(0);

  const [tokensToBuy, setTokensToBuy] = useState(5);

  const [showTokenForm, setShowTokenForm] = useState(false);

  const [showWebview, setShowWebview] = useState(false);

  const [downloads, setDownloads] = useState<Download[]>([]);

  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const [showPurchases, setShowPurchases] = useState(false);

  const [showDownloads, setShowDownloads] = useState(false);

  const [creatingAccount, setCreatingAccount] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "119960243223-vvjr9qm1qt7ekcennt9mb6q0vnnhva85.apps.googleusercontent.com",
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [fetchingUserProfile, setFetchingUserProfile] = useState(false);

  const [webviewData, setWebviewData] = useState<WebviewRequirements>(null);

  function openWebview() {
    setShowTokenForm(false);
    setWebviewData({
      avatar: accountInfo.avatar_url,
      email: accountInfo.email,
      name: accountInfo.fullname,
      tokens: tokensToBuy,
      user_id: accountInfo.id,
    });
    setShowWebview(true);
  }

  const createAccount = async (user: NewUser): Promise<UserType> => {
    const response: FetchResponse<{ data: UserType }> = await fetchUtil<{
      data: UserType;
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

    console.log(response.data);
    return response.data.data;
  };

  function signOut() {
    SettingsStore.user.set(null);
    setAccountInfo(null);
  }

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
      console.log("++++++++");
      console.log(user);
      console.log("++++++++");
      setAccountInfo(user);
      const _user = { ...user, token: googleToken };
      console.log(_user);
      SettingsStore.user.set(_user);
    } catch (error) {
      // Add your own error handling logic here
      console.log(error);
    }

    setCreatingAccount(false);
  };

  async function fetchUserProfile() {
    console.log("========");
    console.log(SettingsStore.user.get());
    const user_id = SettingsStore.user.id.get();
    console.log(user_id);
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
    console.log(data);
    setUserProfile(data);
    setAccountInfo(data.account);
  }

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (response) {
      if (response?.type === "success") {
        setGoogleToken(response.authentication.accessToken);
        console.log({ token: response.authentication.accessToken });
        getUserInfoFromGoogle();
      } else {
        console.log("Error");
      }
    }
  }, [response, googleToken]);

  return (
    <>
      <BasePage>
        <View
          style={{
            height: "100%",
            width: "100%",
            paddingHorizontal: 5,
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
          <Card>
            {accountInfo === null && creatingAccount === false && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 20,
                }}
              >
                <Button
                  icon={"google"}
                  buttonColor={"white"}
                  onPress={() => {
                    setCreatingAccount(true);
                    promptAsync();
                  }}
                >
                  Sign In With Google
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
                  onPress={() => signOut()}
                  buttonColor={
                    LiveAppState.themeValue.get().colors.errorContainer
                  }
                  textColor={LiveAppState.themeValue.get().colors.error}
                >
                  Sign Out
                </Button>
              </View>
            )}
          </Card>
          <View
            style={{
              paddingTop: 10,
              paddingBottom: 15,
              paddingHorizontal: 20,
              borderRadius: 20,
              marginBottom: 10,
              backgroundColor:
                LiveAppState.themeValue.colors.primaryContainer.get(),
            }}
          >
            <View style={{ alignItems: "center", marginBottom: 10 }}>
              <Text
                style={{
                  fontWeight: "900",
                  fontSize: 26,
                  color: LiveAppState.themeValue.colors.primary.get(),
                }}
              >
                {accountInfo.tokens}
              </Text>
              <Text
                style={{
                  color: LiveAppState.themeValue.colors.primary.get(),
                }}
              >
                Tokens
              </Text>
            </View>
            {showTokenForm ? (
              <View
                style={{
                  backgroundColor:
                    LiveAppState.themeValue.colors.background.get(),
                  padding: 20,
                  marginBottom: 10,
                  borderRadius: 20,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    marginBottom: 20,
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      marginBottom: 5,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontWeight: "bold", fontSize: 22 }}>
                      {tokensToBuy}
                    </Text>
                    <Text> Tokens </Text>
                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                      <Text>for</Text>
                      <Text style={{ marginLeft: 5, fontWeight: "bold" }}>
                        {(tokensToBuy * 0.1).toFixed(1)} $
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      width: "80%",
                      justifyContent: "space-between",
                      marginBottom: 5,
                    }}
                  >
                    <Button
                      icon={"minus"}
                      mode="contained-tonal"
                      onPress={() => setTokensToBuy((tokens) => tokens - 1)}
                      disabled={tokensToBuy === 5 ? true : false}
                    />
                    <Button
                      icon={"plus"}
                      mode="contained-tonal"
                      onPress={() => setTokensToBuy((tokens) => tokens + 1)}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    mode="text"
                    style={{ width: "30%" }}
                    buttonColor={LiveAppState.themeValue.colors.surface.get()}
                    textColor={LiveAppState.themeValue.colors.text.get()}
                    onPress={() => setShowTokenForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{ width: "65%" }}
                    mode="contained"
                    onPress={() => openWebview()}
                  >
                    Proceed
                  </Button>
                </View>
              </View>
            ) : (
              <Button
                mode="contained"
                icon={"atom-variant"}
                contentStyle={{ height: 45 }}
                style={{ borderRadius: 30 }}
                onPress={() => setShowTokenForm(true)}
              >
                Add Tokens
              </Button>
            )}
          </View>
          <Card title="Theme">
            <SegmentedButtons
              value={theme}
              onValueChange={(value: "auto" | "light" | "dark") => {
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
          <BottomSheetOpener
            label="Purchases"
            onPress={() => setShowPurchases(true)}
          />
          <BottomSheetOpener
            label="Downloads"
            onPress={() => setShowDownloads(true)}
          />
        </View>
      </BasePage>

      {showPurchases && (
        <PurchasesBottomSheet
          purchases={purchases}
          close={() => setShowPurchases(false)}
        />
      )}
      {showDownloads && (
        <DownloadsBottomSheet
          downloads={downloads}
          close={() => setShowDownloads(false)}
        />
      )}
      {showWebview && webviewData && (
        <PaymentBottomSheet
          close={() => setShowWebview(false)}
          data={webviewData}
        />
      )}
    </>
  );
};

export default account;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  value: {
    marginBottom: 8,
  },
});
