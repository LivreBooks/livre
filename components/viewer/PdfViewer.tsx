import { Dimensions, Pressable, StyleSheet, View, Image } from "react-native";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Slider } from "@miblanchard/react-native-slider";
import Pdf from "react-native-pdf";

import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  IconButton,
  ProgressBar,
  Text,
} from "react-native-paper";
import { Foundation, MaterialCommunityIcons } from "@expo/vector-icons";
import { overlayColors, readerThemes, theme } from "../../constants";
import BottomSheet from "@gorhom/bottom-sheet";
import { useObservable } from "@legendapp/state/react";
import { Observable } from "@legendapp/state";
import { layoutAnimate } from "../../utils";

const PdfViewer = ({
  fileUri,
  bookCover,
  page = 1,
}: {
  fileUri: string;
  bookCover: string;
  page?: number;
}) => {
  const [overlayBrightness, setOverlayBrightness] = useState(0.7);
  const [overlayColor, setOverlayColor] = useState(overlayColors[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [scale, setScale] = useState(1);

  const pdfViewerRef = useRef(null);

  useEffect(() => {
    console.log("---------");
    console.log(fileUri);
    console.log("---------");
    console.log(decodeURIComponent(fileUri));
    FileSystem.getInfoAsync(fileUri)
      .then((fileinfo) => {
        console.log(fileinfo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          position: "relative",
          height: "85%",
          transform: [{ scale: 1 }],
        }}
      >
        <View
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: overlayColor,
            opacity: 1 - overlayBrightness,
            position: "absolute",
            zIndex: 1,
          }}
          pointerEvents={"none"}
        />
        {fileUri ? (
          <Pdf
            ref={pdfViewerRef}
            renderActivityIndicator={() => (
              <View style={{ flex: 1, width: "100%", height: "100%" }}>
                <Image
                  source={{ uri: bookCover }}
                  style={{ flex: 1, width: "100%" }}
                />
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      backgroundColor: "rgba(0,0,0,0.5)",
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <ActivityIndicator
                    size={"large"}
                    color={theme.colors.primary}
                  />
                </View>
              </View>
            )}
            source={{ uri: `${decodeURIComponent(fileUri)}` }}
            enableAnnotationRendering
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
              setTotalPages(numberOfPages);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`);
              setCurrentPage(page);
            }}
            onError={(error) => {
              console.log(error);
            }}
            onPressLink={(uri) => {
              console.log(`Link pressed: ${uri}`);
            }}
            style={{
              ...styles.pdf,
              transform: [
                {
                  scale,
                },
              ],
            }}
          />
        ) : (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size={"large"} color={theme.colors.primary} />
            <Text>Loading Book...</Text>
          </View>
        )}
      </View>
      <Controls
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
  );
};

const Controls = ({
  setScale,
  overlayColor,
  setOverlayColor,
  overlayBrightness,
  setOverlayBrightness,
  currentPage,
  setCurrentPage,
  totalPages,
  setTotalPages,
}: {
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
  const snapPoints = useMemo(() => ["14%", "35%"], []);
  const [snapIndex, setSnapIndex] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState(0);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={snapIndex}
      snapPoints={snapPoints}
      style={{ paddingHorizontal: 15, zIndex: 20 }}
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
      onChange={(index) => {}}
    >
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
                color={theme.colors.text}
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
            onPress={() => {}}
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
                    width: 35,
                    height: 35,
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
                      width: 35,
                      height: 35,
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
              backgroundColor: theme.colors.inverseOnSurface,
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
              console.log(value[0]);
              setOverlayBrightness(value[0]);
            }}
          />
        </View>
      </Card>
    </BottomSheet>
  );
};

export default PdfViewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    backgroundColor: theme.colors.background,
  },
});
