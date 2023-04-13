import { observable } from "@legendapp/state";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { BookType, CategoryType, DownloadType } from "../types";
import mmkv from "react-native-mmkv";

configureObservablePersistence({
  persistLocal: ObservablePersistMMKV,
});

interface AppStateType {
  selectedBookPreInfo: BookType;
}

interface ExpoloreStoreType {
  exploreData: CategoryType[];
}

export const ExploreStore = observable<ExpoloreStoreType>({
  exploreData: [],
});

export const LiveAppState = observable<AppStateType>({
  selectedBookPreInfo: null,
});

interface DonwloadsStoreType {
  downloads: DownloadType[];
  updateId: number;
}
export const DownloadsStore = observable<DonwloadsStoreType>({
  downloads: [],
  updateId: 0,
});

persistObservable(DownloadsStore, {
  local: "downloads",
});

persistObservable(ExploreStore, {
  local: "explore",
});
