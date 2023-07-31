import { Pressable, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Avatar, Divider, IconButton, Menu } from "react-native-paper";
import { LiveAppState, SettingsStore, UserStore } from "../../store/store";
import { Account } from "../../types/types";
import Text from "../Text";
import Button from "../Button";
import { useRouter } from "expo-router";
import Box from "../Box";
import { theme } from "../../constants";

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
		router.replace("/");
	}

	return (
		<Box
			color={LiveAppState.themeValue.colors.surface.get()}
			pa={20}
			radius={20}
			align="stretch"
			style={{ position: "relative" }}
		>
			<Menu
				visible={visible}
				onDismiss={closeMenu}
				anchorPosition="bottom"
				theme={LiveAppState.themeValue.get()}
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
								<Text
									style={{
										fontSize: 20,
										fontWeight: "bold",
										marginBottom: 5,
									}}
								>
									{accountInfo.fullname}
								</Text>
								<Text>{accountInfo.email}</Text>
							</View>
						</Box>
					</Pressable>
				}
			>
				<Menu.Item onPress={() => {}} title="Sign Out" />
			</Menu>
			{/* <Pressable onPress={() => signOut()}>
				<Text color={LiveAppState.themeValue.colors.text.get()} size={12}>
					Sign Out
				</Text>
			</Pressable> */}
		</Box>
	);
};

export default ProfileManger;

const styles = StyleSheet.create({});
