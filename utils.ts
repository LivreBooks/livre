import * as FileSystem from "expo-file-system";
import { LayoutAnimation, PermissionsAndroid } from "react-native";
import RNFS from "react-native-fs";

import { DownloadsStore, SettingsStore, UserStore } from "./store/store";
import {
  BookType,
  Download,
  DownloadLink,
  DownloadType,
  FullBookType,
} from "./types/types";
import { BASE_URL } from "./constants";

export async function downloadFile(
  id: number,
  url: string,
  fileName: string,
  fileType: string,
  onProgress: (id: number, progress: number) => void
) {
  await requestExternalStoragePermission();

  const externalPath = `${RNFS.ExternalStorageDirectoryPath}/livre`;

  const folderExists = await RNFS.exists(externalPath);

  if (folderExists === false) {
    try {
      await RNFS.mkdir(externalPath);
      console.log("Folder created successfully!");
    } catch (error) {
      console.log("Error creating folder: ", error);
    }
  } else {
    console.log("folder exists");
  }

  const fileUri = `file://${externalPath}/${fileName}.${fileType}`;

  console.log({ fileUri });

  const downloadResumable = FileSystem.createDownloadResumable(
    url,
    fileUri,
    {},
    (downloadProgress) => {
      const progress =
        downloadProgress.totalBytesWritten /
        downloadProgress.totalBytesExpectedToWrite;
      onProgress(id, progress);
    }
  );

  try {
    const { uri } = await downloadResumable.downloadAsync();
    console.log("File downloaded to:", uri);
    return { uri, id };
  } catch (error) {
    console.error(error);
  }
}

interface DownloadRecord {
  bookId: string;
  bookName: string;
  bookCover: string;
  bookAuthor: string;
}

function recordDownload(record: DownloadRecord): Promise<DownloadRecord> {
  if (UserStore.account.get() === null) {
    return;
  }
  return new Promise((resolve, reject) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    fetch(`${BASE_URL}/record_download`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        bookId: record.bookId,
        bookName: record.bookName,
        bookCover: record.bookCover,
        bookAuthor: record.bookAuthor,
        userId: UserStore.account.id.get(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("=======++++++-----");
        console.log(data);

        const newDownloadRecord: Download = {
          id: Math.random().toString(),
          book_id: data.data.bookId,
          book_name: data.data.bookName,
          book_cover: data.data.bookCover,
          book_author: data.data.bookAuthor,
          read_on: new Date().toDateString(),
          user_id: UserStore.account.id.get(),
        };

        UserStore.downloads.set([
          newDownloadRecord,
          ...UserStore.downloads.get(),
        ]);

        UserStore.account.tokens.set(
          parseInt(UserStore.account.tokens.get()) - 1
        );

        resolve(data.data);
      })
      .catch((err) => {
        reject(err);
        console.log(err);
      })
      .finally(() => {
        console.log("Account Request Done");
      });
  });
}

async function requestExternalStoragePermission() {
  // Check if we have read and write permission to external storage
  const hasReadPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
  );
  const hasWritePermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
  );

  if (!hasReadPermission || !hasWritePermission) {
    // If we don't have both permissions, request them
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);

    if (
      granted["android.permission.READ_EXTERNAL_STORAGE"] !==
        PermissionsAndroid.RESULTS.GRANTED ||
      granted["android.permission.WRITE_EXTERNAL_STORAGE"] !==
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      // If the user denied one or both permissions, exit the function
      return false;
    }
  }

  // If we have both permissions, return true to indicate success
  return true;
}

