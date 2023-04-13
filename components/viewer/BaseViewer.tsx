import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { theme } from "../../constants";
import PdfViewer from "./PdfViewer";
import { DownloadType } from "../../types";

const BaseViewer = ({ download }: { download: DownloadType }) => {
  return (
    <View
      style={{
        height: "100%",
        justifyContent: "flex-start",

        backgroundColor: theme.colors.background,
      }}
    >
      {download.book.extension === "pdf" && (
        <PdfViewer
          bookCover={download.book.base64Cover}
          fileUri={download.filepath}
        />
      )}
      {download.book.extension === "djvu" && (
        <View>
          <Text>DJVU Reader</Text>
        </View>
      )}
      {download.book.extension === "epub" && (
        <View>
          <Text>EPUB Reader</Text>
        </View>
      )}
    </View>
  );
};

export default BaseViewer;

const styles = StyleSheet.create({});
