import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TouchableHighlight,
  TouchableNativeFeedback,
} from "react-native";
import { Card, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import SkeletonLoader from "expo-skeleton-loader";
import * as Animatable from "react-native-animatable";
import { CategoryType, SubCategoryType } from "../types";
import { bgColors, cardColors, theme } from "../constants";

const { width: screenWidth } = Dimensions.get("screen");

function CategoryCard({
  category,
  selectCategory,
  index,
}: {
  category: CategoryType | SubCategoryType;
  selectCategory: (category: CategoryType | SubCategoryType) => void;
  index: number;
}) {
  return (
    <Animatable.View
      animation={"bounceIn"}
      delay={Math.min(10 * index, 500)}
      style={{ flex: 1, overflow: "hidden", borderRadius: 20, margin: 5 }}
    >
      <TouchableNativeFeedback
        onPress={() => selectCategory(category)}
        background={TouchableNativeFeedback.Ripple("gray", false)}
      >
        <View
          style={{
            flex: 1,
            height: 100,
            backgroundColor: bgColors[index],
            borderRadius: 20,
            padding: 5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            {category.name || "Missing"}
          </Text>
        </View>
      </TouchableNativeFeedback>
    </Animatable.View>
  );
}

export default CategoryCard;
