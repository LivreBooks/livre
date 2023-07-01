import BottomSheet from "@gorhom/bottom-sheet";
import { useRef, useMemo, useState, useEffect } from "react";
import { BackHandler } from "react-native";
import WebView from "react-native-webview";
import { LiveAppState } from "../../store/store";
import { WebviewRequirements, PaypalWebviewMessage } from "../../types";
import { objectToSearchParams } from "../../utils";
import CustomBackdrop from "../CustomBackdrop";
import { BASE_URL } from "../../constants";

const PaymentBottomSheet = ({
  data,
  close,
}: {
  data: WebviewRequirements;
  close: (data?: PaypalWebviewMessage) => void;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const webviewRef = useRef<WebView>();

  const snapPoints = useMemo(() => ["95%"], []);

  const [url] = useState(`${BASE_URL}/paypal?${objectToSearchParams(data)}`);

  function onWebviewMessage(e: any) {
    const msg = e.nativeEvent.data;
    if (msg) {
      const data = JSON.parse(msg) as PaypalWebviewMessage;
      close(data);
    }
  }

  useEffect(() => {
    const handle = BackHandler.addEventListener("hardwareBackPress", () => {
      console.log("Back press on webview sheet");
      close();
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
      backgroundStyle={{
        backgroundColor: LiveAppState.themeValue.get().colors.surface,
      }}
      handleIndicatorStyle={{
        width: "12%",
        backgroundColor: LiveAppState.themeValue.get().colors.background,
        height: 6,
        borderRadius: 10,
      }}
      enablePanDownToClose
      backdropComponent={CustomBackdrop}
      onClose={() => close()}
    >
      <WebView
        ref={webviewRef}
        source={{ uri: url }}
        onMessage={onWebviewMessage}
      />
    </BottomSheet>
  );
};

export default PaymentBottomSheet;
