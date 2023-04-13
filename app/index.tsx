import { useEffect, useState } from "react";
import { View, Image, FlatList, Pressable } from "react-native";
import { Button, Card, IconButton, Searchbar, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import BookCard from "../components/BookCard";
import BookCardSkeleton from "../components/BookCardSkeleton";
import { theme } from "../constants";
import { BookType } from "../types";
import { layoutAnimate, sortBooksByCompleteness } from "../utils";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const [searchResults, setSearchResults] = useState<BookType[]>([]);

  function search() {
    layoutAnimate();
    setLoading(true);
    setSearchResults([]);
    fetch(`https://livre.deno.dev/search/${searchQuery}`)
      .then((res) => res.json())
      .then((data) => {
        setSearchResults(sortBooksByCompleteness(data));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <View
      style={{
        height: "100%",
        justifyContent: "flex-start",
        paddingTop: 10,
        backgroundColor: theme.colors.background,
      }}
    >
      <View
        style={{
          flexDirection: searchResults.length > 0 || loading ? "row" : "column",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <Animatable.View
          animation={"fadeInUp"}
          style={{
            marginBottom: searchResults.length > 0 || loading ? 0 : 40,
            marginRight: searchResults.length > 0 || loading ? 5 : 0,
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/logo.png")}
            style={{
              marginBottom: searchResults.length > 0 || loading ? 0 : 20,
              width: searchResults.length > 0 || loading ? 25 : 80,
              height: searchResults.length > 0 || loading ? 40 : 120,
            }}
            resizeMode="contain"
          />
          {searchResults.length === 0 ||
            (loading && (
              <Text
                variant={"displaySmall"}
                style={{ color: theme.colors.primary, fontWeight: "900" }}
              >
                Livre
              </Text>
            ))}
        </Animatable.View>
        <Animatable.View
          animation={"fadeInUp"}
          delay={500}
          style={{ width: "85%", alignItems: "center" }}
        >
          <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={{ borderRadius: 40, width: "100%" }}
            inputStyle={{
              fontSize: 16,
            }}
            onSubmitEditing={search}
            blurOnSubmit
            clearIcon={({ size, color }) => (
              <Pressable
                onPress={() => {
                  layoutAnimate();
                  setSearchResults([]);
                  setSearchQuery("");
                }}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={size - 5}
                  color={color}
                />
              </Pressable>
            )}
          />
        </Animatable.View>
      </View>
      {loading ? (
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={(item) => item.toString()}
          renderItem={() => <BookCardSkeleton />}
        />
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BookCard book={item} />}
        />
      )}
    </View>
  );
}
