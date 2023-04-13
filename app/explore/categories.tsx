import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { Searchbar } from "react-native-paper";
import CategoryCard from "../../components/CategoryCard";
import CategoryCardSkeleton from "../../components/CategoryCardSkeleton";
import { theme } from "../../constants";
import { ExploreStore } from "../../store/store";
import { CategoryType } from "../../types";

export default function Categories() {
  const [filterQuery, setFilterQuery] = useState("");
  const skeletons = Array.from({ length: 10 }, (_, i) => i);
  const [loading, setLoading] = useState(false);

  const onChangeFilter = (query: string) => setFilterQuery(query);

  const [exploreData, setExploreData] = useState<CategoryType[]>([]);

  const router = useRouter();

  function openCategory(category: CategoryType) {
    console.log("Opening " + category.name);
    router.push({
      pathname: `/explore/category/${category.id}`,
    });
  }

  function fetchExploreData() {
    if (ExploreStore.exploreData.get().length > 0) {
      setExploreData(ExploreStore.exploreData.get());
      return;
    }
    setLoading(true);
    fetch("https://livre.deno.dev/categories")
      .then((res) => res.json())
      .then((data) => {
        setExploreData(data);
        if (data) {
          ExploreStore.exploreData.set(data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchExploreData();
  }, []);

  return (
    <View
      style={{
        height: "100%",
        justifyContent: "flex-start",
        paddingHorizontal: 10,
        paddingTop: 10,
        backgroundColor: theme.colors.background,
      }}
    >
      <Searchbar
        placeholder="Filter"
        icon={"filter-outline"}
        onChangeText={onChangeFilter}
        value={filterQuery}
        style={{
          borderRadius: 40,
          marginBottom: 10,
        }}
        theme={theme}
      />
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
            <RefreshControl refreshing={loading} onRefresh={fetchExploreData} />
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
  );
}
