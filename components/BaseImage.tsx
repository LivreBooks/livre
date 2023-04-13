import React, { useState } from "react";
import { View, Image, ImageProps, StyleSheet, ImageStyle } from "react-native";

type CustomImageProps = {
  source: ImageProps["source"];
  defaultImage?: ImageProps["source"];
  placeholderStyles?: ImageStyle;
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
        <Image
          source={defaultImage || require("../assets/defaultPageImage.png")}
          style={{
            position: "absolute",
            height: 200,
            width: 130,
            top: 0,
            left: 0,
            ...placeholderStyles,
          }}
          resizeMode="cover"
        />
      )}
      <Image source={source} onLoad={handleLoad} {...rest} />
    </>
  );
};

export default BaseImage;
