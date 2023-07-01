import { View } from "react-native";
import React from "react";
import { AppStackProps } from "../types/app";

const Stack = ({
  viewProps,
  style,
  children,
  block = false,
  direction = "column",
  gap = 0,
  align = "stretch",
  justify = "flex-start",
  px = 0,
  py = 0,
  pa = 0,
  mx = 0,
  my = 0,
  ma = 0,
  width,
  height = "auto",
  color = "transparent",
  radius = 0,
  wrap = "nowrap",
}: AppStackProps) => {
  return (
    <View
      style={{
        flexDirection: direction,
        flexWrap: wrap,
        gap,
        alignItems: align,
        justifyContent: justify,
        width: width ? width : block ? "100%" : "auto",
        height: height,
        padding: pa,
        paddingHorizontal: pa ? pa : px,
        paddingVertical: pa ? pa : py,
        margin: ma,
        marginHorizontal: ma ? ma : mx,
        marginVertical: ma ? ma : my,
        backgroundColor: color,
        borderRadius: radius,
        ...style,
      }}
      {...viewProps}
    >
      {children}
    </View>
  );
};

export default Stack;
