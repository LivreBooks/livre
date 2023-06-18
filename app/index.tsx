import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  FlatList,
  Pressable,
  StyleSheet,
  TouchableNativeFeedback,
  Dimensions,
  BackHandler,
  Animated,
} from "react-native";
import { Banner, Card, IconButton, Searchbar, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import BookCard from "../components/BookCard";
import BookCardSkeleton from "../components/BookCardSkeleton";
import { BookType, FullBookType, RecommendationCategory } from "../types";
import { layoutAnimate, sortBooksByCompleteness, } from "../utils";
import BasePage from "../components/BasePage";
import { LiveAppState } from "../store/store";
import { useRouter } from "expo-router";
import BaseImage from "../components/BaseImage";
import BookDetails from "../components/BookDetails";
import BottomSheet from "@gorhom/bottom-sheet";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { ScrollView } from "react-native-gesture-handler";
import SkeletonLoader from "expo-skeleton-loader";

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
    scrollOffsetY.setValue(0)
    layoutAnimate();
    setSearching(true);
    setSearchResults([]);
    fetch(`https://livre.deno.dev/search/${searchQuery}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.length === 0) {
          setShowNoResults(true)
          return
        }
        const books = data.filter(
          (book: BookType) => book.extension === "pdf" || book.extension === "epub"
        );

        setSearchResults(sortBooksByCompleteness(books));
      })
      .catch((err) => {
        console.log(err);
        setShowNoResults(true)
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
              theme={LiveAppState.themeValue.get()}
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
                    setShowNoResults(false)
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
            {
              showNoResults &&
              <Card style={{ width: "95%", top: 10 }} elevation={5} contentStyle={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 15, borderRadius: 10, zIndex: 20, backgroundColor: LiveAppState.themeValue.colors.errorContainer.get() }}>
                <Text style={{ color: LiveAppState.themeValue.colors.text.get() }}>
                  No Books Found
                </Text>
                <IconButton icon={"close"} size={20} onPress={() => setShowNoResults(false)} />
              </Card>
            }
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
            searching === false && loadingRecommendations == false && (
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
          {loadingRecommendations &&
            <View style={{ paddingTop: 190 }}>
              <RecommendationsSkeletonLoader />
              <RecommendationsSkeletonLoader />
            </View>
          }
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
  const snapPoints = useMemo(() => ["97%"], []);

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
        // position: "absolute",
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


function RecommendationsSkeletonLoader() {
  return (
    <View style={styles.container}>
      <SkeletonLoader
        boneColor={LiveAppState.themeValue.get().colors.surfaceVariant}
        highlightColor={LiveAppState.themeValue.get().colors.surfaceVariant}
        duration={1500}
      >
        <SkeletonLoader.Item style={styles.title} />
        <SkeletonLoader.Container style={{ flexDirection: "row", width: "100%", }}>
          <SkeletonLoader.Item style={styles.thumbnail} />
          <SkeletonLoader.Item style={styles.thumbnail} />
          <SkeletonLoader.Item style={styles.thumbnail} />
        </SkeletonLoader.Container>
      </SkeletonLoader>
    </View>
  )
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

