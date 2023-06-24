import { View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import BasePage from "../components/BasePage";
import { LiveAppState, SettingsStore, UserStore } from "../store/store";
import { Text, IconButton } from "react-native-paper";
import * as WebBrowser from "expo-web-browser";
import {
  Download,
  Purchase,
  UserProfile,
  WebviewRequirements,
  PaypalWebviewMessage,
  PaypalWebviewSuccessMessage,
  PaypalWebviewFailedMessage,
} from "../types";
import PurchasesBottomSheet from "../components/account/PurchasesBottomSheet";
import PaymentBottomSheet from "../components/account/PaymentBottomSheet";
import DownloadsBottomSheet from "../components/account/DownloadsBottomSheet";
import ThemeManager from "../components/account/ThemeManager";
import TokensManager from "../components/account/TokensManager";
import ProfileManger from "../components/account/ProfileManger";
import Spacer from "../components/Spacer";
import { BASE_URL } from "../constants";
import { fetchUtil } from "../utils";

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
          backgroundColor: LiveAppState.themeValue.colors.surface.get(),
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontWeight: "bold" }}>{label}</Text>
        <IconButton icon={"chevron-up"} />
      </View>
    </TouchableOpacity>
  );
};

WebBrowser.maybeCompleteAuthSession();

const account = () => {
  const [reRender, setReRender] = useState(1);

  const [showThemeManager, setShowThemeManager] = useState(false);

  const [tokensToBuy, setTokensToBuy] = useState(5);

  const [showTokenForm, setShowTokenForm] = useState(false);

  const [showWebview, setShowWebview] = useState(false);

  const [downloads, setDownloads] = useState<Download[]>([]);

  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const [showPurchases, setShowPurchases] = useState(false);

  const [showDownloads, setShowDownloads] = useState(false);

  const [webviewData, setWebviewData] = useState<WebviewRequirements>(null);

  function openPaypalWebview() {
    setShowTokenForm(false);
    setWebviewData({
      avatar: UserStore.account.avatar_url.get(),
      email: UserStore.account.email.get(),
      name: UserStore.account.fullname.get(),
      tokens: tokensToBuy,
      user_id: UserStore.account.id.get(),
    });
    setShowWebview(true);
  }

  function handlePaymentWebviewClose(
    data?: PaypalWebviewSuccessMessage | PaypalWebviewFailedMessage
  ) {
    console.log("handlePaymentWebviewClose");
    setShowWebview(false);

    if (data?.isSuccesful) {
      console.log("Settting new account info");
      UserStore.account.set({
        ...UserStore.account.get(),
        tokens: UserStore.account.tokens.get() + data.tokens,
      });
    } else {
      console.log(data);
    }
  }

  UserStore.onChange(() => {
    setReRender(Math.random());
  });

  return (
    <>
      <BasePage headerInfo={{ title: "Account", icon: "account" }}>
        <View
          style={{
            height: "100%",
            width: "100%",
            paddingHorizontal: 5,
          }}
        >
          <ProfileManger />

          <Spacer height={10} />

          <TokensManager openPaypalWebview={() => openPaypalWebview()} />

          <BottomSheetOpener
            label="Theme"
            onPress={() => setShowThemeManager(true)}
          />
          <Spacer height={10} />
          <BottomSheetOpener
            label="Purchases"
            onPress={() => setShowPurchases(true)}
          />
          <Spacer height={10} />
          <BottomSheetOpener
            label="Downloads"
            onPress={() => setShowDownloads(true)}
          />
        </View>
      </BasePage>

      {showPurchases && (
        <PurchasesBottomSheet close={() => setShowPurchases(false)} />
      )}
      {showDownloads && (
        <DownloadsBottomSheet close={() => setShowDownloads(false)} />
      )}
      {showWebview && webviewData && (
        <PaymentBottomSheet
          close={(data) => handlePaymentWebviewClose(data)}
          data={webviewData}
        />
      )}
      {showThemeManager && (
        <ThemeManager close={() => setShowThemeManager(false)} />
      )}
    </>
  );
};

export default account;
