import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { View, Image, FlatList, Dimensions, BackHandler } from "react-native";
import { CategoryType, SubCategoryType } from "../../../types";
import { Card, Searchbar, Text } from "react-native-paper";
import CategoryCardSkeleton from "../../../components/CategoryCardSkeleton";
import CategoryCard from "../../../components/CategoryCard";
import { useRouter, useLocalSearchParams, useSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { cardColors, theme } from "../../../constants";
import { ExploreStore, LiveAppState } from "../../../store/store";
import BaseImage from "../../../components/BaseImage";

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
    <View
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: LiveAppState.themeValue.get().colors.background,
      }}
    >
      <View style={{ marginBottom: 10 }}>
        <BaseImage
          source={{
            uri: `https://source.unsplash.com/random/${screenWidth + 100}x${
              screenWidth + 100
            }/?${encodeURI(category.name.toLowerCase())}`,
          }}
          resizeMode="cover"
          style={{ width: "100%", height: 200 }}
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
            marginBottom: 5,
            marginHorizontal: 10,
          }}
          inputStyle={{
            fontSize: 16,
            marginLeft: -10,
          }}
          theme={LiveAppState.themeValue.get()}
        />
      )}
      <FlatList
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
      />
    </View>
  );
}
