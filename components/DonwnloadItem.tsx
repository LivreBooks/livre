import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Button, Card, ProgressBar, Text } from "react-native-paper";
import { trimText } from "../utils";
import BaseImage from "./BaseImage";
import { DownloadType, FullBookType } from "../types/types";
import { theme } from "../constants";
import { Feather, Foundation } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { DownloadsStore } from "../store/store";

const DonwnloadItem = ({ download }: { download: DownloadType }) => {
  const router = useRouter();
  const [progess, setProgess] = useState(download.progress);

  const [deleteTarget, setDeleteTarget] = useState(null);

  function openReader() {
    router.push(`/library/reader?downloadId=${download.downloadId}`);
  }
  function deleteDownload() {
    const updatedDownloads = DownloadsStore.get().downloads.filter(
      (_download) => _download.downloadId != download.downloadId
    );
    DownloadsStore.downloads.set(updatedDownloads);
    setDeleteTarget(null);
  }
  DownloadsStore.downloads.onChange((downloads) => {
    const index = downloads.findIndex(
      (_download) => _download.downloadId === download.downloadId
    );
    if (Math.floor(download.progress * 100) < 100) {
      setProgess(downloads[index].progress);
    }
    if (downloads[index].filepath) {
      console.log({ filepath: downloads[index].filepath });
    }
  });

  return (
    <Card
      style={{
        marginHorizontal: 10,
        marginVertical: 5,
        overflow: "hidden",
      }}
      contentStyle={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          padding: 8,
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 160,
          }}
        >
          <BaseImage
            style={{ height: "100%", width: "100%", borderRadius: 10 }}
            source={{ uri: download.book.coverurl }}
            placeholderStyles={{
              height: "100%",
              width: "100%",
              borderRadius: 10,
            }}
          />
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text
              variant="titleSmall"
              style={{ lineHeight: 18, marginBottom: 2 }}
            >
              {trimText(download.book.title, 55)}
            </Text>
            <Text style={{ fontSize: 12 }}>{download.book.author}</Text>
          </View>
          {deleteTarget ? (
            <ConfirmDelete
              deleteDownload={deleteDownload}
              cancel={() => setDeleteTarget(null)}
            />
          ) : (
            <>
              <DownloadMeta book={download.book} />
              <View>
                {download.filepath ? (
                  <View style={{ flexDirection: "row" }}>
                    <Button mode="text" icon={"book"} onPress={openReader}>
                      Read
                    </Button>
                    <Button
                      mode="text"
                      icon={"trash-can"}
                      onPress={() => setDeleteTarget(download.downloadId)}
                      textColor={theme.colors.error}
                      style=
                    >
                      Delete
                    </Button>
                  </View>
                ) : (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderRadius: 10,
                      width: "100%",
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        marginBottom: 5,
                        color: theme.colors.onBackground,
                        fontSize: 14,
                      }}
                    >
                      {Math.floor(download.progress * 100)}%
                    </Text>
                    <ProgressBar
                      progress={progess}
                      animatedValue={download.progress}
                      style={{ height: 15, borderRadius: 6, width: 170 }}
                    />
                  </View>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    </Card>
  );
};

const DownloadMeta = ({ book }: { book: FullBookType }) => {
  return (
    <View style={{ flexDirection: "row", marginVertical: 5 }}>
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

          <Text style={{ marginRight: 10, fontWeight: "600" }}>Pages</Text>
        </View>
        {book.pages ? (
          <Text>{book.pages}</Text>
        ) : (
          <Text style={{ textDecorationLine: "line-through" }}>missing</Text>
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
          justifyContent: "flex-start",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather
            name="box"
            size={18}
            color={theme.colors.text}
            style={{ marginRight: 5 }}
          />

          <Text style={{ fontWeight: "600", marginRight: 10 }}>Size</Text>
        </View>
        {book.filesize ? (
          <Text>{(parseInt(book.filesize) / 1e6).toFixed(2)}mb</Text>
        ) : (
          <Text style={{ textDecorationLine: "line-through" }}>missing</Text>
        )}
      </View>
    </View>
  );
};

const ConfirmDelete = ({
  deleteDownload,
  cancel,
}: {
  deleteDownload: () => void;
  cancel: () => void;
}) => {
  return (
    <Card
      style={{
        backgroundColor: theme.colors.errorContainer,
        padding: 10,
        marginTop: 10,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 16,
          marginBottom: 5,
          textAlign: "center",
        }}
      >
        Delete This Book
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button
          onPress={deleteDownload}
          mode="contained"
          buttonColor={theme.colors.onErrorContainer}
          textColor={theme.colors.onError}
        >
          Yes
        </Button>
        <Button
          onPress={cancel}
          mode="contained"
          buttonColor={theme.colors.onBackground}
          textColor={theme.colors.background}
        >
          No
        </Button>
      </View>
    </Card>
  );
};

export default DonwnloadItem;

const styles = StyleSheet.create({});
