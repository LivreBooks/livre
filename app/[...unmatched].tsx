import { Unmatched, useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native"
import { ActivityIndicator } from "react-native-paper";
import BasePage from "../components/BasePage";

export default function UnmatchedRouter() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/account")
  }, [])

  return <BasePage>
    <View style={{ width: "100%", height: "100%", alignItems: 'center', justifyContent: "center" }}>
      <ActivityIndicator color="gray" size={"small"} />
    </View>
  </BasePage>
};
