import { useRouter } from "expo-router";
import SkeletonLoader from "expo-skeleton-loader";
import React from "react";
import { View, TouchableNativeFeedback, Dimensions } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { LiveAppState } from "../../store/store";
import { RecommendationCategory, FullBookType } from "../../types/types";
import BaseImage from "../BaseImage";
import Text from "../Text";
import Box from "../Box";

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
		<Box block>
			{categories.map((category) => {
				return (
					<View
						style={{ width: "100%", marginBottom: 20 }}
						key={category.category}
					>
						<Text size={20} weight="bold" wrapperProps={{ ml: 15, mb: 15 }}>
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
								style={{ width: "100%", marginLeft: 10 }}
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
		</Box>
	);
}

export function RecommendationsSkeletonLoader() {
	return (
		<View style={styles.container}>
			<SkeletonLoader
				boneColor={LiveAppState.themeValue.get().colors.surface}
				highlightColor={LiveAppState.themeValue.get().colors.surface}
				duration={1500}
			>
				<SkeletonLoader.Item style={styles.title} />
				<SkeletonLoader.Container
					style={{ flexDirection: "row", width: "100%" }}
				>
					<SkeletonLoader.Item style={styles.thumbnail} />
					<SkeletonLoader.Item style={styles.thumbnail} />
					<SkeletonLoader.Item
						style={{
							...styles.thumbnail,
							width: card.width - 100,
							borderTopLeftRadius: 0,
							borderTopRightRadius: 0,
						}}
					/>
				</SkeletonLoader.Container>
			</SkeletonLoader>
		</View>
	);
}

const styles = {
	container: {
		margin: 10,
		paddingHorizontal: 20,
	},
	thumbnail: {
		width: card.width,
		height: card.height,
		borderRadius: 5,
		marginRight: 10,
	},
	title: {
		height: 30,
		width: 150,
		marginBottom: 10,
		borderRadius: 5,
	},
};

export default Recommendations;
