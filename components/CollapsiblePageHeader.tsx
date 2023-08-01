import { StyleSheet, View, Animated } from "react-native";
import React, { useState } from "react";
// import Animated,  from 'react-native-reanimated'
import BaseImage from "./BaseImage";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "react-native-paper";

const CollapsiblePageHeader = ({
	title,
	scrollOffsetY,
	children,
}: {
	title: string;
	scrollOffsetY: Animated.Value;
	children?: React.ReactNode;
}) => {
	const H_MAX_HEIGHT = 180;
	const H_MIN_HEIGHT = 50;
	const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

	const headerScrollHeight = scrollOffsetY.interpolate({
		inputRange: [0, H_SCROLL_DISTANCE],
		outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
		extrapolate: "clamp",
	});

	return (
		<Animated.View
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: headerScrollHeight,
				zIndex: 999,
			}}
		>
			<BaseImage
				source={{
					uri: `https://source.unsplash.com/random/400x200/?${encodeURI(
						title.toLowerCase()
					)}`,
				}}
				style={{ width: "100%", height: "100%", marginBottom: 10 }}
				placeholderStyles={{ width: "100%", height: "100%" }}
			/>
			<LinearGradient
				colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.4)"]}
				style={{
					position: "absolute",
					left: 0,
					bottom: 0,
					padding: 10,
					width: "100%",
				}}
			>
				<Text
					variant="headlineSmall"
					style={{ fontWeight: "bold", color: "white" }}
				>
					{title}
				</Text>
			</LinearGradient>
			{children}
		</Animated.View>
	);
};

export default CollapsiblePageHeader;

const styles = StyleSheet.create({});
