import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ViewStyle } from "react-native/types";
import { LiveAppState, SettingsStore } from "../store/store";
import BasePageHeader from "./BasePageHeader";
import Box from "./Box";

function BasePage(props: {
	styles?: ViewStyle;
	headerInfo?: {
		title: string;
		icon: string;
	};
	children:
		| React.ReactElement<any, string | React.JSXElementConstructor<any>>
		| React.ReactFragment
		| React.ReactPortal;
}) {
	const [appTheme, setAppTheme] = useState(LiveAppState.themeValue.get());

	LiveAppState.themeValue.onChange((theme) => {
		setAppTheme(theme);
	});

	return (
		<SafeAreaProvider>
			<Box
				direction="column"
				align="center"
				height={"100%"}
				block
				color={appTheme.colors.background}
				style={{
					...props.styles,
				}}
			>
				{props.headerInfo && (
					<BasePageHeader
						title={props.headerInfo.title}
						icon={props.headerInfo.icon}
					/>
				)}

				<Box px={props.headerInfo ? 10 : 0} block align="center">
					{props.children}
				</Box>
			</Box>
		</SafeAreaProvider>
	);
}

export default BasePage;
