import * as Animatable from "react-native-animatable";
import React, { useEffect, useState } from "react";
import Box from "../components/Box";
import Text from "../components/Text";
import { Animated, Pressable } from "react-native";
import { LiveAppState, UserStore } from "../store/store";
import Button from "../components/Button";
import Spacer from "../components/Spacer";
import { Account } from "../types/types";
import { Redirect, useRouter } from "expo-router";
import BasePage from "../components/BasePage";

const index = () => {
	const [accountInfo, setAccountInfo] = useState<Account | null>(
		UserStore.account.get()
	);
	const router = useRouter();

	UserStore.account.onChange((newValue) => {
		setAccountInfo(newValue);
	});

	return (
		<>
			{accountInfo ? (
				<Redirect href={"/tabs/library/shelf"} />
			) : (
				<BasePage>
					<Box px={20} block justify="center" align="center" height={"100%"}>
						<Animatable.View
							animation={"fadeInUp"}
							style={{
								alignItems: "center",
								width: "100%",
							}}
						>
							<Animated.Image
								source={require("../assets/logo.png")}
								style={{
									width: 150,
									height: 150,
								}}
							/>
							<Pressable
								onLongPress={() => {
									router.replace("/tabs/search");
								}}
							>
								<Animated.Text
									style={{
										color: LiveAppState.themeValue.get().colors.primary,
										fontWeight: "900",
										fontSize: 42,
									}}
								>
									Livre
								</Animated.Text>
							</Pressable>

							<Spacer height={90} />
							<Box align="center">
								<Text size={22} align="center" weight="300">
									Thousands of Books
								</Text>
								<Text size={22} align="center" weight="300">
									on The Palm of Your Hand
								</Text>
							</Box>
							<Spacer height={20} />
							<Button
								mode="contained"
								onPress={() => {
									router.push("/oauthredirect");
									// setCreatingAccount(true);
									// promptAsync();
								}}
								labelStyle={{ fontWeight: "bold" }}
								style={{ width: "100%" }}
							>
								Next
							</Button>
						</Animatable.View>
					</Box>
				</BasePage>
			)}
		</>
	);
};

export default index;
