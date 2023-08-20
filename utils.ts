import * as FileSystem from "expo-file-system";
import { LayoutAnimation, PermissionsAndroid } from "react-native";

import { DownloadsStore, LiveAppState, SettingsStore, UserStore } from "./store/store";
import {
  BookType,
  Download,
  DownloadLink as ProviderInfo,
  DownloadType,
  FullBookType,
} from "./types/types";
import { BASE_URL } from "./constants";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import * as Sentry from 'sentry-expo';
import hasValidSsl from "./utils/sslChecker";

export function sentryCapture(error: Error) {
  Sentry.Native.captureException(error)
}

export async function downloadFile(
  id: number,
  url: string,
  fileName: string,
  fileType: string,
  onProgress: (id: number, progress: number) => void
) {
  const documentDirectory = FileSystem.documentDirectory + 'livre';

  const folderExists = await FileSystem.getInfoAsync(documentDirectory);

  if (!folderExists.exists) {
    try {
      await FileSystem.makeDirectoryAsync(documentDirectory, { intermediates: true });
    } catch (error) {
      sentryCapture(error)
      Toast.show({ title: 'Error Creating Livre Folder', textBody: error.message });
    }
  }

  const fileUri = `${documentDirectory}/${fileName}.${fileType}`;

  const downloadResumable = FileSystem.createDownloadResumable(
    url,
    fileUri,
    {},
    (downloadProgress) => {
      const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      onProgress(id, progress);
    }
  );

  try {
    const { uri } = await downloadResumable.downloadAsync();
    return { uri, id };
  } catch (error) {
    console.error(error);
    sentryCapture(error)
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


        resolve(data.data);
      })
      .catch((error) => {
        sentryCapture(error as Error);
        reject(error);
      })
  });
}

export async function downloadBook(
  fullBook: FullBookType,
  downloadProviders: ProviderInfo[]
) {
  if (!fullBook || downloadProviders.length === 0) {
    Toast.show({ title: "Error Downloading Book", textBody: "Missing Data" })
    return
  }
  const downloadId = Math.floor(Math.random() * 1000);


  const selectedProvider = downloadProviders.find(providerInfo => providerInfo.provider === LiveAppState.downloadProvider.get());


  const newDownload: DownloadType = {
    downloadId,
    progress: 0,
    book: fullBook,
    link: selectedProvider,
    filepath: null,
    readingInfo: {
      currentPage: 1,
      bookmarks: [],
      lastRead: "",
    },
  };

  DownloadsStore.downloads.set([
    newDownload,
    ...DownloadsStore.downloads.get(),
  ]);
  const base64Cover = await downloadFileAsBase64(fullBook.coverurl);
  DownloadsStore.downloads[0].book.base64Cover.set(
    `data:image/jpeg;base64,${base64Cover}`
  );


  const { uri, id } = await downloadFile(
    downloadId,
    newDownload.link.link,
    fullBook.title.replace(/\s/g, "_").replace(/[^\w\s]|_/g, ""),
    fullBook.extension,
    (downloadId, progress) => {
      const targetDownloadIndex = DownloadsStore.downloads
        .get()
        .findIndex((download) => download.downloadId === downloadId);
      DownloadsStore.downloads[targetDownloadIndex].progress.set(progress);
      DownloadsStore.downloads.set([...DownloadsStore.downloads.get()]);
    }
  );


  const targetDownloadIndex = DownloadsStore.downloads
    .get()
    .findIndex((download) => download.downloadId === id);

  DownloadsStore.downloads[targetDownloadIndex].filepath.set(uri);
  DownloadsStore.downloads.set([...DownloadsStore.downloads.get()]);


  await recordDownload({
    bookId: fullBook.id,
    bookName: fullBook.title,
    bookCover: fullBook.coverurl,
    bookAuthor: fullBook.author,
  });
}

export function trimText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + "...";
  } else {
    return text;
  }
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
  }

  return shuffledArray;
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
    sentryCapture(error)
    Toast.show({ title: "Failed to download file", textBody: `File: ${fileUrl}` })
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
    sentryCapture(error)
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


async function findProviderWithValidSsl() {
  const providers = [
    {
      id: 'Pinata',
      domain: 'pinata.cloud'
    },
    {
      id: 'IPFS.io',
      domain: 'ipfs.io'
    },
    {
      id: 'Cloudflare',
      domain: 'cloudflare-ipfs.com'
    },
  ] as const;

  for (const provider of providers) {
    const res = await hasValidSsl(provider.domain)
    if (res) {
      LiveAppState.downloadProvider.set(provider.id)
      return provider
    }
  }
}

findProviderWithValidSsl()
