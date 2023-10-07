import { Reader, useReader } from "@epubjs-react-native/core";
import { useFileSystem } from "@epubjs-react-native/expo-file-system";
import { View, useWindowDimensions } from "react-native";
import { Card, IconButton } from "react-native-paper";
import { theme } from "../../constants";
import { LiveAppState } from "../../store/store";
import ViewerLoading from "./ViewerLoading";
import { Toast } from "react-native-alert-notification";
import { sentryCapture } from "../../utils";

const EpubViewer = ({
	fileUri,
	bookCover,
	page = 1,
	onLoad,
}: {
	fileUri: string;
	bookCover: string;
	page?: number;
	onLoad: (payload: object) => void;
}) => {
	const { width, height } = useWindowDimensions();
	const {
		goNext: goToNextEpubPage,
		goPrevious: goToPreviousEpubPage,
		getLocations,
	} = useReader();

	return (
		<View style={{ position: "relative", flex: 1, width: "100%" }}>
			<View>
				<Reader
					src={fileUri}
					width={width}
					height={height - 110}
					fileSystem={useFileSystem}
					enableSelection={false}
					enableSwipe={true}
					onReady={(...data) => {
						const readyData = { ...data };
						for (const entry of Object.entries(readyData)) {
							console.log(entry);
						}
						onLoad(readyData);
						setTimeout(() => {
							const locations = getLocations();
							console.log(locations);
						}, 2000);
					}}
					onLocationChange={(totalLocations, currentLocation) => {
						console.log("======");
						console.log(totalLocations);
						console.log(currentLocation);
					}}
					renderOpeningBookComponent={() => (
						<ViewerLoading bookCover={bookCover} />
					)}
					onDisplayError={(error) => {
						Toast.show({
							title: "Error Loading EPUB",
							textBody: error,
						});
						const err = new Error("Error Loading EPUB", { cause: error });
						sentryCapture(err);
					}}
				/>
			</View>
			<Card
				contentStyle={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					position: "absolute",
					bottom: 20,
					opacity: 0,
					left: width / 2 - 42,
					borderRadius: 20,
					backgroundColor: LiveAppState.themeValue.get().colors.inversePrimary,
				}}
			>
				<IconButton
					icon={"chevron-left"}
					mode="contained"
					containerColor={theme.colors.primary}
					iconColor={theme.colors.background}
					size={15}
					onPress={() => {
						goToPreviousEpubPage();
					}}
					style={{ borderRadius: 20 }}
				/>
				<IconButton
					icon={"chevron-right"}
					mode="contained"
					containerColor={theme.colors.primary}
					iconColor={theme.colors.background}
					size={15}
					onPress={() => {
						goToNextEpubPage();
					}}
					style={{ borderRadius: 20 }}
				/>
			</Card>
		</View>
	);
};

export default EpubViewer;
