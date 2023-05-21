import React from "react";
import { View, StyleSheet } from "react-native";
import SkeletonLoader from "expo-skeleton-loader";
import { Card } from "react-native-paper";
import { LiveAppState } from "../store/store";

const BookCardSkeleton = () => {
  return (
    <View style={styles.container}>
      <SkeletonLoader
        boneColor={LiveAppState.themeValue.get().colors.surfaceVariant}
        highlightColor={LiveAppState.themeValue.get().colors.surfaceVariant}
        style={{ flexDirection: "row" }}
      >
        <SkeletonLoader.Item style={styles.thumbnail} />
        <SkeletonLoader.Container style={styles.textContainer}>
          <SkeletonLoader.Container>
            <SkeletonLoader.Item style={styles.title} />
            <SkeletonLoader.Item style={styles.author} />
          </SkeletonLoader.Container>
          <SkeletonLoader.Container>
            <SkeletonLoader.Item style={styles.publisher} />
            <SkeletonLoader.Container style={styles.splits}>
              <SkeletonLoader.Item style={styles.split} />
              <SkeletonLoader.Item style={styles.split} />
            </SkeletonLoader.Container>
          </SkeletonLoader.Container>
        </SkeletonLoader.Container>
      </SkeletonLoader>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
  },
  thumbnail: {
    width: 135,
    height: 180,
    borderRadius: 5,
    marginRight: 10,
  },
  textContainer: {},
  title: {
    height: 50,
    width: 150,
    marginBottom: 5,
    borderRadius: 5,
  },
  author: {
    height: 20,
    width: 150,
    borderRadius: 5,
    marginBottom: 15,
  },
  publisher: {
    height: 30,
    width: 150,
    borderRadius: 5,
  },
  splits: { flexDirection: "row", justifyContent: "space-between" },
  split: {
    height: 30,
    width: 72,
    borderRadius: 5,
    marginTop: 5,
    marginRight: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default BookCardSkeleton;
