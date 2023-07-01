import BottomSheet from "@gorhom/bottom-sheet";
import React, { useRef, useMemo, useEffect, useState } from "react";
import { BackHandler, View, StyleSheet } from "react-native";
import { LiveAppState, UserStore } from "../../store/store";
import { Download } from "../../types/types";
import CustomBackdrop from "../CustomBackdrop";
import { ScrollView } from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import BaseImage from "../BaseImage";

const DownloadsBottomSheet = ({ close }: { close: () => void }) => {
  const [downloads, setDownloads] = useState(UserStore.downloads.get());

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
          flex: 1,
        }}
      >
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {download.book_name}
          </Text>
          <Text style={{ marginBottom: 20, opacity: 0.8 }}>
            {download.book_author}
          </Text>
        </View>
        <View>
          <Text style={{ fontSize: 12 }}>Downloaded On</Text>
          <Text>{new Date(download.read_on).toDateString()}</Text>
        </View>
      </View>
    </View>
  );
};

export default DownloadsBottomSheet;

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
