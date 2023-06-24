import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Spacer = ({
  height = 0,
  width = 0,
}: {
  height?: number | string;
  width?: number | string;
}) => {
  return <View style={{ height, width }}></View>;
};

export default Spacer;

const styles = StyleSheet.create({});
