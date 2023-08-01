import React, { useEffect, useState } from "react";
import { View, Dimensions, TouchableNativeFeedback } from "react-native";
import { Text } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { CategoryType, SubCategoryType } from "../types/types";
import { LiveAppState, SettingsStore } from "../store/store";

function CategoryCard({
	category,
	selectCategory,
	index,
}: {
	category: CategoryType | SubCategoryType;
	selectCategory: (category: CategoryType | SubCategoryType) => void;
	index: number;
}) {
	const [reRender, setRerender] = useState(1);

	SettingsStore.theme.onChange((newTheme) => {
		setRerender(Math.random());
	});

	useEffect(() => {}, [reRender]);
	return (
		<Animatable.View
			animation={"slideInUp"}
			delay={Math.min(15 * index, 500)}
			style={{ flex: 1, overflow: "hidden", borderRadius: 20, margin: 5 }}
		>
			<TouchableNativeFeedback
				onPress={() => selectCategory(category)}
				background={TouchableNativeFeedback.Ripple("#9258FF", false)}
			>
				<View
					style={{
						flex: 1,
						height: 100,
						backgroundColor: LiveAppState.themeValue.colors.surface.get(),
						borderRadius: 20,
						padding: 5,
						paddingHorizontal: 10,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Text
						style={{
							textAlign: "center",
							color:
								SettingsStore.theme.get() === "light" ? "#4C3E66" : "#A090BD",
							fontWeight: "bold",
							fontSize: 14,
						}}
					>
						{category.name || "Missing"}
					</Text>
				</View>
			</TouchableNativeFeedback>
		</Animatable.View>
	);
}

export default CategoryCard;
