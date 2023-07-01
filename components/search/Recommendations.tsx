import { useRouter } from "expo-router";
import SkeletonLoader from "expo-skeleton-loader";
import React from "react";
import { View, TouchableNativeFeedback, Dimensions } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { LiveAppState } from "../../store/store";
import { RecommendationCategory, FullBookType } from "../../types/types";
import BaseImage from "../BaseImage";
import { Text } from "react-native-paper";

const { width: PAGE_WIDTH } = Dimensions.get("window");

const card = {
  width: PAGE_WIDTH / 2 - 40,
  height: PAGE_WIDTH / 2 + 30,
};

function Recommendations({
  categories,
  selectBook,
}: {
  categories: RecommendationCategory[];
  selectBook: (value: FullBookType) => void;
}) {
  const router = useRouter();
  const [isVertical, setIsVertical] = React.useState(false);
  const [isFast, setIsFast] = React.useState(false);
  const [isAutoPlay, setIsAutoPlay] = React.useState(false);
  const [isPagingEnabled, setIsPagingEnabled] = React.useState(true);
  const ref = React.useRef<ICarouselInstance>(null);

  const baseOptions = isVertical
    ? ({
        vertical: true,
        width: card.width + 10,
        height: card.height + 10,
      } as const)
    : ({
        vertical: false,
        width: card.width + 10,
        height: card.height + 10,
      } as const);
  return (
    <View style={{ width: "98%" }}>
      {categories.map((category) => {
        return (
          <View
            style={{ width: "100%", marginBottom: 20 }}
            key={category.category}
          >
            <Text
              style={{
                fontSize: 20,
                color: LiveAppState.themeValue.get().colors.text,
                fontWeight: "700",
                marginBottom: 10,
                paddingLeft: 10,
              }}
            >
              {category.category}
            </Text>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                paddingLeft: 10,
              }}
            >
              <Carousel
                {...baseOptions}
                loop
                ref={ref}
                testID={"xxx"}
                style={{ width: "100%" }}
                autoPlay={isAutoPlay}
                autoPlayInterval={isFast ? 100 : 2000}
                data={category.books}
                pagingEnabled={isPagingEnabled}
                panGestureHandlerProps={{
                  activeOffsetX: [-10, 10],
                }}
                renderItem={({ index, item: book }) => (
                  <View
                    key={book.id}
                    style={{
                      marginHorizontal: 0,
                      marginBottom: 20,
                      borderRadius: 15,
                      overflow: "hidden",
                      alignItems: "center",
                      justifyContent: "center",
                      height: card.height,
                      width: card.width,
                    }}
                  >
                    <TouchableNativeFeedback
                      onPress={() => {
                        selectBook(book);
                      }}
                      background={TouchableNativeFeedback.Ripple(
                        LiveAppState.themeValue.get().colors.primaryContainer,
                        false
                      )}
                    >
                      <BaseImage
                        style={{
                          height: "100%",
                          width: "100%",
                          borderRadius: 10,
                        }}
                        source={{
                          uri: book.coverurl,
                        }}
                        placeholderStyles={{
                          height: "100%",
                          width: "100%",
                          borderRadius: 10,
                          top: 10,
                          left: 10,
                        }}
                      />
                    </TouchableNativeFeedback>
                  </View>
                )}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function RecommendationsSkeletonLoader() {
  return (
    <View style={styles.container}>
      <SkeletonLoader
        boneColor={LiveAppState.themeValue.get().colors.surfaceVariant}
        highlightColor={LiveAppState.themeValue.get().colors.surfaceVariant}
        duration={1500}
      >
        <SkeletonLoader.Item style={styles.title} />
        <SkeletonLoader.Container
          style={{ flexDirection: "row", width: "100%" }}
        >
          <SkeletonLoader.Item style={styles.thumbnail} />
          <SkeletonLoader.Item style={styles.thumbnail} />
          <SkeletonLoader.Item style={styles.thumbnail} />
        </SkeletonLoader.Container>
      </SkeletonLoader>
    </View>
  );
}

const styles = {
  container: {
    padding: 5,
    margin: 10,
  },
  thumbnail: {
    width: card.width,
    height: card.height,
    borderRadius: 5,
    marginRight: 10,
  },
  title: {
    height: 30,
    width: 200,
    marginBottom: 10,
    borderRadius: 5,
  },
};

export default Recommendations;
