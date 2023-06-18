import { Pressable, View } from "react-native";
import React, { useMemo, useRef, useState } from "react";
import { overlayColors, theme } from "../../constants";
import PdfViewer from "./PdfViewer";
import { DownloadType } from "../../types";
import EpubViewer from "./EpubViewer";
import { Foundation } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Card, ProgressBar, IconButton, Text } from "react-native-paper";
import { layoutAnimate } from "../../utils";
import { Slider } from "@miblanchard/react-native-slider";
import { ReaderProvider } from "@epubjs-react-native/core";
import { LiveAppState } from "../../store/store";

const BaseViewer = ({ download }: { download: DownloadType }) => {
  const [overlayBrightness, setOverlayBrightness] = useState(0.3);
  const [overlayColor, setOverlayColor] = useState(overlayColors[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [scale, setScale] = useState(1);

  const [viewerDetails, setViewerDetails] = useState(null);

  return (
    <ReaderProvider>
      <View style={{ height: "100%", backgroundColor: "white" }}>
        <View
          style={{
            height: "94%",
            justifyContent: "flex-start",
            position: "relative",
            backgroundColor: theme.colors.background,
          }}
        >
          <View
            style={{
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: overlayColor,
              opacity: overlayBrightness,
              position: "absolute",
              zIndex: 1,
            }}
            pointerEvents={"none"}
          />
          {download.book.extension === "pdf" && (
            <PdfViewer
              bookCover={download.book.base64Cover}
              fileUri={download.filepath}
              setPages={(totalPages: number) => setTotalPages(totalPages)}
              setCurrentpage={(currentPage: number) => setCurrentPage(currentPage)}
            />
          )}
          {download.book.extension === "djvu" && (
            <View>
              <Text>DJVU Reader</Text>
            </View>
          )}
          {download.book.extension === "epub" && (
            <EpubViewer
              bookCover={download.book.base64Cover}
              fileUri={download.filepath}
              onLoad={() => {
                console.log("Epub loaded");
              }}
            />
          )}
        </View>
        <Controls
          fileType={download.book.extension}
          setScale={setScale}
          overlayColor={overlayColor}
          setOverlayColor={setOverlayColor}
          overlayBrightness={overlayBrightness}
          setOverlayBrightness={setOverlayBrightness}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
        />
      </View>
    </ReaderProvider>
  );
};

const Controls = ({
  setScale,
  fileType,
  overlayColor,
  setOverlayColor,
  overlayBrightness,
  setOverlayBrightness,
  currentPage,
  setCurrentPage,
  totalPages,
  setTotalPages,
}: {
  fileType: string;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  overlayColor: string;
  setOverlayColor: (value: string) => void;
  overlayBrightness: number;
  setOverlayBrightness: (value: number) => void;
  currentPage: number;
  setCurrentPage: (value: number) => void;
  totalPages: number;
  setTotalPages: (value: number) => void;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["3.5%", "35%"], []);
  const [snapIndex, setSnapIndex] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState(0);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={snapIndex}
      snapPoints={snapPoints}
      style={{ marginHorizontal: 15, zIndex: 20 }}
      backgroundStyle={{
        backgroundColor: LiveAppState.themeValue.get().colors.inversePrimary,
        borderRadius: 20,
        overflow: "hidden",
      }}
      handleIndicatorStyle={{
        width: "15%",
        backgroundColor: "white",
        height: 6,
        borderRadius: 10,
      }}
      handleStyle={{
        borderRadius: 20,
      }}
      handleHeight={30}
      onChange={(index) => { }}
    >
      <View style={{ paddingHorizontal: 10 }}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Card style={{ flex: 1 }} contentStyle={{ flexDirection: "row" }}>
            <View
              style={{
                borderRadius: 10,
                padding: 8,
                flex: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <Foundation
                  name="page-multiple"
                  size={16}
                  color={LiveAppState.themeValue.colors.get().text}
                  style={{ marginRight: 5 }}
                />
                <Text>
                  {currentPage}/{totalPages}
                </Text>
              </View>
              <ProgressBar
                progress={currentPage / totalPages}
                style={{ height: 10, borderRadius: 10 }}
              />
            </View>

            <IconButton
              icon={"plus"}
              mode="contained-tonal"
              style={{ borderRadius: 8 }}
              onPress={() => setScale((prev: number) => prev + 0.1)}
            />
            <IconButton
              icon={"minus"}
              mode="contained-tonal"
              style={{ borderRadius: 8 }}
              onPress={() => setScale((prev: number) => prev - 0.1)}
            />
            <IconButton
              icon={"bookmark-outline"}
              mode="contained-tonal"
              onPress={() => { }}
              style={{ borderRadius: 8 }}
            />
          </Card>
        </View>
        <Card style={{ padding: 10 }}>
          <Text style={{ marginBottom: 2 }}>Reader Theme</Text>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 5,
            }}
          >
            {overlayColors.map((color, index) => (
              <View key={index}>
                {color == overlayColor ? (
                  <IconButton
                    icon={"check"}
                    size={15}
                    iconColor={
                      color === "transparent"
                        ? theme.colors.text
                        : theme.colors.background
                    }
                    style={{
                      backgroundColor: color,
                      width: 30,
                      height: 30,
                      margin: 0,
                      borderWidth: 1.5,
                      borderColor:
                        color === "transparent"
                          ? theme.colors.text
                          : "transparent",
                    }}
                  />
                ) : (
                  <Pressable
                    onPress={() => {
                      layoutAnimate();
                      setOverlayColor(color);
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: color,
                        borderWidth: 1.5,
                        borderColor:
                          color === "transparent"
                            ? theme.colors.text
                            : "transparent",
                        width: 30,
                        height: 30,
                        borderRadius: 5,
                      }}
                    />
                  </Pressable>
                )}
              </View>
            ))}
          </View>

          <View style={{ height: 40, marginTop: 5 }}>
            <Slider
              containerStyle={{ flex: 0.95 }}
              trackStyle={{
                height: "100%",
                borderRadius: 30,
                backgroundColor: theme.colors.inversePrimary,
              }}
              thumbStyle={{
                backgroundColor: theme.colors.onSurface,
              }}
              minimumTrackStyle={{
                backgroundColor: theme.colors.primary,
                height: "80%",
                marginLeft: 5,
              }}
              value={overlayBrightness}
              maximumValue={1.0}
              minimumValue={0.2}
              onValueChange={(value) => {
                setOverlayBrightness(value[0]);
              }}
            />
          </View>
        </Card>
      </View>
    </BottomSheet>
  );
};

export default BaseViewer;

