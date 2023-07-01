import { BackHandler, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import BaseViewer from "../../components/viewer/BaseViewer";
import { DownloadsStore } from "../../store/store";
import { useRouter, useSearchParams } from "expo-router";

const reader = () => {
  const router = useRouter();
  const { downloadId } = useSearchParams();
  //console.log(downloadId);
  const [download] = useState(
    DownloadsStore.get().downloads.find(
      (download) => download.downloadId === parseInt(downloadId as string)
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
