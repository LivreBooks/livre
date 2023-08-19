import { Pressable, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Menu } from "react-native-paper";
import { LiveAppState, SettingsStore, UserStore } from "../../store/store";
import { Account } from "../../types/types";
import Text from "../Text";
import { useRouter } from "expo-router";
import Box from "../Box";

const ProfileManger = () => {
	const [accountInfo, setAccountInfo] = useState<Account | null>(
		UserStore.account.get()
	);

	const router = useRouter();

	const [visible, setVisible] = React.useState(false);

	const openMenu = () => setVisible(true);

	const closeMenu = () => setVisible(false);

	function signOut() {
		console.log("Signing Out");
		SettingsStore.user.set(null);
		UserStore.account.set(null);
		setAccountInfo(null);
		router.replace("/oauthredirect");
	}

	const [appTheme, setAppTheme] = useState(LiveAppState.themeValue.get());

	LiveAppState.themeValue.onChange((theme) => {
		setAppTheme(theme);
	});

	return (
		<>
			{accountInfo && (
				<Box
					color={appTheme.colors.surface}
					pa={20}
					radius={20}
					align="stretch"
					style={{ position: "relative" }}
				>
					<Menu
						visible={visible}
						onDismiss={closeMenu}
						anchorPosition="bottom"
						theme={appTheme}
						anchor={
							<Pressable onPress={openMenu}>
								<Box direction="row" block>
									{accountInfo.avatar_url && (
										<Avatar.Image source={{ uri: accountInfo.avatar_url }} />
									)}
									<View
										style={{
											marginLeft: 10,
										}}
									>
										<Text size={20} weight="bold" wrapperProps={{ mb: 5 }}>
											{accountInfo.fullname}
										</Text>
										<Text>{accountInfo.email}</Text>
									</View>
								</Box>
							</Pressable>
						}
					>
						<Menu.Item onPress={signOut} title="Sign Out" theme={appTheme} />
					</Menu>
				</Box>
			)}
		</>
	);
};

export default ProfileManger;

const styles = StyleSheet.create({});
