import BottomSheet from "@gorhom/bottom-sheet";
import React, { useRef, useMemo, useEffect, useState } from "react";
import { BackHandler, View, StyleSheet } from "react-native";
import { LiveAppState, UserStore } from "../../store/store";
import { Purchase } from "../../types/types";
import CustomBackdrop from "../CustomBackdrop";
import { ScrollView } from "react-native-gesture-handler";
import { Text } from "react-native-paper";

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

const PurchasesBottomSheet = ({ close }: { close: () => void }) => {
  const [purchases, setPurchases] = useState(UserStore.purchases.get());
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

export default PurchasesBottomSheet;

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
