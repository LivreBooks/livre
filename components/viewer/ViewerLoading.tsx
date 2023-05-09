import { StyleSheet, Image, ActivityIndicator, View } from "react-native";
import React from "react";
import { Text } from "react-native-paper";
import { theme } from "../../constants";

const ViewerLoading = ({ bookCover }: { bookCover: string }) => {
  return (
    <View style={{ flex: 1, width: "100%", height: "100%" }}>
      <Image
        source={{ uri: bookCover }}
        style={{ width: "100%", height: "100%" }}
        blurRadius={10}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "rgba(255,255,255,0.2)",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          },
        ]}
      >
        <ActivityIndicator size={"large"} color={theme.colors.background} />
        <Text style={{ color: theme.colors.background, fontWeight: "bold" }}>
          Loading book...
        </Text>
      </View>
    </View>
  );
};

export default ViewerLoading;

const styles = StyleSheet.create({});
