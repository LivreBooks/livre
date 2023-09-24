import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";
import React, { useEffect, useImperativeHandle, useRef } from "react";
import { Dimensions, View } from "react-native";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import Pdf from "react-native-pdf";
import { theme } from "../../constants";
import { sentryCapture } from "../../utils";
import ViewerLoading from "./ViewerLoading";

export interface ExposedMethods {
	jumpToPage: (page: number) => void;
}

interface PdfProps {
	fileUri: string;
	bookCover: string;
	page?: number;
	setPages: (value: number) => void;
	setCurrentPage: (value: number) => void;
}

const PdfViewer = React.forwardRef<ExposedMethods, PdfProps>(function PdfViewer(
	{ fileUri, bookCover, page, setPages, setCurrentPage }: PdfProps,
	ref
) {
	const pdfViewerRef = useRef<Pdf>(null);

	useImperativeHandle(ref, () => ({
		jumpToPage(page: number) {
			pdfViewerRef.current?.setPage(page);
		},
	}));

	useEffect(() => {
		checkFileExists(fileUri);
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<Pdf
				ref={pdfViewerRef}
				renderActivityIndicator={() => <ViewerLoading bookCover={bookCover} />}
				source={{ uri: `${decodeURIComponent(fileUri)}` }}
				enableAnnotationRendering
				onLoadComplete={(numberOfPages) => {
					setPages(numberOfPages);
				}}
				onPageChanged={(page) => {
					setCurrentPage(page);
				}}
				onError={(error: Error) => {
					Toast.show({
						title: "Error Loading PDF",
						textBody: error?.message || "",
					});
					sentryCapture(error as Error);
				}}
				onPressLink={(uri) => {
					Linking.openURL(uri);
				}}
				page={page}
				style={{
					backgroundColor: theme.colors.background,
					flex: 1,
					width: Dimensions.get("window").width,
				}}
			/>
		</View>
	);
});

export default PdfViewer;

function checkFileExists(fileUri: string) {
	FileSystem.getInfoAsync(fileUri)
		.then((fileInfo) => {
			if (fileInfo.exists === false) {
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
}
