import { Text as ThemedText } from "react-native-paper";
import React, { useState } from "react";
import { theme } from "../constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Box from "./Box";
import { AppTextProps } from "../types/app";
import { LiveAppState } from "../store/store";

const Text = ({
	style,
	size = 14,
	color,
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

	const [appTheme, setAppTheme] = useState(LiveAppState.themeValue.get());

	LiveAppState.themeValue.onChange((theme) => {
		setAppTheme(theme);
	});

	return (
		<Box
			{...wrapperProps}
			align="center"
			gap={icon?.gap || 5}
			direction={icon?.position === "append" ? "row-reverse" : "row"}
		>
			{renderIcon}
			<ThemedText
				style={{
					color: color ? color : appTheme.colors.text,
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
		</Box>
	);
};

export default Text;
