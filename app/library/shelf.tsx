import { Link, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { View, Dimensions, TouchableOpacity, BackHandler } from "react-native";
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
import { DownloadsStore, LiveAppState } from "../../store/store";
import { DownloadType } from "../../types";
import BottomSheet, { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import {
  Feather,
  Foundation,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { trimText } from "../../utils";
import BasePage from "../../components/BasePage";

const { width: sWidth, height: sHeight } = Dimensions.get("screen");
const coverWidth = sWidth / 2 - 25;
const coverHeight = coverWidth * 1.5;

export default function Search() {
  const [filterQuery, setFilterQuery] = useState("");

  const onChangeFilter = (query: string) => setFilterQuery(query);

  const [downloads, setDownloads] = useState<DownloadType[]>(
    DownloadsStore.downloads.get()
  );
  const [selectedDownload, setSelectedDownload] = useState<DownloadType>(null);

  DownloadsStore.downloads.onChange((downloads) => {
    setDownloads(downloads);
  });

  // useEffect(() => {
  //   setDownloads(DownloadsStore.downloads.get());
  // }, []);

  return (
    <>
      <BasePage>
        <View
          style={{
            height: "100%",
            width: "100%",
            justifyContent: "flex-start",
          }}
        >
          <Animatable.View
            animation={"fadeInUp"}
            style={{ marginTop: 10, marginBottom: 20, flexDirection: "row" }}
          >
            <MaterialCommunityIcons
              name="book"
              size={35}
              color={LiveAppState.themeValue.get().colors.primary}
            />
            <Text
              variant="headlineLarge"
              style={{
                marginLeft: 5,
                fontWeight: "bold",
                color: LiveAppState.themeValue.get().colors.primary,
              }}
            >
              Library
            </Text>
          </Animatable.View>

          {downloads.length > 0 && (
            <Animatable.View animation={"fadeInUp"} delay={10}>
              <Searchbar
                placeholder="Filter"
                icon={"filter-outline"}
                onChangeText={onChangeFilter}
                value={filterQuery}
                theme={LiveAppState.themeValue.get()}
                style={{
                  borderRadius: 20,
                  marginBottom: 5,
                }}
                inputStyle={{
                  fontSize: 16,
                }}
              />
            </Animatable.View>
          )}

          {downloads && (
            <View style={{ width: "100%", height: "80%", alignItems: 'center', justifyContent: 'center' }}>
              <MaterialCommunityIcons name="package-variant" size={120} color={LiveAppState.themeValue.get().colors.onBackground} />
              <Text theme={LiveAppState.themeValue.get()} style={{ fontSize: 20, fontWeight: "bold",marginTop:10, textAlign: 'center' }}> Your library is empty. Go to search and fill it up. </Text>
            </View>
          )

          }

          {downloads && (
            <FlatList
              numColumns={2}
              columnWrapperStyle={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "flex-start",
                paddingVertical: 10,
                paddingHorizontal: 5,
                width: "100%",
              }}
              data={downloads
                .filter((download) => download !== null)
                .filter((download) =>
                  download.book.title.includes(filterQuery)
                )}
              keyExtractor={(item) => item.downloadId.toString()}
              renderItem={({
                item,
                index,
              }: {
                item: DownloadType;
                index: number;
              }) => (
                <Animatable.View
                  animation={"fadeInUp"}
                  delay={Math.min(10 * index + 1, 500)}
                >
                  <TouchableOpacity onPress={() => setSelectedDownload(item)}>
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
                          <ActivityIndicator
                            color={
                              LiveAppState.themeValue.get().colors.onBackground
                            }
                          />
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
      </BasePage>
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
          <View style={{ marginHorizontal: 10, marginBottom: 5 }}>
            <Text variant="titleMedium">{download.book.title}</Text>
            <Text variant="titleSmall" style={{ opacity: 0.9 }}>
              {download.book.author}
            </Text>
            {download.filepath !== null && (
              <Button
                mode="contained"
                style={{ marginVertical: 10 }}
                onPress={openBook}
              >
                Read
              </Button>
            )}
            <Button
              mode="contained"
              buttonColor={
                LiveAppState.themeValue.get().colors.tertiaryContainer
              }
              textColor={LiveAppState.themeValue.get().colors.onErrorContainer}
              onPress={deleteDownload}
              style={{ marginVertical: 5 }}
            >
              Delete
            </Button>
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
