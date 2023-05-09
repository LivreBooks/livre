import { observable } from "@legendapp/state";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { BookType, CategoryType, DownloadType } from "../types";
import mmkv from "react-native-mmkv";
import { darkMode, lightMode } from "../constants";
import { useColorScheme } from "react-native";

configureObservablePersistence({
  persistLocal: ObservablePersistMMKV,
});

interface AppStateType {
  selectedBookPreInfo: BookType;
  themeValue: typeof darkMode;
}

interface ExpoloreStoreType {
  exploreData: CategoryType[];
}

export const ExploreStore = observable<ExpoloreStoreType>({
  exploreData: [],
});

export const LiveAppState = observable<AppStateType>({
  selectedBookPreInfo: null,
  themeValue: darkMode,
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
}

export const SettingsStore = observable<SettingsStoreType>({
  theme: "auto",
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
