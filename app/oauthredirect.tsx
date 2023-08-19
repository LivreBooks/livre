import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Image } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import BasePage from "../components/BasePage";
import Box from "../components/Box";
import Text from "../components/Text";
import { Account, GoogleUser, NewUser, UserProfile } from "../types/types";
import { FetchResponse, fetchUtil, sentryCapture } from "../utils";
import { LiveAppState, UserStore } from "../store/store";
import { BASE_URL } from "../constants";
import Button from "../components/Button";
import Spacer from "../components/Spacer";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

WebBrowser.maybeCompleteAuthSession();

export default function oauthredirect() {
	const router = useRouter();

	const [request, response, promptAsync] = Google.useAuthRequest({
		androidClientId:
			"119960243223-vvjr9qm1qt7ekcennt9mb6q0vnnhva85.apps.googleusercontent.com",
	});

	const [loading, setLoading] = useState(false);

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
		return response.data.data;
	};

	async function fetchUserProfile() {
		const user_id = UserStore.account.id.get();
		if (!user_id) {
			return;
		}
		const { data, error, status } = await fetchUtil<UserProfile>(
			`${BASE_URL}/get_user_profile?user_id=${user_id}`
		);
		if (error) {
			sentryCapture(error);

			Toast.show({
				title: "Error Fetching Your Profile from Google",
				textBody: error.message,
				type: ALERT_TYPE.DANGER,
				autoClose: false,
			});
			return;
		}
		UserStore.account.set(data.account);
		UserStore.downloads.set(data.downloads);
	}

	const getUserInfoFromGoogle = async (token: string) => {
		if (!token) return;

		setLoading(true);

		try {
			const response: FetchResponse<GoogleUser> = await fetchUtil<GoogleUser>(
				"https://www.googleapis.com/userinfo/v2/me",
				{
					headers: {
						Authorization: `Bearer ${token}`,
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
			setLoading(false);

			router.replace("/tabs/search");
		} catch (error) {
			sentryCapture(error);

			Toast.show({
				title: "Error Fetching Your Account from Google",
				textBody: error.message,
				type: ALERT_TYPE.DANGER,
				autoClose: false,
			});
		}
	};

	const [appTheme, setAppTheme] = useState(LiveAppState.themeValue.get());

	LiveAppState.themeValue.onChange((theme) => {
		setAppTheme(theme);
	});

	useEffect(() => {
		if (response) {
			if (response?.type === "success") {
				getUserInfoFromGoogle(response.authentication.accessToken);
			} else {
				Toast.show({
					title: "Access Token Error",
					textBody: `Response is "${response.type}"`,
					type: ALERT_TYPE.DANGER,
					autoClose: false,
				});
			}
		}
	}, [response]);

	return (
		<BasePage>
			<Box
				block
				gap={10}
				px={20}
				height={"100%"}
				align="center"
				justify="center"
			>
				<Box mb={40} align="center" block>
					<Image
						source={require("../assets/logo.png")}
						style={{
							width: 150,
							height: 150,
						}}
					/>
					<Text
						style={{
							color: appTheme.colors.primary,
							fontWeight: "900",
							fontSize: 42,
						}}
					>
						Livre
					</Text>
					<Spacer height={20} />
					<Box align="center">
						<Text
							size={22}
							align="center"
							weight="300"
							color={appTheme.colors.text}
						>
							Adventure awaits!
						</Text>
						<Text
							size={22}
							align="center"
							color={appTheme.colors.text}
							weight="300"
						>
							Embrace the magic of reading
						</Text>
					</Box>
				</Box>
				<Box block>
					<Button
						mode="contained"
						icon={"google"}
						onPress={() => {
							promptAsync();
						}}
						labelStyle={{ fontWeight: "bold" }}
						loading={loading}
					>
						Sign In
					</Button>
				</Box>
			</Box>
		</BasePage>
	);
}
