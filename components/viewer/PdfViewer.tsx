import { Dimensions, StyleSheet, View } from "react-native";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useRef, useImperativeHandle } from "react";
import Pdf from "react-native-pdf";

import { theme } from "../../constants";
import ViewerLoading from "./ViewerLoading";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { sentryCapture } from "../../utils";

export interface ExposedMethods {
	jumpToPage: (page: number) => void;
}

const PdfViewer = React.forwardRef<ExposedMethods, {}>(
	(
		{
			fileUri,
			bookCover,
			page,
			setPages,
			setCurrentpage,
		}: {
			fileUri: string;
			bookCover: string;
			page?: number;
			setPages: (value: number) => void;
			setCurrentpage: (value: number) => void;
		},
		ref
	) => {
		const pdfViewerRef = useRef<Pdf>(null);

		useImperativeHandle(ref, () => ({
			jumpToPage(page: number) {
				pdfViewerRef.current?.setPage(page);
			},
		}));

		useEffect(() => {
			FileSystem.getInfoAsync(fileUri)
				.then((fileinfo) => {
					console.log(fileinfo);
					if (fileinfo.exists === false) {
						Toast.show({ title: "File Not Found", type: ALERT_TYPE.DANGER });
					} else {
						console.log("File exists");
					}
				})
				.catch((error) => {
					sentryCapture(error);
					Toast.show({
						title: "Error Checking If File Exists",
						textBody: error?.message || "",
						type: ALERT_TYPE.DANGER,
					});
				});
		}, []);

		return (
			<View style={{ flex: 1 }}>
				<Pdf
					ref={pdfViewerRef}
					renderActivityIndicator={() => (
						<ViewerLoading bookCover={bookCover} />
					)}
					source={{ uri: `${decodeURIComponent(fileUri)}` }}
					enableAnnotationRendering
					onLoadComplete={(numberOfPages, filePath) => {
						setPages(numberOfPages);
					}}
					onPageChanged={(page, numberOfPages) => {
						setCurrentpage(page);
					}}
					onError={(error) => {
						Toast.show({
							title: "Error Loading PDF",
							textBody: error?.message || "",
						});
						sentryCapture(error as Error);
					}}
					onPressLink={(uri) => {
						//console.log(`Link pressed: ${uri}`);
					}}
					page={page}
					style={{
						...styles.pdf,
					}}
				/>
			</View>
		);
	}
);

export default PdfViewer;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
		marginTop: 25,
	},
	pdf: {
		flex: 1,
		width: Dimensions.get("window").width,
		backgroundColor: theme.colors.background,
	},
});
