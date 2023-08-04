import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import CategoryCard from "../../../components/CategoryCard";
import CategoryCardSkeleton from "../../../components/CategoryCardSkeleton";
import { ExploreStore } from "../../../store/store";
import { CategoryType } from "../../../types/types";
import BasePage from "../../../components/BasePage";
import { BASE_URL } from "../../../constants";
import { Toast } from "react-native-alert-notification";

export default function Categories() {
	const [filterQuery, setFilterQuery] = useState("");
	const skeletons = Array.from({ length: 10 }, (_, i) => i);
	const [loading, setLoading] = useState(false);

	const onChangeFilter = (query: string) => setFilterQuery(query);

	const [exploreData, setExploreData] = useState<CategoryType[]>([]);

	const router = useRouter();

	function openCategory(category: CategoryType) {
		router.push({
			pathname: `/tabs/explore/category/${category.id}`,
		});
	}

	function fetchExploreData() {
		if (ExploreStore.exploreData.get().length > 0) {
			setExploreData(ExploreStore.exploreData.get());
			return;
		}
		setLoading(true);
		fetch(`${BASE_URL}/categories`)
			.then((res) => res.json())
			.then((data) => {
				setExploreData(data);
				if (data) {
					ExploreStore.exploreData.set(data);
				}
			})
			.catch((err) => {
				Toast.show({
					title: "Error Fetching Categories",
					textBody: err.message,
				});
			})
			.finally(() => {
				setLoading(false);
			});
	}

	useEffect(() => {
		fetchExploreData();
	}, []);

	return (
		<BasePage headerInfo={{ title: "Explore", icon: "star" }}>
			<View
				style={{
					height: "94%",
					width: "100%",
				}}
			>
				{loading ? (
					<FlatList
						numColumns={2}
						columnWrapperStyle={{ flex: 1, justifyContent: "space-evenly" }}
						data={skeletons}
						keyExtractor={(item) => item.toString()}
						renderItem={() => <CategoryCardSkeleton />}
					/>
				) : (
					<FlatList
						numColumns={2}
						columnWrapperStyle={{ flex: 1, justifyContent: "space-evenly" }}
						data={exploreData.filter((category) =>
							category.name.includes(filterQuery)
						)}
						keyExtractor={(item: CategoryType) => item.id}
						refreshControl={
							<RefreshControl
								refreshing={loading}
								onRefresh={fetchExploreData}
							/>
						}
						renderItem={({
							item,
							index,
						}: {
							item: CategoryType;
							index: number;
						}) => (
							<CategoryCard
								index={index}
								category={item}
								selectCategory={openCategory}
							/>
						)}
					/>
				)}
			</View>
		</BasePage>
	);
}
