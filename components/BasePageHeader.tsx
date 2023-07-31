import { StyleSheet } from "react-native";
import React from "react";
import * as Animatable from "react-native-animatable";
import Text from "./Text";

const BasePageHeader = ({ title, icon }: { title: string; icon: string }) => {
	return (
		<Animatable.View
			animation={"fadeInUp"}
			style={{
				paddingVertical: 20,
				alignItems: "center",
				justifyContent: "center",
				width: "100%",
			}}
		>
			<Text weight="bold" size={26}>
				{title}
			</Text>
		</Animatable.View>
	);
};

export default BasePageHeader;

const styles = StyleSheet.create({});
