import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  FlatList,
  Pressable,
  Image,
  ScrollView,
  TouchableNativeFeedback,
  Dimensions,
  BackHandler,
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

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendations, setRecommendations] = useState<
    RecommendationCategory[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [selectedBook, setSelectedBook] = useState<FullBookType>(null);
  const [selectedBook2, setSelectedBook2] = useState<BookType>(null);

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
                style={{ borderRadius: 20, width: "95%" }}
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
            loading === false && (
              <Recommendations
                categories={recommendations}
                selectBook={(book) => setSelectedBook(book)}
              />
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

  return (
    <ScrollView style={{ width: "100%" }}>
      {categories.map((category) => {
        return (
          <View style={{ width: "100%" }} key={category.category}>
            <Text
              style={{
                fontSize: 24,
                color: LiveAppState.themeValue.get().colors.text,
                fontWeight: "bold",
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
              }}
            >
              {category.books.map((book) => (
                <View
                  key={book.id}
                  style={{
                    marginHorizontal: 0,
                    marginBottom: 20,
                    borderRadius: 15,
                    width: "50%",
                    overflow: "hidden",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TouchableNativeFeedback
                    onPress={() => {
                      console.log("Clicked");
                      selectBook(book);
                    }}
                    background={TouchableNativeFeedback.Ripple(
                      LiveAppState.themeValue.get().colors.primaryContainer,
                      false
                    )}
                  >
                    <BaseImage
                      style={{
                        height: Dimensions.get("screen").width / 2 + 40,
                        width: Dimensions.get("screen").width / 2 - 30,
                        borderRadius: 10,
                      }}
                      source={{
                        uri: `https://libgen.rs/covers/${book.coverurl}`,
                      }}
                      placeholderStyles={{
                        height: Dimensions.get("screen").width / 2 + 50,
                        width: Dimensions.get("screen").width / 2 - 20,
                        borderRadius: 10,
                        top: 10,
                        left: 10,
                      }}
                    />
                  </TouchableNativeFeedback>
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </ScrollView>
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
