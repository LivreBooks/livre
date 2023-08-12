import { FlexStyle, View, ViewProps, ViewStyle } from "react-native";
import React, { ReactNode, useEffect, useState } from "react";
import { LiveAppState } from "../store/store";

const Box = ({
	viewProps,
	style,
	children,
	block = false,
	direction = "column",
	gap,
	align = "stretch",
	justify = "flex-start",
	borderColor = "transparent",
	borderWidth = 0,
	px,
	py,
	pa,
	mx,
	my,
	ma,
	pt,
	pb,
	pl,
	pr,
	mt,
	mb,
	ml,
	mr,
	width,
	height = "auto",
	color = "transparent",
	radius = 0,
	wrap = "nowrap",
}: AppStackProps) => {
	const [reRender, setRerender] = useState(0);

	LiveAppState.themeValue.onChange(() => {
		setRerender(Math.random());
	});

	useEffect(() => {
		// console.log("Box Rerender");
	}, [reRender]);

	return (
		<View
			style={{
				flexDirection: direction,
				flexWrap: wrap,
				gap,
				alignItems: align,
				justifyContent: justify,
				// width: width ? width : block ? "100%" : "auto",
				width: width ? width : block ? "100%" : "auto",
				height: height,
				padding: pa,
				paddingHorizontal: px,
				paddingVertical: py,
				paddingLeft: pl,
				paddingRight: pr,
				paddingTop: pt,
				paddingBottom: pb,
				margin: ma,
				marginHorizontal: ma ? ma : mx,
				marginVertical: ma ? ma : my,
				marginLeft: ml,
				marginRight: mr,
				marginTop: mt,
				marginBottom: mb,
				backgroundColor: color,
				borderRadius: radius,
				borderColor,
				borderWidth,
				maxWidth: "100%",
				...style,
			}}
			{...viewProps}
		>
			{children}
		</View>
	);
};

export default Box;

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
