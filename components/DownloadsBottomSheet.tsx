import {
  BackHandler,
  NativeEventSubscription,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { theme } from "../constants";
import { Button, Text } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BookCard from "./BookCard";
import DonwnloadItem from "./DonwnloadItem";
import { DownloadsStore } from "../store/store";
import { usePathname } from "expo-router";

const DownloadsBottomSheet = () => {
  const currentPath = usePathname();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["35%", "60%", "90%"], []);

  const [downloads, setDownloads] = useState(DownloadsStore.downloads.get());

  const [snapIndex, setSnapIndex] = useState(-1);
  const [forcedClose, setForcedClose] = useState(false);
  // const [backHandler, setBackHandler] = useState<NativeEventSubscription>(null);

  DownloadsStore.downloads.onChange((payload) => {
    console.log("Change: " + Math.random());
    setDownloads(payload);
    if (snapIndex === -1 && downloads.length != payload.length) {
      show();
    }
  });

  function hide() {
    setSnapIndex(-1);
    // backHandler.remove();
  }
  function show() {
    setSnapIndex(0);
    // const _backHandler = BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   () => {
    //     setForcedClose(true);
    //     hide();
    //     return true;
    //   }
    // );
    // setBackHandler(_backHandler);
  }

  useEffect(() => {
    // const _backHandler = BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   () => {
    //     setForcedClose(true);
    //     hide();
    //     return true;
    //   }
    // );
    // setBackHandler(_backHandler);
    // return () => {
    //   backHandler.remove();
    // };
  }, []);

  return (
    <>
      {snapIndex === -1 && currentPath !== "/library/reader" && (
        <Pressable
          onPress={() => show()}
          style={{
            position: "absolute",
            bottom: 50,
            right: 0,
            zIndex: 0,
            backgroundColor: theme.colors.surface,
            borderRadius: 10,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            padding: 5,
            paddingHorizontal: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="chevron-up"
            size={18}
            color={theme.colors.text}
          />
          {downloads.filter(
            (download) => download && download.filepath === null
          ).length > 0 && (
            <Text>
              {
                downloads.filter(
                  (download) => download && download.filepath === null
                ).length
              }
            </Text>
          )}
        </Pressable>
      )}

      <BottomSheet
        ref={bottomSheetRef}
        index={snapIndex}
        snapPoints={snapPoints}
        style={{ marginBottom: 20 }}
        backgroundStyle={{
          backgroundColor: theme.colors.surface,
          borderRadius: 20,
        }}
        handleIndicatorStyle={{
          width: "12%",
          backgroundColor: theme.colors.background,
          height: 6,
          borderRadius: 10,
        }}
        enablePanDownToClose
        onClose={() => {
          setForcedClose(true);
          hide();
        }}
      >
        <Text
          variant="titleLarge"
          style={{
            fontWeight: "bold",
            width: "100%",
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          Downloads
        </Text>
        <ScrollView>
          {downloads.map((download) => (
            <DonwnloadItem
              key={`${download.book.id}-${Math.random()}`}
              download={download}
            />
          ))}
        </ScrollView>
      </BottomSheet>
    </>
  );
};

export default DownloadsBottomSheet;

const styles = StyleSheet.create({});
