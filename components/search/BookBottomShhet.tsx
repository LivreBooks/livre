import { BackHandler, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo, useRef } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { LiveAppState } from "../../store/store";
import { FullBookType, BookType } from "../../types";
import BookDetails from "../BookDetails";

function BookBottomSheet({
  fullbook = null,
  bookPreview = null,
  onClose,
}: {
  fullbook?: FullBookType;
  bookPreview?: BookType;
  onClose: () => void;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["97%", "100%"], []);

  useEffect(() => {
    console.log("Visible");
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      onClose();
      return true;
    });
    return () => {
      console.log("Removed");
      handler.remove();
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
        backgroundColor: LiveAppState.themeValue.get().colors.text,
        height: 6,
        borderRadius: 10,
      }}
      handleStyle={{
        position: "absolute",
        // top: 0,
        // left: 0,
        // width: "100%",
      }}
      enablePanDownToClose
      onClose={() => {
        onClose();
      }}
    >
      <BookDetails fullBook={fullbook} bookPreview={bookPreview} />
    </BottomSheet>
  );
}

export default BookBottomSheet;
