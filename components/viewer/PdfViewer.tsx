import { Dimensions, StyleSheet, View } from "react-native";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useRef, useImperativeHandle } from "react";
import Pdf from "react-native-pdf";

import { theme } from "../../constants";
import ViewerLoading from "./ViewerLoading";

const PdfViewer = React.forwardRef(
  (
    {
      fileUri,
      bookCover,
      page,
      setPages,
      setCurrentpage,
    }: {
      fileUri: string;
      bookCover: string;
      page?: number;
      setPages: (value: number) => void;
      setCurrentpage: (value: number) => void;
    },
    ref
  ) => {
    const pdfViewerRef = useRef<Pdf>(null);

    useImperativeHandle(ref, () => ({
      jumpToPage(page: number) {
        pdfViewerRef.current?.setPage(page);
      },
    }));

    useEffect(() => {
      //console.log({ page });
      FileSystem.getInfoAsync(fileUri)
        .then((fileinfo) => {
          //console.log(fileinfo);
        })
        .catch((error) => {
          //console.log(error);
        });
    }, []);

    return (
      <View style={{ flex: 1 }}>
        <Pdf
          ref={pdfViewerRef}
          renderActivityIndicator={() => (
            <ViewerLoading bookCover={bookCover} />
          )}
          source={{ uri: `${decodeURIComponent(fileUri)}` }}
          enableAnnotationRendering
          onLoadComplete={(numberOfPages, filePath) => {
            setPages(numberOfPages);
          }}
          onPageChanged={(page, numberOfPages) => {
            setCurrentpage(page);
          }}
          onError={(error) => {
            //console.log(error);
          }}
          onPressLink={(uri) => {
            //console.log(`Link pressed: ${uri}`);
          }}
          page={page}
          style={{
            ...styles.pdf,
          }}
        />
      </View>
    );
  }
);

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
