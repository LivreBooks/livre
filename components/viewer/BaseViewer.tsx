import { Alert, Keyboard, Pressable, View } from "react-native";
import React, { useMemo, useRef, useState } from "react";
import { overlayColors, theme } from "../../constants";
import PdfViewer from "./PdfViewer";
import { DownloadType } from "../../types";
import EpubViewer from "./EpubViewer";
import { Foundation } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  Card,
  ProgressBar,
  IconButton,
  Text,
  TextInput,
  Button,
} from "react-native-paper";
import { layoutAnimate } from "../../utils";
import { Slider } from "@miblanchard/react-native-slider";
import { ReaderProvider } from "@epubjs-react-native/core";
import { LiveAppState } from "../../store/store";
import Spacer from "../Spacer";

const BaseViewer = ({ download }: { download: DownloadType }) => {
  const [overlayBrightness, setOverlayBrightness] = useState(0.3);
  const [overlayColor, setOverlayColor] = useState(overlayColors[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [scale, setScale] = useState(1);

  const [viewerDetails, setViewerDetails] = useState(null);

  const pdfViewerRef = useRef();

  function goToPage(page: number) {
    console.log("Jumping to: ", page);
    if (download.book.extension === "pdf") {
      pdfViewerRef.current.jumpToPage(page);
    }
  }

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
              height: "110%",
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
              setCurrentpage={(currentPage: number) =>
                setCurrentPage(currentPage)
              }
              ref={pdfViewerRef}
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
          goToPage={goToPage}
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
  goToPage,
}: {
  fileType: string;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  overlayColor: string;
  setOverlayColor: (value: string) => void;
  overlayBrightness: number;
  setOverlayBrightness: (value: number) => void;
  currentPage: number;
  setCurrentPage: (value: number) => void;
  goToPage: (value: number) => void;
  totalPages: number;
  setTotalPages: (value: number) => void;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["3.5%", "50%"], []);
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [jumpToPage, setJumpToPage] = useState("");

  const keyboardHandler = Keyboard;

  function triggerJumpTo() {
    const targetPage = parseInt(jumpToPage);
    if (targetPage >= 1 && targetPage <= totalPages) {
      console.log(jumpToPage);
      goToPage(targetPage);
      setJumpToPage("");
      bottomSheetRef.current.snapToIndex(0);
    } else {
      Alert.alert("Invalid Page Number");
    }
    keyboardHandler.dismiss();
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      style={{ marginHorizontal: 0, zIndex: 20 }}
      backgroundStyle={{
        backgroundColor: LiveAppState.themeValue.get().colors.backdrop,
        borderRadius: 40,
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
      onChange={(index) => {}}
    >
      <View style={{ paddingHorizontal: 15 }}>
        <Card
          style={{ borderRadius: 40 }}
          contentStyle={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              borderRadius: 10,
              margin: 20,
              width: "40%",
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
              color={
                overlayColor === "transparent"
                  ? LiveAppState.themeValue.colors.primary.get()
                  : overlayColor
              }
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 10,
              borderRadius: 20,
            }}
          >
            <TextInput
              keyboardType="number-pad"
              mode="flat"
              dense
              placeholder="Go to"
              value={jumpToPage}
              style={{
                width: 100,
                borderRadius: 20,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
              onChangeText={(value) => setJumpToPage(value)}
              underlineStyle={{ height: 0, borderRadius: 20 }}
              outlineStyle={{ borderRadius: 20 }}
              blurOnSubmit
              onSubmitEditing={() => triggerJumpTo()}
            />
            <IconButton
              icon={"check"}
              mode="contained-tonal"
              size={20}
              disabled={jumpToPage ? false : true}
              onPress={() => triggerJumpTo()}
            />
          </View>
        </Card>
        <Spacer height={10} />
        <Card
          style={{ padding: 10, borderRadius: 40 }}
          contentStyle={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            icon={"bookmark-outline"}
            mode="contained-tonal"
            onPress={() => {}}
          >
            Bookmark
          </Button>
          <Button
            icon={"bookmark-multiple"}
            mode="contained-tonal"
            onPress={() => {}}
          >
            Bookmarks
          </Button>
        </Card>
        {/* <View style={{ flexDirection: "row" }}>
          <IconButton
            icon={"magnify-plus-outline"}
            mode="contained-tonal"
            style={{ borderRadius: 8 }}
            onPress={() => setScale((prev: number) => prev + 0.1)}
          />
          <IconButton
            icon={"magnify-minus-outline"}
            mode="contained-tonal"
            style={{ borderRadius: 8 }}
            onPress={() => setScale((prev: number) => prev - 0.1)}
          />
        </View> */}
        <Spacer height={10} />

        <Card style={{ padding: 20, borderRadius: 20 }}>
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

          <View
            style={{
              height: overlayColor === "transparent" ? 0 : 40,
              marginTop: 5,
              overflow: "hidden",
            }}
          >
            <Slider
              containerStyle={{ flex: 0.95 }}
              trackStyle={{
                height: "100%",
                borderRadius: 30,
                backgroundColor: theme.colors.onSurface,
              }}
              thumbStyle={{
                backgroundColor:
                  overlayColor === "transparent"
                    ? LiveAppState.themeValue.colors.primary.get()
                    : overlayColor,
                borderColor: LiveAppState.themeValue.colors.text.get(),
                borderWidth: 2,
              }}
              minimumTrackStyle={{
                backgroundColor:
                  overlayColor === "transparent"
                    ? LiveAppState.themeValue.colors.primary.get()
                    : overlayColor,
                height: "80%",
                marginLeft: 5,
              }}
              value={overlayBrightness}
              maximumValue={0.7}
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
