import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { View, Dimensions, TouchableOpacity, BackHandler } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator, Searchbar, Text } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import BaseImage from "../../components/BaseImage";
import { DownloadsStore, LiveAppState } from "../../store/store";
import { DownloadType } from "../../types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BasePage from "../../components/BasePage";
import DownloadViewerBottomSheet from "../../components/library/DownloadViewerBottomSheet";

const { width: sWidth, height: sHeight } = Dimensions.get("screen");
const coverWidth = sWidth / 2 - 40;
const coverHeight = coverWidth * 1.4;

export default function Search() {
  const [filterQuery, setFilterQuery] = useState("");

  const onChangeFilter = (query: string) => setFilterQuery(query);

  const [downloads, setDownloads] = useState<DownloadType[]>(
    DownloadsStore.downloads.get()
  );

  const [selectedDownload, setSelectedDownload] = useState<DownloadType>(null);

  const [multiSelectedDownloads, setMultiSelectedDownloads] = useState<
    DownloadType[]
  >([]);

  DownloadsStore.downloads.onChange((downloads) => {
    setDownloads(downloads);
  });

  // useEffect(() => {
  //   setDownloads(DownloadsStore.downloads.get());
  // }, []);

  return (
    <>
      <BasePage headerInfo={{ title: "Library", icon: "book" }}>
        <View
          style={{
            height: "94%",
            width: "100%",
            justifyContent: "flex-start",
          }}
        >
          {downloads && downloads.length > 0 && (
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

          {downloads === null ||
            (downloads.length === 0 && (
              <View
                style={{
                  width: "100%",
                  height: "80%",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.8,
                }}
              >
                <MaterialCommunityIcons
                  name="package-variant"
                  size={120}
                  color={LiveAppState.themeValue.get().colors.onBackground}
                />
                <Text
                  style={{
                    fontSize: 20,
                    marginTop: 10,
                    textAlign: "center",
                    color: LiveAppState.themeValue.get().colors.onBackground,
                  }}
                >
                  {" "}
                  Your library is empty. Go to search and fill it up.{" "}
                </Text>
              </View>
            ))}

          {downloads && downloads.length > 0 && (
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
                  <TouchableOpacity
                    onLongPress={() =>
                      setMultiSelectedDownloads([
                        ...multiSelectedDownloads,
                        item,
                      ])
                    }
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
