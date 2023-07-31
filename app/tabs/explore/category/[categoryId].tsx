import React, { useEffect, useRef, useState } from "react";
import { View, Dimensions, BackHandler, Animated } from "react-native";
import { Searchbar } from "react-native-paper";
import CategoryCard from "../../../../components/CategoryCard";
import { useRouter, useSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { ExploreStore } from "../../../../store/store";
import BasePage from "../../../../components/BasePage";
import CollapsiblePageHeader from "../../../../components/CollapsiblePageHeader";

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

	const H_MAX_HEIGHT = 180;
	const H_MIN_HEIGHT = 50;
	const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

	const scrollOffsetY = useRef(new Animated.Value(0)).current;

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
			pathname: `/tabs/explore/category/subcategory/${subcategory.id}`,
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
				<CollapsiblePageHeader
					title={category.name}
					scrollOffsetY={scrollOffsetY}
				>
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
						/>
					)}
				</CollapsiblePageHeader>
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
								paddingTop: H_MAX_HEIGHT + 75,
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
