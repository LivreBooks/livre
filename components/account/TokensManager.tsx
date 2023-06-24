import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { LiveAppState, UserStore } from "../../store/store";
import { Text, Button } from "react-native-paper";

const TokensManager = ({
  openPaypalWebview,
}: {
  openPaypalWebview: () => void;
}) => {
  const [accountInfo] = useState(UserStore.account.get());
  const [showTokenForm, setShowTokenForm] = useState(false);

  return (
    <View
      style={{
        paddingTop: 10,
        paddingBottom: 15,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginBottom: 10,
        backgroundColor: LiveAppState.themeValue.colors.primaryContainer.get(),
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
        <TokensForm
          close={() => setShowTokenForm(false)}
          openPaypalWebview={() => openPaypalWebview()}
        />
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
  );
};

const TokensForm = ({
  close,
  openPaypalWebview,
}: {
  close: () => void;
  openPaypalWebview: () => void;
}) => {
  const [tokensToBuy, setTokensToBuy] = useState(5);

  return (
    <View
      style={{
        backgroundColor: LiveAppState.themeValue.colors.background.get(),
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
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 5,
            }}
          >
            Buy Tokens
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 22 }}>
            {tokensToBuy}
          </Text>
          <Text> Tokens </Text>
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <Text>for</Text>
            <Text style={{ marginLeft: 5, fontWeight: "bold" }}>
              {(tokensToBuy * 0.1).toFixed(1)} USD
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
            children={""}
          />
          <Button
            icon={"plus"}
            mode="contained-tonal"
            onPress={() => setTokensToBuy((tokens) => tokens + 1)}
            children={""}
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
          onPress={() => close()}
        >
          Cancel
        </Button>
        <Button
          style={{ width: "65%" }}
          mode="contained"
          onPress={() => openPaypalWebview()}
        >
          Proceed
        </Button>
      </View>
    </View>
  );
};

export default TokensManager;
