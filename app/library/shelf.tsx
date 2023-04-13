import { Link, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Image,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import {
  ActivityIndicator,
  Card,
  Button,
  Searchbar,
  Text,
} from "react-native-paper";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import * as Animatable from "react-native-animatable";
import BaseImage from "../../components/BaseImage";
import { theme } from "../../constants";
import { DownloadsStore } from "../../store/store";
import { DownloadType } from "../../types";
import BottomSheet, { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { Feather, Foundation } from "@expo/vector-icons";
import { trimText } from "../../utils";

const { width: sWidth, height: sHeight } = Dimensions.get("screen");
const coverWidth = sWidth / 2 - 25;
const coverHeight = coverWidth * 1.5;

export default function Search() {
  const [filterQuery, setFilterQuery] = useState("");

  const onChangeFilter = (query: string) => setFilterQuery(query);

  const [downloads, setDownloads] = useState<DownloadType[]>([]);
  const [selectedDownload, setSelectedDownload] = useState<DownloadType>(null);

  DownloadsStore.downloads.onChange((downloads) => {
    setDownloads(downloads);
  });

  useEffect(() => {
    setDownloads(DownloadsStore.downloads.get());
  }, []);

  return (
    <>
      <View
        style={{
          height: "100%",
          justifyContent: "flex-start",
          paddingTop: 10,
          backgroundColor: theme.colors.background,
        }}
      >
        {downloads.length > 4 && (
          <Searchbar
            placeholder="Filter"
            icon={"filter-outline"}
            onChangeText={onChangeFilter}
            value={filterQuery}
            style={{
              borderRadius: 10,
              marginBottom: 5,
              marginHorizontal: 10,
            }}
            inputStyle={{
              fontSize: 16,
              marginLeft: -10,
            }}
          />
        )}

        {downloads && (
          <FlatList
            numColumns={2}
            columnWrapperStyle={{
              flex: 1,
              justifyContent: "space-between",
              alignItems: "flex-start",
              paddingVertical: 10,
              paddingHorizontal: 15,
            }}
            data={downloads
              .filter((download) => download !== null)
              .filter((download) => download.book.title.includes(filterQuery))}
            keyExtractor={(item) => item.downloadId.toString()}
            renderItem={({
              item,
              index,
            }: {
              item: DownloadType;
              index: number;
            }) => (
              <Animatable.View
                animation={"bounceIn"}
                delay={Math.min(10 * index, 500)}
              >
                <TouchableOpacity
                  disabled={item.filepath === null}
                  onPress={() => setSelectedDownload(item)}
                >
                  <>
                    {item.filepath === null && (
                      <View
                        style={{
                          position: "absolute",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(0,0,0,0.5)",
                          top: 0,
                          left: 0,
                          width: coverWidth,
                          height: coverHeight,
                          zIndex: 2,
                        }}
                      >
                        <ActivityIndicator color={theme.colors.onBackground} />
                        <Text>Downloading...</Text>
                        <Text style={{ fontWeight: "bold" }}>
                          {Math.floor(item.progress * 100)}%
                        </Text>
                      </View>
                    )}
                    <BaseImage
                      style={{
                        height: coverHeight,
                        width: coverWidth,
                        borderRadius: 10,
                      }}
                      source={{
                        uri: item.book.base64Cover || item.book.coverurl,
                      }}
                      placeholderStyles={{
                        height: coverHeight,
                        width: coverWidth,
                        borderRadius: 10,
                      }}
                    />
                  </>
                </TouchableOpacity>
              </Animatable.View>
            )}
          />
        )}
      </View>
      {selectedDownload && (
        <DownloadViewerBottomSheet
          download={selectedDownload}
          setSelectedDownload={setSelectedDownload}
        />
      )}
    </>
  );
}

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
        backgroundColor: theme.colors.surface,
        borderRadius: 0,
      }}
      handleIndicatorStyle={{
        width: "12%",
        backgroundColor: theme.colors.background,
        height: 6,
        borderRadius: 10,
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
          backgroundColor: theme.colors.background,
        }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
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
            <View style={{ marginHorizontal: 10, marginBottom: 5 }}>
              <Text variant="titleMedium">{download.book.title}</Text>
              <Text variant="titleSmall" style={{ opacity: 0.9 }}>
                {download.book.author}
              </Text>
              <Button
                mode="contained"
                style={{ marginVertical: 10 }}
                onPress={openBook}
              >
                Read
              </Button>
              <Button
                mode="contained-tonal"
                buttonColor={theme.colors.errorContainer}
                textColor={theme.colors.onErrorContainer}
                onPress={deleteDownload}
              >
                Delete
              </Button>
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
                      backgroundColor: "rgba(255,255,255,0.05)",
                      borderRadius: 10,
                      paddingVertical: 5,
                      paddingHorizontal: 8,
                      flex: 1,
                      marginRight: 10,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
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
                      backgroundColor: "rgba(255,255,255,0.05)",
                      borderRadius: 10,
                      paddingVertical: 5,
                      paddingHorizontal: 8,
                      flex: 1,
                      marginRight: 10,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
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
                      backgroundColor: "rgba(255,255,255,0.05)",
                      borderRadius: 10,
                      paddingVertical: 5,
                      paddingHorizontal: 8,
                      flex: 1,
                      marginRight: 10,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
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
                      backgroundColor: "rgba(255,255,255,0.05)",
                      borderRadius: 10,
                      paddingVertical: 5,
                      paddingHorizontal: 8,
                      flex: 1,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
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
                    {download.book.extension ? (
                      <Text>.{download.book.extension}</Text>
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
          <View
            style={{
              marginHorizontal: 10,
            }}
          >
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
              {download.book.descr && (
                <Text>{download.book.descr.replace(/<[^>]*>/g, "")}</Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

const CustomBackdrop = ({ animatedIndex, style }: BottomSheetBackdropProps) => {
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 1],
      [0.4, 1],
      Extrapolate.CLAMP
    ),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: "black",
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );

  return <Animated.View style={containerStyle} />;
};
