import { View, Dimensions, ToastAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import { BASE_URL, theme } from "../constants";
import {
  ActivityIndicator,
  Button,
  Card,
  ProgressBar,
  Text,
} from "react-native-paper";
import { DownloadsStore, LiveAppState } from "../store/store";
import { Feather, Foundation } from "@expo/vector-icons";
import { dowloadBook, trimText } from "../utils";
import { BookType, FullBookType } from "../types";
import { useRouter } from "expo-router";
import BaseImage from "./BaseImage";
import { getBook } from "../services/services";
import { ScrollView } from "react-native-gesture-handler";

const { width: sWidth, height: sHeight } = Dimensions.get("screen");

const BookDetails = ({
  bookPreview = null,
  fullBook = null,
}: {
  bookPreview?: BookType;
  fullBook?: FullBookType;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchinDownloadLinks, setFetchinDownloadLinks] = useState(false);
  const [downloadedFilepath, setDownloadedFilepath] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [_fullbook, setFullBook] = useState(fullBook);
  const [book] = useState(bookPreview || _fullbook);

  DownloadsStore.downloads.onChange((downloads) => {
    const found = downloads
      .filter((download) => (download ? true : false))
      .find((download) => download.book.id === book.id);
    if (found) {
      setDownloadedFilepath(found.filepath);
      setDownloadProgress(found.progress);
    }
  });

  function checkIfDownloaded() {
    const found = DownloadsStore.downloads.find(
      (download) => download.book.id === book.id
    );
    if (found) {
      setDownloadedFilepath(found.filepath);
    }
  }

  function fetchFullBook() {
    setLoading(true);
    getBook(bookPreview.id)
      .then((data) => {
        data.coverurl = bookPreview.cover;
        setFullBook(data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function fetchDownloadLinks() {
    setFetchinDownloadLinks(true);
    // getDownloadLinks(fullbook.md5)
    fetch(`${BASE_URL}/download/${_fullbook.md5}`)
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
      (download) => download.book.id === _fullbook.id
    ).downloadId;
    if (downloadId) {
      router.push(`/library/reader?downloadId=${downloadId}`);
    } else {
      ToastAndroid.show("Book Not Found", ToastAndroid.SHORT);
    }
  }
  useEffect(() => {
    checkIfDownloaded();
    if (bookPreview?.id) {
      fetchFullBook();
    }
  }, []);

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <View style={{ paddingBottom: 10 }}>
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
              source={{
                uri: bookPreview?.cover || _fullbook.coverurl,
              }}
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
                source={{
                  uri: bookPreview?.cover || _fullbook.coverurl,
                }}
                style={{ height: "95%", width: "40%", borderRadius: 10 }}
                placeholderStyles={{ height: "95%", width: "40%" }}
              />
            </View>
          </View>
          <View style={{ marginHorizontal: 10, marginBottom: 5 }}>
            <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
              {bookPreview?.title || _fullbook.title}
            </Text>
            <Text variant="titleSmall" style={{ opacity: 0.9 }}>
              {bookPreview?.authors[0].name || _fullbook.author}
            </Text>
            <View style={{ opacity: 0.9 }}>
              <View
                style={{
                  backgroundColor:
                    LiveAppState.themeValue.get().colors.inverseOnSurface,
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
                    style={{
                      marginRight: 5,
                      color: LiveAppState.themeValue.get().colors.text,
                    }}
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
                {bookPreview?.publisher || _fullbook.publisher ? (
                  <Text>
                    {trimText(
                      bookPreview?.publisher || _fullbook.publisher,
                      40
                    )}
                  </Text>
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
                    backgroundColor:
                      LiveAppState.themeValue.get().colors.inverseOnSurface,
                    borderRadius: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 8,
                    flex: 1,
                    marginRight: 10,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Foundation
                      name="page"
                      size={16}
                      color={theme.colors.text}
                      style={{
                        marginRight: 5,
                        color: LiveAppState.themeValue.get().colors.text,
                      }}
                    />

                    <Text style={{ marginRight: 10, fontWeight: "bold" }}>
                      Pages
                    </Text>
                  </View>
                  {bookPreview?.pages || _fullbook?.pages ? (
                    <Text>{bookPreview?.pages || _fullbook.pages}</Text>
                  ) : (
                    <Text style={{ textDecorationLine: "line-through" }}>
                      missing
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    backgroundColor:
                      LiveAppState.themeValue.get().colors.inverseOnSurface,
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
                      style={{
                        marginRight: 5,
                        color: LiveAppState.themeValue.get().colors.text,
                      }}
                    />

                    <Text style={{ fontWeight: "bold", marginRight: 10 }}>
                      Year
                    </Text>
                  </View>
                  {bookPreview?.year || _fullbook.year ? (
                    <Text>{bookPreview?.year || _fullbook.year}</Text>
                  ) : (
                    <Text style={{ textDecorationLine: "line-through" }}>
                      missing
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    backgroundColor:
                      LiveAppState.themeValue.get().colors.inverseOnSurface,
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
                      style={{
                        marginRight: 5,
                        color: LiveAppState.themeValue.get().colors.text,
                      }}
                    />

                    <Text style={{ fontWeight: "bold", marginRight: 10 }}>
                      Size
                    </Text>
                  </View>
                  {bookPreview?.size || _fullbook.filesize ? (
                    <Text>
                      {bookPreview?.size ||
                        (parseInt(_fullbook.filesize) / 1e6)
                          .toFixed(2)
                          .toString() + " mb"}
                    </Text>
                  ) : (
                    <Text style={{ textDecorationLine: "line-through" }}>
                      missing
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    backgroundColor:
                      LiveAppState.themeValue.get().colors.inverseOnSurface,
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
                      style={{
                        marginRight: 5,
                        color: LiveAppState.themeValue.get().colors.text,
                      }}
                    />

                    <Text style={{ fontWeight: "bold", marginRight: 10 }}>
                      Type
                    </Text>
                  </View>
                  {bookPreview?.extension || _fullbook.extension ? (
                    <Text>
                      .{bookPreview?.extension || _fullbook.extension}
                    </Text>
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

        {_fullbook ? (
          <View
            style={{
              marginHorizontal: 10,
            }}
          >
            {downloadedFilepath ? (
              <Button
                mode="contained-tonal"
                icon={"book-open-blank-variant"}
                style={{ marginVertical: 5 }}
                onPress={openReader}
              >
                OPEN
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
              <Card style={{ padding: 5 }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  Downloading...
                </Text>
                <ProgressBar
                  progress={downloadProgress}
                  style={{
                    height: 35,
                    marginHorizontal: 5,
                    marginVertical: 5,
                    borderRadius: 20,
                  }}
                />
              </Card>
            )}
            <ScrollView
              style={{
                padding: 10,
                backgroundColor:
                  LiveAppState.themeValue.get().colors.inverseOnSurface,
                borderRadius: 10,
                marginVertical: 5,
                height: _fullbook.descr ? "28%" : "auto",
              }}
            >
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                Description
              </Text>
              {_fullbook.descr ? (
                <Text style={{ marginBottom: 15 }}>
                  {_fullbook.descr.replace(/<[^>]*>/g, "")}
                </Text>
              ) : (
                <Text style={{ textDecorationLine: "line-through" }}>
                  missing
                </Text>
              )}
            </ScrollView>
          </View>
        ) : (
          <View>
            <ActivityIndicator size={"small"} />
          </View>
        )}
      </View>
    </View>
  );
};

export default BookDetails;
