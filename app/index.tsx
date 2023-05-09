import { useEffect, useState } from "react";
import { View, FlatList, Pressable, Image } from "react-native";
import { Searchbar, Text } from "react-native-paper";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import BookCard from "../components/BookCard";
import BookCardSkeleton from "../components/BookCardSkeleton";
import { theme } from "../constants";
import { BookType } from "../types";
import { layoutAnimate, sortBooksByCompleteness } from "../utils";
import BasePage from "../components/BasePage";
import { LiveAppState } from "../store/store";

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
    <BasePage>
      <View
        style={{
          height: "100%",
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <View
          style={{
            flexDirection:
              searchResults.length > 0 || loading ? "row" : "column",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 5,
          }}
        >
          {searchResults.length === 0 && loading == false && (
            <Animatable.View
              animation={"fadeInUp"}
              style={{
                overflow: "hidden",
                marginBottom: 20,
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/logo.png")}
                style={{ width: 80, height: 80 }}
              />
              <Text
                variant={"displaySmall"}
                style={{
                  color: LiveAppState.themeValue.get().colors.primary,
                  fontWeight: "bold",
                }}
              >
                Livre
              </Text>
            </Animatable.View>
          )}
          <Animatable.View
            animation={"fadeInUp"}
            delay={100}
            style={{ width: "100%", alignItems: "center" }}
          >
            <Searchbar
              placeholder="Search"
              onChangeText={onChangeSearch}
              value={searchQuery}
              style={{ borderRadius: 20, width: "100%" }}
              inputStyle={{
                fontSize: 16,
              }}
              theme={LiveAppState.themeValue.get()}
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
    </BasePage>
  );
}
