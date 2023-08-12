import { StyleSheet } from "react-native";
import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
import Text from "./Text";

const BasePageHeader = ({ title, icon }: { title: string; icon: string }) => {
	return (
		<Animatable.View
			animation={"fadeInUp"}
			style={{
				padding: 10,
				alignItems: "center",
				justifyContent: "center",
				width: "100%",
			}}
		>
			<Text weight="bold" size={24}>
				{title}
			</Text>
		</Animatable.View>
	);
};

export default BasePageHeader;

const styles = StyleSheet.create({});
