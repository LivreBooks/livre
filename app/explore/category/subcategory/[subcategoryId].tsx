import React, { useEffect, useRef, useState } from "react";
import { View, FlatList, Animated } from "react-native";
import { Text } from "react-native-paper";
import { useSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { BookType } from "../../../../types";
import { theme } from "../../../../constants";
import { sortBooksByCompleteness } from "../../../../utils";
import BaseImage from "../../../../components/BaseImage";
import BookCard from "../../../../components/BookCard";
import BookCardSkeleton from "../../../../components/BookCardSkeleton";
import { LinearGradient } from "expo-linear-gradient";
import BasePage from "../../../../components/BasePage";

function SubCategory() {
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<BookType[]>([]);
  const skeletons = Array.from({ length: 3 }, (_, i) => i);

  const H_MAX_HEIGHT = 190;
  const H_MIN_HEIGHT = 50;
  const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  const headerScrollHeight = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const [subcategory, setSubcategory] = useState(useSearchParams());

  function fetchBooks() {
    setLoading(true);
    console.log(subcategory.subcategoryId);
    fetch(`https://livre.deno.dev/books/${subcategory.subcategoryId}`)
      .then((res) => res.json())
      .then((data: BookType[]) => {
        const books = data.filter(
          (book) => book.extension === "pdf" || book.extension === "epub"
        );
        setBooks(sortBooksByCompleteness(data));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <BasePage styles={{ paddingTop: 0, paddingHorizontal: 0 }}>
      <View
        style={{
          height: "100%",
          width: "100%",
          position: "relative",
        }}
      >
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
                subcategory.name.toLowerCase()
              )}`,
            }}
            style={{ width: "100%", height: "100%" }}
            placeholderStyles={{ width: "100%", height: "100%" }}
          />
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              padding: 5,
              width: "100%",
              display: loading ? "none" : "flex",
            }}
          >
            <Text
              variant="headlineSmall"
              style={{ fontWeight: "bold", color: "white" }}
            >
              {subcategory.name}
            </Text>
          </LinearGradient>
        </Animated.View>
        {loading ? (
          <FlatList
            data={skeletons}
            keyExtractor={(item) => item.toString()}
            renderItem={() => <BookCardSkeleton />}
            contentContainerStyle={{ paddingTop: H_MAX_HEIGHT }}
          />
        ) : (
          <FlashList
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            data={books}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <BookCard book={item} />}
            estimatedItemSize={250}
            contentContainerStyle={{ paddingTop: H_MAX_HEIGHT }}
          />
        )}
      </View>
    </BasePage>
  );
}

export default SubCategory;
