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
import { makeRedirectUri } from "expo-auth-session";

const index = () => {
	const [accountInfo] = useState<Account | null>(UserStore.account.get());

	const router = useRouter();

	return (
		<>
			{accountInfo ? (
				<Redirect href={"/tabs/library/shelf"} />
			) : (
				<Box
					height={"100%"}
					pa={20}
					align="center"
					justify="center"
					color={LiveAppState.themeValue.colors.background.get()}
				>
					<Animatable.View
						animation={"fadeInUp"}
						style={{
							marginBottom: 40,
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

						<Spacer height={20} />
						<Box align="center">
							<Text
								size={22}
								align="center"
								weight="300"
								color={LiveAppState.themeValue.colors.text.get()}
							>
								Thousands of Books
							</Text>
							<Text
								size={22}
								align="center"
								color={LiveAppState.themeValue.colors.text.get()}
								weight="300"
							>
								on The Palm of Your Hand
							</Text>
						</Box>
						<Spacer height={40} />
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
			)}
		</>
	);
};

export default index;
