import { BackHandler } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { LiveAppState } from "../store/store";
import { FullBookType, BookType } from "../types/types";
import BookDetails from "./BookDetails";
import CustomBackdrop from "./CustomBackdrop";

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
  const snapPoints = useMemo(() => ["97%"], []);

  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      onClose();
      return true;
    });
    return () => {
      handler.remove();
    };
  }, []);

  const [appTheme, setAppTheme] = useState(LiveAppState.themeValue.get());

  LiveAppState.themeValue.onChange((theme) => {
    setAppTheme(theme);
  });

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      style={{ marginBottom: 20, overflow: "hidden", borderRadius: 20 }}
      backgroundStyle={{
        backgroundColor: appTheme.colors.background,
        overflow: "hidden",
        borderRadius: 10,
      }}
      handleStyle={{
        position: "absolute",
        display: "none",
      }}
      enablePanDownToClose
      backdropComponent={CustomBackdrop}
      onClose={() => {
        onClose();
      }}
    >
      <BookDetails fullBook={fullbook} bookPreview={bookPreview} />
    </BottomSheet>
  );
}

export default BookBottomSheet;
