import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useMemo, useRef } from "react";
import { Feather, Foundation } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { IconButton, Text, Button } from "react-native-paper";
import { DownloadsStore, LiveAppState } from "../../store/store";
import { DownloadType } from "../../types";
import { trimText } from "../../utils";
import BaseImage from "../BaseImage";
import CustomBackdrop from "../CustomBackdrop";

const DownloadViewerBottomSheet = ({
  download,
  setSelectedDownload,
}: {
  download: DownloadType;
  setSelectedDownload: (value: any) => void;
}) => {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["60%", "100%"], []);

  function openBook() {
    const link = `/library/reader?downloadId=${download.downloadId}`;
    router.push(link);
  }

  function deleteDownload() {
    const updatedDownloads = DownloadsStore.get().downloads.filter(
      (_download) => _download.downloadId != download.downloadId
    );
    DownloadsStore.downloads.set(updatedDownloads);
    setSelectedDownload(null);
  }

  useEffect(() => {
    const handle = BackHandler.addEventListener("hardwareBackPress", () => {
      setSelectedDownload(null);
      return true;
    });
    return () => {
      handle.remove();
    };
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      style={{ marginBottom: 20 }}
      backgroundStyle={{
        backgroundColor: LiveAppState.themeValue.get().colors.surface,
      }}
      handleIndicatorStyle={{
        width: "12%",
        backgroundColor: LiveAppState.themeValue.get().colors.background,
        height: 6,
        borderRadius: 10,
      }}
      handleStyle={{
        position: "absolute",
      }}
      enablePanDownToClose
      backdropComponent={CustomBackdrop}
      onClose={() => {
        setSelectedDownload(null);
      }}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          backgroundColor: LiveAppState.themeValue.get().colors.background,
        }}
      >
        <View>
          <View
            style={{
              width: "100%",
              height: 210,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <BaseImage
              source={{ uri: download.book.base64Cover }}
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
                source={{ uri: download.book.base64Cover }}
                style={{ height: "95%", width: "40%", borderRadius: 10 }}
                placeholderStyles={{ height: "95%", width: "40%" }}
              />
            </View>
          </View>
          <View style={{ marginHorizontal: 10 }}>
            <Text variant="titleMedium">{download.book.title}</Text>
            <Text variant="titleSmall" style={{ opacity: 0.6 }}>
              {download.book.author}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                marginTop: 15,
                marginBottom: 5,
              }}
            >
              {download.filepath !== null && (
                <Button
                  mode="contained"
                  onPress={openBook}
                  style={{ width: "72%" }}
                >
                  READ
                </Button>
              )}
              <IconButton
                containerColor={
                  LiveAppState.themeValue.get().colors.surfaceVariant
                }
                onPress={deleteDownload}
                style={{ width: "25%" }}
                icon={"delete"}
              />
            </View>
            <View style={{ opacity: 0.9, height: "37%" }}>
              <View
                style={{
                  backgroundColor:
                    LiveAppState.themeValue.get().colors.inverseOnSurface,
                  borderRadius: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 8,
                  marginVertical: 5,
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
                      marginRight: 5,
                    }}
                  >
                    Publisher
                  </Text>
                </View>
                {download.book.publisher ? (
                  <Text>{trimText(download.book.publisher, 40)}</Text>
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
                    marginRight: 5,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Foundation
                      name="page"
                      size={16}
                      color={LiveAppState.themeValue.get().colors.text}
                      style={{
                        marginRight: 5,
                        color: LiveAppState.themeValue.get().colors.text,
                      }}
                    />

                    <Text style={{ marginRight: 5, fontWeight: "bold" }}>
                      Pages
                    </Text>
                  </View>
                  {download.book.pages ? (
                    <Text>{download.book.pages}</Text>
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
                    marginRight: 5,
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
                  {download.book.year ? (
                    <Text>{download.book.year}</Text>
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
                    marginRight: 5,
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
                  {download.book.filesize ? (
                    <Text>
                      {(parseInt(download.book.filesize) / 1e6).toFixed(2)}mb
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
                  {download.book.extension ? (
                    <Text>.{download.book.extension}</Text>
                  ) : (
                    <Text style={{ textDecorationLine: "line-through" }}>
                      missing
                    </Text>
                  )}
                </View>
              </View>
              <View
                style={{
                  padding: 10,
                  backgroundColor:
                    LiveAppState.themeValue.get().colors.inverseOnSurface,
                  borderRadius: 10,
                  marginVertical: 5,
                }}
              >
                <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                  Description
                </Text>
                {download.book.descr && (
                  <ScrollView>
                    <Text>{download.book.descr.replace(/<[^>]*>/g, "")}</Text>
                  </ScrollView>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
};

export default DownloadViewerBottomSheet;

const styles = StyleSheet.create({});
