import { observable } from "@legendapp/state";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import {
  Account,
  BookType,
  CategoryType,
  Download,
  DownloadType,
  FullBookType,
  Purchase,
  UserProfile,
} from "../types/types";
import { darkMode, lightMode } from "../constants";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

configureObservablePersistence({
  persistLocal: ObservablePersistMMKV,
});

interface AppStateType {
  selectedBookPreInfo: BookType;
  selectedBookRecommendation: FullBookType;
  themeValue: typeof MD3DarkTheme | typeof MD3LightTheme;
}

interface UserStore {
  account: Account;
  downloads: Download[];
  purchases: Purchase[];
}

interface ExpoloreStoreType {
  exploreData: CategoryType[];
}

export const ExploreStore = observable<ExpoloreStoreType>({
  exploreData: [],
});

export const LiveAppState = observable<AppStateType>({
  selectedBookPreInfo: null,
  selectedBookRecommendation: null,
  themeValue: darkMode,
});

export const UserStore = observable<UserStore>({
  account: null,
  downloads: [],
  purchases: [],
});



interface DonwloadsStoreType {
  downloads: DownloadType[];
  updateId: number;
}
export const DownloadsStore = observable<DonwloadsStoreType>({
  downloads: [],
  updateId: 0,
});
setTimeout(() => {
  DownloadsStore.downloads.set(DownloadsStore.downloads.get().filter(_dl => _dl))
}, 1000);

interface SettingsStoreType {
  theme: "auto" | "light" | "dark";
  user: Account;
}

export const SettingsStore = observable<SettingsStoreType>({
  theme: "dark",
  user: null,
});

const theme = SettingsStore.theme.get();

if (theme === "dark") {
  LiveAppState.themeValue.set(darkMode);
}

if (theme === "light") {
  LiveAppState.themeValue.set(lightMode);
}

persistObservable(DownloadsStore, {
  local: "downloads",
});

persistObservable(ExploreStore, {
  local: "explore",
});

persistObservable(SettingsStore, {
  local: "settings",
});

persistObservable(UserStore, {
  local: "user",
});
