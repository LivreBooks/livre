import { ReactNode } from "react";
import { FlexStyle, TextStyle, ViewProps, ViewStyle } from "react-native";

export interface AppTextProps {
  color?: TextStyle["color"];
  style?: TextStyle;
  size?: TextStyle["fontSize"];
  weight?: TextStyle["fontWeight"];
  align?: TextStyle["textAlign"];
  lineHeight?: TextStyle["lineHeight"];
  textDecorationLine?: TextStyle["textDecorationLine"];
  textDecorationStyle?: TextStyle["textDecorationStyle"];
  textDecorationColor?: TextStyle["textDecorationColor"];
  textTransform?: TextStyle["textTransform"];
  fontStyle?: TextStyle["fontStyle"];
  textShadowOffset?: TextStyle["textShadowOffset"];
  textShadowRadius?: TextStyle["textShadowRadius"];
  textShadowColor?: TextStyle["textShadowColor"];
  includeFontPadding?: TextStyle["includeFontPadding"];
  fontFamily?: TextStyle["fontFamily"];
  fontVariant?: TextStyle["fontVariant"];
  letterSpacing?: TextStyle["letterSpacing"];
  icon?: {
    name: any;
    position?: "append" | "prepend";
    size?: number;
    color?: string;
    gap?: number;
  };
  wrapperProps?: Omit<AppStackProps, "children">;
  children: ReactNode;
}

export interface AppStackProps {
  children: ReactNode;
  block?: boolean;
  direction?: FlexStyle["flexDirection"];
  gap?: FlexStyle["gap"];
  align?: FlexStyle["alignItems"];
  justify?: FlexStyle["justifyContent"];
  px?: number;
  py?: number;
  pa?: number;
  mx?: number;
  my?: number;
  ma?: number;
  pt?: number;
  pb?: number;
  pl?: number;
  pr?: number;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  borderWidth?: ViewStyle["borderWidth"];
  borderColor?: ViewStyle["borderColor"];
  width?: ViewStyle["width"];
  height?: ViewStyle["height"];
  color?: ViewStyle["backgroundColor"];
  radius?: ViewStyle["borderRadius"];
  wrap?: FlexStyle["flexWrap"];
  viewProps?: Omit<ViewProps, "style">;
  style?: ViewStyle;
}
