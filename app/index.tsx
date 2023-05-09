import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  FlatList,
  Pressable,
  Image,
  TouchableNativeFeedback,
  Dimensions,
  BackHandler,
  Animated,
} from "react-native";
import { Searchbar, Text } from "react-native-paper";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import BookCard from "../components/BookCard";
import BookCardSkeleton from "../components/BookCardSkeleton";
import { theme } from "../constants";
import { BookType, FullBookType, RecommendationCategory } from "../types";
import { layoutAnimate, sortBooksByCompleteness, trimText } from "../utils";
import BasePage from "../components/BasePage";
import { LiveAppState } from "../store/store";
import book from "epubjs/types/book";
import { Link, useRouter } from "expo-router";
import BaseImage from "../components/BaseImage";
import BookDetails from "../components/BookDetails";
import BottomSheet from "@gorhom/bottom-sheet";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { ScrollView } from "react-native-gesture-handler";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendations, setRecommendations] = useState<
    RecommendationCategory[]
  >([]);
  const [searching, setSearching] = useState(false);
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
    layoutAnimate();
    setSearching(true);
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
        setSearching(false);
      });
  }

  function getRecommendations() {
    layoutAnimate();
    setLoadingRecommendations(true);
    // setRecommendations([]);
    fetch(`https://livre.deno.dev/recommendations`)
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
            position: "relative",
          }}
        >
          <Animatable.View
            animation={"fadeInUp"}
            style={{
              overflow: "hidden",
              marginBottom: 20,
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
              placeholder="Search"
              onChangeText={onChangeSearch}
              value={searchQuery}
              style={{
                borderRadius: 20,
                width: "95%",
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
          {searching && (
            <FlatList
              data={[1, 2, 3]}
              keyExtractor={(item) => item.toString()}
              renderItem={() => <BookCardSkeleton />}
              contentContainerStyle={{
                paddingTop: H_MAX_HEIGHT - 10,
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
                paddingTop: H_MAX_HEIGHT - 10,
              }}
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <BookCard
                  book={item}
                  onPress={(book) => {
                    setSelectedBook(book);
                  }}
                />
              )}
            />
          )}
          {recommendations.length > 0 &&
            searchResults.length === 0 &&
            searching === false && (
              <ScrollView
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
                  { useNativeDriver: false }
                )}
              >
                <View style={{ paddingTop: H_MAX_HEIGHT }}>
                  <Recommendations
                    categories={recommendations}
                    selectBook={(book) => setSelectedBook(book)}
                  />
                </View>
              </ScrollView>
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

  const { width: PAGE_WIDTH } = Dimensions.get("window");

  const card = {
    width: PAGE_WIDTH / 2 - 40,
    height: PAGE_WIDTH / 2 + 30,
  };

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
    <View style={{ width: "100%" }}>
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
                        console.log("Clicked");
                        console.log(book);
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

function BookBottomSheet({
  fullbook = null,
  bookPreview = null,
  onClose,
}: {
  fullbook?: FullBookType;
  bookPreview?: BookType;
  onClose: () => void;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["100%"], []);

  useEffect(() => {
    console.log("Visible");
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      onClose();
      return true;
    });
    return () => {
      console.log("Removed");
      handler.remove();
    };
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      style={{ marginBottom: 20 }}
      backgroundStyle={{
        backgroundColor: LiveAppState.themeValue.get().colors.surface,
      }}
      handleIndicatorStyle={{
        width: "12%",
        backgroundColor: LiveAppState.themeValue.get().colors.background,
        height: 6,
        borderRadius: 10,
      }}
      handleStyle={{
        position: "absolute",
      }}
      enablePanDownToClose
      onClose={() => {
        onClose();
      }}
    >
      <BookDetails fullBook={fullbook} bookPreview={bookPreview} />
    </BottomSheet>
  );
}
