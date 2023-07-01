import { Text as ThemedText } from "react-native-paper";
import React from "react";
import { theme } from "../constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Stack from "./Stack";
import { AppTextProps } from "../types/app";
import { LiveAppState } from "../store/store";

const Text = ({
  style,
  size = 14,
  color = LiveAppState.themeValue.colors.text.get(),
  weight = "normal",
  align = "auto",
  lineHeight,
  textDecorationLine,
  textDecorationColor,
  textDecorationStyle,
  textTransform,
  fontStyle,
  textShadowOffset,
  textShadowRadius,
  textShadowColor,
  includeFontPadding,
  fontFamily,
  fontVariant,
  letterSpacing,
  icon,
  wrapperProps,
  children,
}: AppTextProps) => {
  const renderIcon = icon && (
    <MaterialCommunityIcons
      name={icon.name}
      size={icon.size || 20}
      color={icon.color || theme.colors.text}
    />
  );

  return (
    <Stack
      {...wrapperProps}
      align="center"
      gap={icon?.gap || 5}
      direction={icon?.position === "append" ? "row-reverse" : "row"}
    >
      {renderIcon}
      <ThemedText
        style={{
          color,
          fontSize: size,
          fontWeight: weight,
          width: "auto",
          textAlign: align,
          lineHeight,
          textDecorationLine,
          textDecorationColor,
          textDecorationStyle,
          textTransform,
          fontStyle,
          textShadowOffset,
          textShadowRadius,
          textShadowColor,
          includeFontPadding,
          fontFamily,
          fontVariant,
          letterSpacing,
          ...style,
        }}
      >
        {children}
      </ThemedText>
    </Stack>
  );
};

export default Text;
