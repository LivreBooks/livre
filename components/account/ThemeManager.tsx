import { BackHandler, View } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { SegmentedButtons } from "react-native-paper";
import { LiveAppState, SettingsStore } from "../../store/store";
import { Text } from "react-native-paper";
import BottomSheet from "@gorhom/bottom-sheet";
import CustomBackdrop from "../CustomBackdrop";

const ThemeManger = ({ close }: { close: () => void }) => {
  const [theme, setTheme] = useState(SettingsStore.theme.get());

  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["30%"], []);

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
        backgroundColor: LiveAppState.themeValue.colors.background.get(),
      }}
      handleIndicatorStyle={{
        width: "12%",
        backgroundColor: LiveAppState.themeValue.colors.text.get(),
        height: 6,
      }}
      enablePanDownToClose
      backdropComponent={CustomBackdrop}
      onClose={() => close()}
    >
      <View
        style={{
          paddingVertical: 5,
          paddingHorizontal: 15,
          height: "99.8%",
          backgroundColor: LiveAppState.themeValue.colors.background.get(),
        }}
      >
        <Text
          style={{
            marginBottom: 10,
            fontWeight: "bold",
            fontSize: 20,
            textAlign: "center",
          }}
        >
          Theme
        </Text>
        <View
          style={{
            padding: 20,
            marginBottom: 10,
            backgroundColor: LiveAppState.themeValue.get().colors.surface,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              marginBottom: 10,
            }}
          >
            Select Theme
          </Text>
          <SegmentedButtons
            value={theme}
            onValueChange={(value: "auto" | "light" | "dark") => {
              SettingsStore.theme.set(value);
              setTheme(value);
            }}
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
            density="regular"
          />
        </View>
      </View>
    </BottomSheet>
  );
};

export default ThemeManger;
