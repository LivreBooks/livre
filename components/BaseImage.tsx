import React, { useState } from "react";
import { View, ViewProps, ViewStyle } from "react-native";
import { Image, ImageProps, ImageStyle } from "expo-image";
import { LiveAppState } from "../store/store";

type CustomImageProps = {
	source: ImageProps["source"];
	defaultImage?: ImageProps["source"];
	placeholderStyles?: ViewStyle;
} & ImageProps;

const BaseImage = ({
	source,
	defaultImage,
	placeholderStyles = {},
	...rest
}: CustomImageProps) => {
	const [isLoading, setIsLoading] = useState(true);

	const handleLoad = () => {
		setIsLoading(false);
	};

	return (
		<>
			{isLoading && (
				<View
					style={{
						position: "absolute",
						height: 200,
						width: 130,
						top: 0,
						left: 0,
						...placeholderStyles,
						backgroundColor: LiveAppState.themeValue.get().colors.surface,
					}}
				></View>
			)}
			<Image
				source={source}
				onLoadEnd={handleLoad}
				cachePolicy="disk"
				{...rest}
			/>
		</>
	);
};

export default BaseImage;
