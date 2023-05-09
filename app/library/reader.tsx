import { BackHandler, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import BaseViewer from "../../components/viewer/BaseViewer";
import { DownloadsStore } from "../../store/store";
import { useRouter, useSearchParams } from "expo-router";

interface SearchParams {
  downloadId: string;
}
const reader = () => {
  const router = useRouter();
  const { downloadId } = useSearchParams();
  console.log(downloadId);
  const [download, setDowload] = useState(
    DownloadsStore.get().downloads.find(
      (download) => download.downloadId === parseInt(downloadId)
    )
  );

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => {
      router.back();
      return true;
    });
  }, []);
  return <View>{download && <BaseViewer download={download} />}</View>;
};

export default reader;

const styles = StyleSheet.create({});
