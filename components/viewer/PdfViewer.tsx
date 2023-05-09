import { Dimensions, Pressable, StyleSheet, View, Image } from "react-native";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Slider } from "@miblanchard/react-native-slider";
import Pdf from "react-native-pdf";

import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  IconButton,
  ProgressBar,
  Text,
} from "react-native-paper";
import { Foundation, MaterialCommunityIcons } from "@expo/vector-icons";
import { overlayColors, readerThemes, theme } from "../../constants";
import BottomSheet from "@gorhom/bottom-sheet";
import { useObservable } from "@legendapp/state/react";
import { Observable } from "@legendapp/state";
import { layoutAnimate } from "../../utils";
import ViewerLoading from "./ViewerLoading";

const PdfViewer = ({
  fileUri,
  bookCover,
  page = 1,
}: {
  fileUri: string;
  bookCover: string;
  page?: number;
}) => {
  const pdfViewerRef = useRef(null);

  useEffect(() => {
    console.log("---------");
    console.log(fileUri);
    console.log("---------");
    console.log(decodeURIComponent(fileUri));
    FileSystem.getInfoAsync(fileUri)
      .then((fileinfo) => {
        console.log(fileinfo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Pdf
        ref={pdfViewerRef}
        renderActivityIndicator={() => <ViewerLoading bookCover={bookCover} />}
        source={{ uri: `${decodeURIComponent(fileUri)}` }}
        enableAnnotationRendering
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
          // setTotalPages(numberOfPages);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
          // setCurrentPage(page);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={{
          ...styles.pdf,
          // transform: [
          //   {
          //     scale,
          //   },
          // ],
        }}
      />
    </View>
  );
};

export default PdfViewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    backgroundColor: theme.colors.background,
  },
});
