import React from "react";
import { View } from "react-native";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import { BookType } from "../types/types";
import { trimText } from "../utils";
import BaseImage from "./BaseImage";
import { useRouter } from "expo-router";
import { LiveAppState } from "../store/store";
import Text from "./Text";
import Box from "./Box";
import Spacer from "./Spacer";

function BookCard({
	book,
	onPress = null,
}: {
	book: BookType;
	onPress: (book: BookType) => void;
}) {
	return (
		<Box
			my={5}
			radius={15}
			style={{
				overflow: "hidden",
			}}
		>
			<TouchableNativeFeedback
				onPress={() => onPress(book)}
				background={TouchableNativeFeedback.Ripple(
					LiveAppState.themeValue.get().colors.surface,
					false
				)}
			>
				<Box
					direction="row"
					block
					justify="space-between"
					pa={10}
					style={{
						overflow: "hidden",
					}}
				>
					<BaseImage
						style={{ height: 200, width: 140, borderRadius: 5 }}
						source={{ uri: book.cover }}
						placeholderStyles={{
							height: 200,
							width: 140,
							borderRadius: 5,
							top: 10,
							left: 10,
						}}
					/>
					<Box
						pl={10}
						justify="space-between"
						style={{
							flex: 1,
						}}
					>
						<Box>
							<Text size={14} lineHeight={18} weight="bold">
								{trimText(book.title, 70)}
							</Text>
							<Spacer height={5} />
							<Text>{book.authors[0].name}</Text>
						</Box>
						<Box mt={10} style={{ opacity: 0.8 }}>
							<BookInfo label="Publisher" info={book.publisher} />
							<Box direction="row" justify="space-between">
								<BookInfo
									label="Pages"
									info={book?.pages.replace(/\[.*?\]/g, "")}
								/>
								<BookInfo label="Year" info={book.year} />
								<BookInfo label="Type" info={book.extension} />
							</Box>
						</Box>
					</Box>
				</Box>
			</TouchableNativeFeedback>
		</Box>
	);
}

export function BookInfo({ label, info }: { label: string; info: string }) {
	return (
		<Box radius={10} py={5}>
			<Box direction="row" align="center">
				<Text wrapperProps={{ mr: 10 }} size={12}>
					{label}
				</Text>
			</Box>
			{info ? (
				<Text size={14}>{trimText(info, 40)}</Text>
			) : (
				<Text
					style={{
						textDecorationLine: "line-through",
					}}
				>
					missing
				</Text>
			)}
		</Box>
	);
}

export default BookCard;
