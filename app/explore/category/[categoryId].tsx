import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  FlatList,
  Dimensions,
  BackHandler,
  Animated,
} from "react-native";
import { CategoryType, SubCategoryType } from "../../../types";
import { Card, Searchbar, Text } from "react-native-paper";
import CategoryCardSkeleton from "../../../components/CategoryCardSkeleton";
import CategoryCard from "../../../components/CategoryCard";
import { useRouter, useLocalSearchParams, useSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { cardColors, theme } from "../../../constants";
import { ExploreStore, LiveAppState } from "../../../store/store";
import BaseImage from "../../../components/BaseImage";
import BasePage from "../../../components/BasePage";

const { width: screenWidth } = Dimensions.get("screen");

export default function Category() {
  const router = useRouter();

  const [filterQuery, setFilterQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [params, setParams] = useState(useSearchParams());

  const onChangeFilter = (query: string) => setFilterQuery(query);

  const [category, setCategory] = useState({
    name: "Defualt Category",
    subCategories: [],
  });

  const H_MAX_HEIGHT = 250;
  const H_MIN_HEIGHT = 100;
  const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  const headerScrollHeight = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  function getCategory() {
    const allCategories = ExploreStore.exploreData.get();
    if (allCategories && allCategories.length > 0) {
      const found = allCategories.find(
        (category) => category.id === params.categoryId
      );
      setCategory(found);
    }
  }

  function openSubCategory(subcategory: { id: string; name: string }) {
    router.push({
      pathname: `/explore/category/subcategory/${subcategory.id}`,
      params: {
        name: subcategory.name,
      },
    });
  }

  useEffect(() => {
    getCategory();
    BackHandler.addEventListener("hardwareBackPress", () => {
      router.back();
      return true;
    });
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
          <View
            style={{
              width: "100%",
              height: "75%",
              marginBottom: 10,
            }}
          >
            <BaseImage
              source={{
                uri: `https://source.unsplash.com/random/${screenWidth + 100}x${
                  screenWidth + 100
                }/?${encodeURI(category.name.toLowerCase())}`,
              }}
              resizeMode="cover"
              style={{ flex: 1 }}
              placeholderStyles={{ width: "100%", height: 200 }}
            />
            <LinearGradient
              colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                padding: 10,
                width: "100%",
                display: isLoading ? "none" : "flex",
              }}
            >
              <Text
                variant="headlineMedium"
                style={{ fontWeight: "900", color: "white" }}
              >
                {category.name}
              </Text>
            </LinearGradient>
          </View>
          {category.subCategories.length > 10 && (
            <Searchbar
              placeholder="Filter"
              icon={"filter-outline"}
              onChangeText={onChangeFilter}
              value={filterQuery}
              style={{
                borderRadius: 20,
                marginHorizontal: 10,
              }}
              inputStyle={{
                fontSize: 16,
                marginLeft: -10,
              }}
              theme={LiveAppState.themeValue.get()}
            />
          )}
        </Animated.View>
        <View style={{ flex: 1, width: "100%" }}>
          <ScrollView
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            style={{ flexWrap: "wrap", width: "100%" }}
          >
            <View
              style={{
                paddingTop: H_MAX_HEIGHT + 10,
                width: Dimensions.get("screen").width,
                paddingHorizontal: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  width: "100%",
                }}
              >
                {category.subCategories
                  .filter((category) => category.name.includes(filterQuery))
                  .map((category, index) => (
                    <View style={{ width: "50%" }} key={index}>
                      <CategoryCard
                        category={category}
                        selectCategory={openSubCategory}
                        index={index}
                      />
                    </View>
                  ))}
              </View>
            </View>
          </ScrollView>
          {/* <FlatList
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          numColumns={2}
          columnWrapperStyle={{
            flex: 1,
            justifyContent: "space-evenly",
            paddingHorizontal: 5,
          }}
          data={category.subCategories.filter((category) =>
            category.name.includes(filterQuery)
          )}
          keyExtractor={(item: SubCategoryType) => item.id}
          renderItem={({
            item,
            index,
          }: {
            item: SubCategoryType;
            index: number;
          }) => (
            <CategoryCard
              category={item}
              selectCategory={openSubCategory}
              index={index}
            />
          )}
        /> */}
        </View>
      </View>
    </BasePage>
  );
}
