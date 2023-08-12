import React, { useEffect, useState } from "react";
import { View, Dimensions, TouchableNativeFeedback } from "react-native";
import Text from "./Text";
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
	const [appTheme, setAppTheme] = useState(LiveAppState.themeValue.get());

	LiveAppState.themeValue.onChange((theme) => {
		setAppTheme(theme);
	});

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
						backgroundColor: appTheme.colors.surface,
						borderRadius: 20,
						padding: 5,
						paddingHorizontal: 10,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Text align="center" weight="400" size={12}>
						{category.name || "Missing"}
					</Text>
				</View>
			</TouchableNativeFeedback>
		</Animatable.View>
	);
}

export default CategoryCard;
