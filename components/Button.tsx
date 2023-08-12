import React from "react";
import { ButtonProps, Button as ThemedButton } from "react-native-paper";

const Button = (props: ButtonProps) => {
	return (
		<ThemedButton
			contentStyle={{ height: 50 }}
			labelStyle={{ fontWeight: "400" }}
			style={{ borderRadius: 60 }}
			{...props}
		>
			{props.children}
		</ThemedButton>
	);
};

export default Button;
