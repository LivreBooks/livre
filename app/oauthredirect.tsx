import { useRouter, useSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native-paper";
import BasePage from "../components/BasePage";
import Box from "../components/Box";
import Text from "../components/Text";
import { Account, GoogleUser, NewUser, UserProfile } from "../types/types";
import { FetchResponse, fetchUtil } from "../utils";
import { UserStore } from "../store/store";
import { BASE_URL } from "../constants";

export default function oauthredirect() {
	const router = useRouter();
	const searchParams = useSearchParams<{
		authuser: string;
		code: string;
		prompt: string;
		scope: string;
		state: string;
	}>();

	useEffect(() => {
		console.log(searchParams);
		getUserInfoFromGoogle(searchParams["code"]);
	}, []);
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
			console.log(error);
			return;
		}
		UserStore.account.set(data.account);
		UserStore.downloads.set(data.downloads);
	}

	const getUserInfoFromGoogle = async (token: string) => {
		if (!token) return;

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
			router.replace("/tabs/search");
		} catch (error) {
			// Add your own error handling logic here
			console.log(error);
		}
	};

	return (
		<BasePage>
			<Box block gap={10} height={"100%"} align="center" justify="center">
				<Text weight="bold">Creating Account</Text>
				<ActivityIndicator color="gray" size={"small"} />
			</Box>
		</BasePage>
	);
}
