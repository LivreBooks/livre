import { Dimensions, StyleSheet, View } from "react-native";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useRef } from "react";
import Pdf from "react-native-pdf";

import { theme } from "../../constants";
import ViewerLoading from "./ViewerLoading";

const PdfViewer = ({
  fileUri,
  bookCover,
  page = 1,
  setPages,
  setCurrentpage,
}: {
  fileUri: string;
  bookCover: string;
  page?: number;
  setPages: (value: number) => void
  setCurrentpage: (value: number) => void
}) => {
  const pdfViewerRef = useRef(null);

  useEffect(() => {
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
          setPages(numberOfPages)
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
          setCurrentpage(page)
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
