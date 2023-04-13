import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import BaseViewer from "../../components/viewer/BaseViewer";
import { DownloadsStore } from "../../store/store";
import { useSearchParams } from "expo-router";

interface SearchParams {
  downloadId: string;
}
const reader = () => {
  const { downloadId } = useSearchParams();
  console.log(downloadId);
  const [download, setDowload] = useState(
    DownloadsStore.get().downloads.find(
      (download) => download.downloadId === parseInt(downloadId)
    )
  );

  useEffect(() => {
    // console.log(download);
  }, []);
  return <View>{download && <BaseViewer download={download} />}</View>;
};

export default reader;

const styles = StyleSheet.create({});
