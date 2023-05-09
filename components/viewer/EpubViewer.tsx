import {
  StyleSheet,
  Image,
  Text,
  View,
  useWindowDimensions,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect } from "react";
import { WebView } from "react-native-webview";
import { Reader, ReaderProvider, useReader } from "@epubjs-react-native/core";
// import { useFileSystem } from '@epubjs-react-native/file-system';
import { useFileSystem } from "@epubjs-react-native/expo-file-system"; // for Expo project
import { ScrollView } from "react-native-gesture-handler";
import { theme } from "../../constants";
import ViewerLoading from "./ViewerLoading";
import { Card, IconButton } from "react-native-paper";
import { LiveAppState } from "../../store/store";

const EpubViewer = ({
  fileUri,
  bookCover,
  page = 1,
  onLoad,
}: {
  fileUri: string;
  bookCover: string;
  page?: number;
  onLoad: (payload: any) => void;
}) => {
  const { width, height } = useWindowDimensions();
  const { goNext: goToNextEpubPage, goPrevious: goToPreviousEpubPage } =
    useReader();

  return (
    <View style={{ position: "relative", flex: 1, width: "100%" }}>
      <View pointerEvents="none">
        <Reader
          src={fileUri}
          width={width}
          height={height - 110}
          fileSystem={useFileSystem}
          enableSelection={false}
          enableSwipe={false}
          onReady={(...data) => {
            console.log("=========");
            console.log(data);
          }}
          renderOpeningBookComponent={() => (
            <ViewerLoading bookCover={bookCover} />
          )}
        />
      </View>
      <Card
        contentStyle={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: -10,
          left: Dimensions.get("screen").width / 2 - 42,
          borderRadius: 20,
          backgroundColor: LiveAppState.themeValue.get().colors.inversePrimary,
        }}
      >
        <IconButton
          icon={"chevron-left"}
          mode="contained"
          containerColor={theme.colors.primary}
          iconColor={theme.colors.background}
          size={15}
          onPress={() => {
            goToPreviousEpubPage();
          }}
          style={{ borderRadius: 20 }}
        />
        <IconButton
          icon={"chevron-right"}
          mode="contained"
          containerColor={theme.colors.primary}
          iconColor={theme.colors.background}
          size={15}
          onPress={() => {
            goToNextEpubPage();
          }}
          style={{ borderRadius: 20 }}
        />
      </Card>
    </View>
  );
};

export default EpubViewer;

const styles = StyleSheet.create({});
