import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Dimensions,
  Pressable,
  BackHandler,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { theme } from "../../../../../constants";
import {
  ActivityIndicator,
  Button,
  ProgressBar,
  Text,
} from "react-native-paper";
import { DownloadsStore, LiveAppState } from "../../../../../store/store";
import { Feather, Foundation } from "@expo/vector-icons";
import { dowloadBook, trimText } from "../../../../../utils";
import { DownloadType, FullBookType } from "../../../../../types";
import { useRouter, useSegments } from "expo-router";
import BaseImage from "../../../../../components/BaseImage";
import { useObservable } from "@legendapp/state/react";

const { width: sWidth, height: sHeight } = Dimensions.get("screen");

const BookPage = () => {
  const router = useRouter();
  const segments = useSegments();

  const bookPreview = LiveAppState.selectedBookPreInfo.get();

  const [loading, setLoading] = useState(false);
  const [fetchinDownloadLinks, setFetchinDownloadLinks] = useState(false);
  const [fullBook, setFullBook] = useState<FullBookType>(null);
  const [downloadedFilepath, setDownloadedFilepath] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(null);

  DownloadsStore.downloads.onChange((downloads) => {
    const found = downloads
      .filter((download) => (download ? true : false))
      .find((download) => download.book.id === bookPreview.id);
    if (found) {
      setDownloadedFilepath(found.filepath);
      setDownloadProgress(found.progress);
      console.log("Progress: " + found.progress);
    }
  });

  function checkIfDownloaded() {
    try {
      const found = DownloadsStore.downloads.find(
        (download) => download.book.id === fullBook.id
      );
      if (found) {
        setDownloadedFilepath(found.filepath);
      }
    } catch (error) {}
  }

  function fetchFullBook() {
    console.log("Fetching:" + bookPreview.id);
    setLoading(true);
    fetch(`https://livre.deno.dev/book/${bookPreview.id}`)
      .then((res) => res.json())
      .then((data) => {
        data.coverurl = bookPreview.cover;
        setFullBook(data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        checkIfDownloaded();
      });
  }

  function fetchDownloadLinks() {
    setFetchinDownloadLinks(true);
    fetch(`https://livre.deno.dev/download/${fullBook.md5}`)
      .then((res) => res.json())
      .then((data) => {
        dowloadBook(fullBook, data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setFetchinDownloadLinks(false);
      });
  }

  function openReader() {
    const downloadId = DownloadsStore.get().downloads.find(
      (download) => download.book.id === fullBook.id
    ).downloadId;
    if (downloadId) {
      router.push(`/library/reader?downloadId=${downloadId}`);
    } else {
      ToastAndroid.show("Book Not Found", ToastAndroid.SHORT);
    }
  }
  useLayoutEffect(() => {
    console.log("Loaded book");
    fetchFullBook();
  }, []);

  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      console.log(segments);
      console.log("=========");
      console.log(segments[2]);
      if (segments[2] === "subcategory") {
        router.replace("/explore/categories");
      }
      return true;
    });
    return () => {
      handler.remove();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: theme.colors.background,
      }}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
        <View>
          <View
            style={{
              width: "100%",
              height: 200,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <BaseImage
              source={{ uri: bookPreview.cover }}
              style={{
                height: "100%",
                width: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                opacity: 0.5,
              }}
              blurRadius={5}
              placeholderStyles={{ height: "100%", width: "100%" }}
            />
            <View
              style={{
                flex: 1,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BaseImage
                source={{ uri: bookPreview.cover }}
                style={{ height: "95%", width: "40%", borderRadius: 10 }}
                placeholderStyles={{ height: "95%", width: "40%" }}
              />
            </View>
          </View>
          <View style={{ marginHorizontal: 10, marginBottom: 5 }}>
            <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
              {bookPreview.title}
            </Text>
            <Text variant="titleMedium" style={{ opacity: 0.9 }}>
              {bookPreview.authors[0].name}
            </Text>
            <View style={{ opacity: 0.9 }}>
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 8,
                  marginVertical: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Feather
                    name="user"
                    size={18}
                    color="white"
                    style={{ marginRight: 5 }}
                  />
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginRight: 10,
                    }}
                  >
                    Publisher
                  </Text>
                </View>
                {bookPreview.publisher ? (
                  <Text>{trimText(bookPreview.publisher, 40)}</Text>
                ) : (
                  <Text style={{ textDecorationLine: "line-through" }}>
                    missing
                  </Text>
                )}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderRadius: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 8,
                    flex: 1,
                    marginRight: 10,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Foundation
                      name="page-multiple"
                      size={16}
                      color={theme.colors.text}
                      style={{ marginRight: 5 }}
                    />

                    <Text style={{ marginRight: 10, fontWeight: "bold" }}>
                      Pages
                    </Text>
                  </View>
                  {bookPreview.pages ? (
                    <Text>{bookPreview.pages}</Text>
                  ) : (
                    <Text style={{ textDecorationLine: "line-through" }}>
                      missing
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderRadius: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 8,
                    flex: 1,
                    marginRight: 10,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Feather
                      name="calendar"
                      size={18}
                      color="white"
                      style={{ marginRight: 5 }}
                    />

                    <Text style={{ fontWeight: "bold", marginRight: 10 }}>
                      Year
                    </Text>
                  </View>
                  {bookPreview.year ? (
                    <Text>{bookPreview.year}</Text>
                  ) : (
                    <Text style={{ textDecorationLine: "line-through" }}>
                      missing
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderRadius: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 8,
                    flex: 1,
                    marginRight: 10,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Feather
                      name="box"
                      size={18}
                      color="white"
                      style={{ marginRight: 5 }}
                    />

                    <Text style={{ fontWeight: "bold", marginRight: 10 }}>
                      Size
                    </Text>
                  </View>
                  {bookPreview.size ? (
                    <Text>{bookPreview.size}</Text>
                  ) : (
                    <Text style={{ textDecorationLine: "line-through" }}>
                      missing
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderRadius: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 8,
                    flex: 1,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Feather
                      name="file-text"
                      size={18}
                      color="white"
                      style={{ marginRight: 5 }}
                    />

                    <Text style={{ fontWeight: "bold", marginRight: 10 }}>
                      Type
                    </Text>
                  </View>
                  {bookPreview.extension ? (
                    <Text>.{bookPreview.extension}</Text>
                  ) : (
                    <Text style={{ textDecorationLine: "line-through" }}>
                      missing
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>

        {fullBook ? (
          <View
            style={{
              marginHorizontal: 10,
            }}
          >
            {downloadedFilepath ? (
              <Button
                mode="contained-tonal"
                icon={"book"}
                style={{ marginVertical: 5 }}
                onPress={openReader}
              >
                <Text
                  style={{ fontWeight: "bold", color: theme.colors.primary }}
                >
                  OPEN
                </Text>
              </Button>
            ) : downloadProgress === null ? (
              <Button
                mode="contained"
                style={{ marginVertical: 5 }}
                loading={fetchinDownloadLinks}
                onPress={fetchDownloadLinks}
              >
                Download
              </Button>
            ) : (
              <>
                <Text>Downloading</Text>
                <ProgressBar
                  progress={downloadProgress}
                  style={{
                    height: 35,
                    marginHorizontal: 5,
                    marginVertical: 5,
                    borderRadius: 20,
                  }}
                />
              </>
            )}
            <View
              style={{
                padding: 10,
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: 10,
                marginVertical: 5,
              }}
            >
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                Description
              </Text>
              {fullBook.descr && (
                <Text>{fullBook.descr.replace(/<[^>]*>/g, "")}</Text>
              )}
            </View>
          </View>
        ) : (
          <View>
            <ActivityIndicator size={"small"} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default BookPage;
