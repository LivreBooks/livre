import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, FlatList, Pressable, Animated } from "react-native";
import { Card, IconButton, Searchbar, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import BookCard from "../components/BookCard";
import BookCardSkeleton from "../components/BookCardSkeleton";
import { BookType, FullBookType, RecommendationCategory } from "../types/types";
import { layoutAnimate, sortBooksByCompleteness } from "../utils";
import BasePage from "../components/BasePage";
import { LiveAppState } from "../store/store";
import { ScrollView } from "react-native-gesture-handler";
import Recommendations, {
  RecommendationsSkeletonLoader,
} from "../components/search/Recommendations";
import BookBottomSheet from "../components/BookBottomSheet";
import { BASE_URL } from "../constants";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendations, setRecommendations] = useState<
    RecommendationCategory[]
  >([]);
  const [searching, setSearching] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [selectedBook, setSelectedBook] = useState<FullBookType>(null);
  const [selectedBook2, setSelectedBook2] = useState<BookType>(null);

  const H_MAX_HEIGHT = 190;
  const H_MIN_HEIGHT = 70;
  const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  const headerScrollHeight = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const logoSize = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [80, 0],
    extrapolate: "clamp",
  });

  const headingSize = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [32, 0],
    extrapolate: "clamp",
  });

  const [searchResults, setSearchResults] = useState<BookType[]>([]);
  const onChangeSearch = (query: string) => setSearchQuery(query);

  function search() {
    scrollOffsetY.setValue(0);
    layoutAnimate();
    setSearching(true);
    setSearchResults([]);
    fetch(`${BASE_URL}/search/${searchQuery}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.length === 0) {
          setShowNoResults(true);
          return;
        }
        const books = data.filter(
          (book: BookType) =>
            book.extension === "pdf" || book.extension === "epub"
        );

        setSearchResults(sortBooksByCompleteness(books));
      })
      .catch((err) => {
        console.log(err);
        setShowNoResults(true);
      })
      .finally(() => {
        setSearching(false);
      });
  }

  function getRecommendations() {
    layoutAnimate();
    setLoadingRecommendations(true);
    // setRecommendations([]);
    fetch(`${BASE_URL}/recommendations`)
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingRecommendations(false);
      });
  }

  useEffect(() => {
    getRecommendations();
  }, []);

  return (
    <>
      <BasePage>
        <View
          style={{
            height: "100%",
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Animatable.View
            animation={"fadeInUp"}
            style={{
              marginBottom: 40,
              alignItems: "center",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: headerScrollHeight,
              zIndex: 10,
            }}
          >
            <Animated.Image
              source={require("../assets/logo.png")}
              style={{
                width: logoSize,
                height: logoSize,
              }}
            />
            <Animated.Text
              style={{
                color: LiveAppState.themeValue.get().colors.primary,
                fontWeight: "bold",
                fontSize: headingSize,
              }}
            >
              Livre
            </Animated.Text>
            <Searchbar
              placeholder="Search a book or author"
              onChangeText={onChangeSearch}
              value={searchQuery}
              style={{
                borderRadius: 20,
                width: "95%",
                marginTop: 10,
              }}
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
                    scrollOffsetY.setValue(0);
                    setShowNoResults(false);
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
            {showNoResults && (
              <Card
                style={{ width: "95%", top: 10 }}
                elevation={5}
                contentStyle={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingLeft: 15,
                  borderRadius: 10,
                  zIndex: 20,
                  backgroundColor:
                    LiveAppState.themeValue.colors.errorContainer.get(),
                }}
              >
                <Text
                  style={{ color: LiveAppState.themeValue.colors.text.get() }}
                >
                  No Books Found
                </Text>
                <IconButton
                  icon={"close"}
                  size={20}
                  onPress={() => setShowNoResults(false)}
                />
              </Card>
            )}
          </Animatable.View>
          {searching && (
            <FlatList
              data={[1, 2, 3]}
              keyExtractor={(item) => item.toString()}
              renderItem={() => <BookCardSkeleton />}
              contentContainerStyle={{
                paddingTop: H_MAX_HEIGHT,
              }}
            />
          )}
          {!searching && searchResults.length > 0 && (
            <FlatList
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
                { useNativeDriver: false }
              )}
              contentContainerStyle={{
                paddingTop: H_MAX_HEIGHT,
              }}
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <BookCard
                  book={item}
                  onPress={(book) => {
                    setSelectedBook2(book);
                  }}
                />
              )}
            />
          )}
          {recommendations.length > 0 &&
            searchResults.length === 0 &&
            searching === false &&
            loadingRecommendations == false && (
              <ScrollView
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
                  { useNativeDriver: false }
                )}
              >
                <View style={{ paddingTop: H_MAX_HEIGHT + 10 }}>
                  <Recommendations
                    categories={recommendations}
                    selectBook={(book) => setSelectedBook(book)}
                  />
                </View>
              </ScrollView>
            )}
          {loadingRecommendations && (
            <View style={{ paddingTop: 190 }}>
              <RecommendationsSkeletonLoader />
              <RecommendationsSkeletonLoader />
            </View>
          )}
        </View>
      </BasePage>
      {(selectedBook || selectedBook2) && (
        <BookBottomSheet
          fullbook={selectedBook}
          bookPreview={selectedBook2}
          onClose={() => {
            setSelectedBook2(null);
            setSelectedBook(null);
          }}
        />
      )}
    </>
  );
}
