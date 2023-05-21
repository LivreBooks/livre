import React, { useState } from "react";
import { View, Image, ImageProps, StyleSheet, ImageStyle } from "react-native";
import { LiveAppState } from "../store/store";

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
        <View
          style={{
            position: "absolute",
            height: 200,
            width: 130,
            top: 0,
            left: 0,
            ...placeholderStyles,
            backgroundColor: LiveAppState.themeValue.get().colors.surfaceVariant
          }}
        >
        </View>
      )}
      <Image source={source} onLoad={handleLoad} {...rest} />
    </>
  );
};


// {/* <Image */}
// {/*   source={defaultImage || require("../assets/defaultPageImage.jpg")} */}
// {/*   style={{ */}
// {/*     position: "absolute", */}
// {/*     height: 200, */}
// {/*     width: 130, */}
// {/*     top: 0, */}
// {/*     left: 0, */}
// {/*     ...placeholderStyles, */}
// {/*   }} */}
// {/*   blurRadius={40} */}
// {/*   resizeMode="cover" */}
// {/* /> */}

export default BaseImage;
