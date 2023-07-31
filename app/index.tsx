import * as Animatable from "react-native-animatable";
import React, { useEffect, useState } from "react";
import * as Google from "expo-auth-session/providers/google";
import Box from "../components/Box";
import Text from "../components/Text";
import { Animated } from "react-native";
import { LiveAppState, UserStore } from "../store/store";
import Button from "../components/Button";
import Spacer from "../components/Spacer";
import { BASE_URL, theme } from "../constants";
import { NewUser, Account, GoogleUser, UserProfile } from "../types/types";
import { FetchResponse, fetchUtil } from "../utils";
import { Redirect, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";

// WebBrowser.maybeCompleteAuthSession();

const index = () => {
	const redirectUri = makeRedirectUri({
		scheme: "livre",
		isTripleSlashed: true,
	});

	console.log(redirectUri);

	const [googleToken, setGoogleToken] = useState("");

	const [accountInfo, setAccountInfo] = useState<Account | null>(
		UserStore.account.get()
	);

	const [creatingAccount, setCreatingAccount] = useState(false);

	const [request, response, promptAsync] = Google.useAuthRequest({
		androidClientId:
			"119960243223-vvjr9qm1qt7ekcennt9mb6q0vnnhva85.apps.googleusercontent.com",
	});

	const [fetchingUserProfile, setFetchingUserProfile] = useState(false);

	const router = useRouter();

	const createAccount = async (user: NewUser): Promise<Account> => {
		const response: FetchResponse<{ data: Account }> = await fetchUtil<{
			data: Account;
		}>(`${BASE_URL}/create_account`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: user.id,
				fullname: user.name,
				email: user.email,
				avatar_url: user.picture,
			}),
		});

		if (response.error) {
			console.error(response.error);
			throw response.error; // Reject the Promise if there's an error
		}

		UserStore.account.set(response.data.data);
		setAccountInfo(response.data.data);
		return response.data.data;
	};

	async function fetchUserProfile() {
		const user_id = UserStore.account.id.get();
		if (!user_id) {
			return;
		}
		setFetchingUserProfile(true);
		const { data, error, status } = await fetchUtil<UserProfile>(
			`${BASE_URL}/get_user_profile?user_id=${user_id}`
		);
		setFetchingUserProfile(false);
		if (error) {
			//console.log(error);
			return;
		}
		setAccountInfo(data.account);
		UserStore.account.set(data.account);
		UserStore.downloads.set(data.downloads);
		UserStore.purchases.set(data.purchases);
	}

	const getUserInfoFromGoogle = async () => {
		if (!googleToken) return;

		try {
			const response: FetchResponse<GoogleUser> = await fetchUtil<GoogleUser>(
				"https://www.googleapis.com/userinfo/v2/me",
				{
					headers: {
						Authorization: `Bearer ${googleToken}`,
					},
				}
			);

			if (response.error) {
				console.error(response.error);
				throw response.error; // Add your own error handling logic here
			}

			const user = await createAccount(response.data);
			if (!user) return;
			await fetchUserProfile();
			router.replace("/tabs/search");
		} catch (error) {
			// Add your own error handling logic here
			//console.log(error);
		}

		setCreatingAccount(false);
	};

	useEffect(() => {
		if (response) {
			if (response?.type === "success") {
				//console.log("=================");
				setGoogleToken(response.authentication.accessToken);
				//console.log({ token: response.authentication.accessToken });
				getUserInfoFromGoogle();
			} else {
				console.log("Error");
			}
		} else {
			console.log("No response");
		}
	}, [response, googleToken]);

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
						<Animated.Text
							style={{
								color: LiveAppState.themeValue.get().colors.primary,
								fontWeight: "900",
								fontSize: 42,
							}}
						>
							Livre
						</Animated.Text>
						<Spacer height={20} />
						<Box align="center">
							<Text
								size={22}
								align="center"
								weight="300"
								color={theme.colors.text}
							>
								Thousands of Books
							</Text>
							<Text
								size={22}
								align="center"
								color={theme.colors.text}
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
