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
} from "../types";
import { darkMode, lightMode } from "../constants";

configureObservablePersistence({
  persistLocal: ObservablePersistMMKV,
});

interface AppStateType {
  selectedBookPreInfo: BookType;
  selectedBookRecommendation: FullBookType;
  themeValue: typeof darkMode;
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

interface SettingsStoreType {
  theme: "auto" | "light" | "dark";
  user: Account;
}

export const SettingsStore = observable<SettingsStoreType>({
  theme: "auto",
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