export async function dowloadBook(
  fullBook: FullBookType,
  links: DownloadLink[]
) {
  console.log("Beginning");
  const downloadId = Math.floor(Math.random() * 1000);

  const newDownload: DownloadType = {
    downloadId,
    progress: 0,
    book: fullBook,
    link: links[0],
    filepath: null,
    readingInfo: {
      currentPage: 1,
      bookmarks: [],
      lastRead: "",
    },
  };

  console.log(fullBook.coverurl);
  console.log(newDownload);
  DownloadsStore.downloads.set([
    newDownload,
    ...DownloadsStore.downloads.get(),
  ]);
  console.log("Startig cover");
  const base64Cover = await downloadFileAsBase64(fullBook.coverurl);
  DownloadsStore.downloads[0].book.base64Cover.set(
    `data:image/jpeg;base64,${base64Cover}`
  );

  console.log("cover downloaded");

  const { uri, id } = await downloadFile(
    downloadId,
    newDownload.link.link,
    fullBook.title.replace(/\s/g, "_").replace(/[^\w\s]/g, ""),
    fullBook.extension,
    (downloadId, progress) => {
      const targetDownloadIndex = DownloadsStore.downloads
        .get()
        .findIndex((download) => download.downloadId === downloadId);
      DownloadsStore.downloads[targetDownloadIndex].progress.set(progress);
      DownloadsStore.downloads.set([...DownloadsStore.downloads.get()]);
    }
  );

  console.log({ uri });

  const targetDownloadIndex = DownloadsStore.downloads
    .get()
    .findIndex((download) => download.downloadId === id);

  DownloadsStore.downloads[targetDownloadIndex].filepath.set(uri);
  DownloadsStore.downloads.set([...DownloadsStore.downloads.get()]);
  const resp = await recordDownload({
    bookId: fullBook.id,
    bookName: fullBook.title,
    bookCover: fullBook.coverurl,
    bookAuthor: fullBook.author,
  });
  console.log(resp);
}

export function trimText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + "...";
  } else {
    return text;
  }
}

export function sortBooksByCompleteness(books: BookType[]): BookType[] {
  const completeBooks = books.filter(
    (book) =>
      book.id &&
      book.title &&
      book.authors &&
      book.link &&
      book.cover &&
      book.publisher &&
      book.year &&
      book.pages &&
      book.extension &&
      book.size &&
      book.language &&
      book.language === "English"
  );
  const incompleteBooks = books.filter(
    (book) =>
      !book.id ||
      !book.title ||
      !book.authors ||
      !book.link ||
      !book.cover ||
      !book.publisher ||
      !book.year ||
      !book.pages ||
      !book.extension ||
      !book.size ||
      !book.language ||
      book.language !== "English"
  );
  return [...completeBooks, ...incompleteBooks];
}

export function layoutAnimate() {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
}

export async function downloadFileAsBase64(fileUrl: string) {
  try {
    const { uri } = await FileSystem.downloadAsync(
      fileUrl,
      FileSystem.cacheDirectory + "file"
    );
    const data = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export interface FetchOptions extends RequestInit {
  // Additional options specific to your application
  // For example, you can define custom headers or authentication tokens
  customHeader?: string;
  authToken?: string;
}

export interface FetchResponse<Data> {
  data: Data | null;
  error: Error | null;
  status: number | null;
}

export const fetchUtil = async <Data>(
  url: string,
  options?: FetchOptions
): Promise<FetchResponse<Data>> => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options?.customHeader && { CustomHeader: options.customHeader }),
      ...(options?.authToken && {
        Authorization: `Bearer ${options.authToken}`,
      }),
      ...options?.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, requestOptions);
    const responseData: Data = await response.json();
    if (!response.ok) {
      throw new Error(responseData);
    }
    return { data: responseData, error: null, status: response.status };
  } catch (error) {
    return { data: null, error, status: null };
  }
};

export function objectToSearchParams(obj: Record<string, string>): string {
  const searchParams = new URLSearchParams();

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      searchParams.append(key, obj[key]);
    }
  }

  return searchParams.toString();
}

export const animateLayout = (config = {}) => {
  LayoutAnimation.configureNext({
    duration: 300,
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
      springDamping: 0.7,
    },
    delete: {
      type: LayoutAnimation.Types.easeOut,
      property: LayoutAnimation.Properties.opacity,
    },
    ...config,
  });
};
