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
import CollapsiblePageHeader from "../../../../components/CollapsiblePageHeader";

function SubCategory() {
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<BookType[]>([]);
  const skeletons = Array.from({ length: 3 }, (_, i) => i);

  const H_MAX_HEIGHT = 190;

  const scrollOffsetY = useRef(new Animated.Value(0)).current;


  const [subcategory, setSubcategory] = useState(useSearchParams());

  function fetchBooks() {
    setLoading(true);

    fetch(`https://livre.deno.dev/books/${subcategory.subcategoryId}`)
      .then((res) => res.json())
      .then((data: BookType[]) => {
        const books = data.filter(
          (book) => book.extension === "pdf" || book.extension === "epub"
        );

        setBooks(sortBooksByCompleteness(books));
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
        <CollapsiblePageHeader title={subcategory.name} scrollOffsetY={scrollOffsetY} />
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
