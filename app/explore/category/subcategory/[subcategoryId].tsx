import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { Text } from "react-native-paper";
import { useSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { BookType } from "../../../../types";
import CategoryCardSkeleton from "../../../../components/CategoryCardSkeleton";
import { theme } from "../../../../constants";
import { sortBooksByCompleteness, trimText } from "../../../../utils";
import BaseImage from "../../../../components/BaseImage";
import BookCard from "../../../../components/BookCard";
import BookCardSkeleton from "../../../../components/BookCardSkeleton";

function SubCategory() {
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<BookType[]>([]);
  const skeletons = Array.from({ length: 3 }, (_, i) => i);

  const [subcategory, setSubcategory] = useState(useSearchParams());

  function fetchBooks() {
    setLoading(true);
    fetch(`https://livre.deno.dev/books/${subcategory.subcategoryId}`)
      .then((res) => res.json())
      .then((data: BookType[]) => {
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
    <View
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: theme.colors.background,
      }}
    >
      <View style={{ marginBottom: 10 }}>
        <BaseImage
          source={{
            uri: `https://source.unsplash.com/random/400x200/?${encodeURI(
              subcategory.name.toLowerCase()
            )}`,
          }}
          defaultImage={require("../../../../assets/defaultPageImage.png")}
          style={{ width: "100%", height: 200 }}
          placeholderStyles={{ width: "100%", height: 200 }}
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
      </View>
      {loading ? (
        <FlatList
          data={skeletons}
          keyExtractor={(item) => item.toString()}
          renderItem={() => <BookCardSkeleton />}
        />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BookCard book={item} />}
        />
      )}
    </View>
  );
}

export default SubCategory;
