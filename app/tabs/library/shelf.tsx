import { useState } from "react";
import { View, Dimensions, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ActivityIndicator, Searchbar } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import BaseImage from "../../../components/BaseImage";
import { DownloadsStore, LiveAppState } from "../../../store/store";
import { DownloadType } from "../../../types/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BasePage from "../../../components/BasePage";
import DownloadViewerBottomSheet from "../../../components/library/DownloadViewerBottomSheet";
import Text from "../../../components/Text";
import Box from "../../../components/Box";

const { width: sWidth, height: sHeight } = Dimensions.get("screen");
const coverWidth = sWidth / 2 - 40;
const coverHeight = coverWidth * 1.4 + 10;

export default function Search() {
	const [filterQuery, setFilterQuery] = useState("");

	const onChangeFilter = (query: string) => setFilterQuery(query);

	const [downloads, setDownloads] = useState<DownloadType[]>(
		DownloadsStore.downloads.get()
	);

	const [selectedDownload, setSelectedDownload] = useState<DownloadType>(null);

	const [multiSelectedDownloads, setMultiSelectedDownloads] = useState<
		DownloadType[]
	>([]);

	DownloadsStore.downloads.onChange((downloads) => {
		setDownloads(downloads);
	});

	const [appTheme, setAppTheme] = useState(LiveAppState.themeValue.get());

	LiveAppState.themeValue.onChange((theme) => {
		setAppTheme(theme);
	});

	return (
		<>
			<BasePage headerInfo={{ title: "Library", icon: "book" }}>
				<Box block justify="center" height={"auto"}>
					{downloads && downloads.length > 0 && (
						<Animatable.View animation={"fadeInUp"} delay={10}>
							<Searchbar
								placeholder="Filter"
								icon={"filter-outline"}
								onChangeText={onChangeFilter}
								value={filterQuery}
								theme={appTheme}
								style={{
									borderRadius: 20,
									marginBottom: 5,
									backgroundColor: appTheme.colors.surface,
									width: "98%",
									alignSelf: "center",
								}}
								inputStyle={{
									fontSize: 16,
								}}
							/>
						</Animatable.View>
					)}

					{downloads === null ||
						(downloads.length === 0 && (
							<Box
								block
								height={"80%"}
								align="center"
								justify="center"
								style={{
									opacity: 0.8,
								}}
							>
								<MaterialCommunityIcons
									name="book-alert"
									size={120}
									color={appTheme.colors.text}
								/>
								<Text
									size={20}
									align="center"
									wrapperProps={{ mt: 10 }}
									weight="300"
								>
									Your library is empty. Go to search and fill it up.
								</Text>
							</Box>
						))}

					{downloads && downloads.length > 0 && (
						<FlatList
							numColumns={2}
							columnWrapperStyle={{
								flex: 1,
								justifyContent: "space-between",
								paddingTop: 10,
								paddingBottom: 10,
								paddingHorizontal: 5,
								width: "100%",
							}}
							contentContainerStyle={{ paddingBottom: 140 }}
							data={downloads.filter((download) =>
								download?.book.title.includes(filterQuery)
							)}
							keyExtractor={(item) => item.downloadId.toString()}
							renderItem={({
								item,
								index,
							}: {
								item: DownloadType;
								index: number;
							}) => (
								<Animatable.View
									animation={"fadeInUp"}
									delay={Math.min(10 * index + 1, 500)}
								>
									<TouchableOpacity
										onLongPress={() =>
											setMultiSelectedDownloads([
												...multiSelectedDownloads,
												item,
											])
										}
										onPress={() => setSelectedDownload(item)}
									>
										<>
											{item.filepath === null && (
												<View
													style={{
														position: "absolute",
														alignItems: "center",
														justifyContent: "center",
														backgroundColor: "rgba(0,0,0,0.5)",
														top: 0,
														left: 0,
														width: coverWidth,
														height: coverHeight,
														zIndex: 2,
													}}
												>
													<ActivityIndicator
														color={appTheme.colors.onBackground}
													/>
													<Text>Downloading...</Text>
													<Text style={{ fontWeight: "bold" }}>
														{Math.floor(item.progress * 100)}%
													</Text>
												</View>
											)}
											<BaseImage
												style={{
													height: coverHeight,
													width: coverWidth,
													borderRadius: 10,
												}}
												source={{
													uri: item.book.base64Cover || item.book.coverurl,
												}}
												placeholderStyles={{
													height: coverHeight,
													width: coverWidth,
													borderRadius: 10,
												}}
											/>
										</>
									</TouchableOpacity>
								</Animatable.View>
							)}
						/>
					)}
				</Box>
			</BasePage>

			{selectedDownload && (
				<DownloadViewerBottomSheet
					download={selectedDownload}
					setSelectedDownload={setSelectedDownload}
				/>
			)}
		</>
	);
}
