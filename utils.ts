import * as FileSystem from "expo-file-system";
import { LayoutAnimation, PermissionsAndroid, Platform } from "react-native";
import RNFetchBlob from "rn-fetch-blob";
import * as Permissions from "expo-permissions";
import RNFS from "react-native-fs";

import { DownloadsStore } from "./store/store";

import { BookType, DownloadLink, DownloadType, FullBookType } from "./types";

// export async function downloadFile(
//   id: number,
//   url: string,
//   fileName: string,
//   fileType: string,
//   onProgress: (id: number, progress: number) => void
// ) {
//   const customDirectoryName = "livre";

//   let documentDirectoryPath = FileSystem.documentDirectory;
//   if (Platform.OS === "android") {
//     documentDirectoryPath = documentDirectoryPath.replace("file://", "");
//   }

//   const fileInfo = await FileSystem.getInfoAsync(
//     `${documentDirectoryPath}${customDirectoryName}`
//   );
//   if (!fileInfo.exists) {
//     await FileSystem.makeDirectoryAsync(
//       `${documentDirectoryPath}${customDirectoryName}`,
//       { intermediates: true }
//     );
//   }

//   const fileUri = `${documentDirectoryPath}${customDirectoryName}/${fileName}.${fileType}`;

//   const downloadResumable = FileSystem.createDownloadResumable(
//     url,
//     fileUri,
//     {},
//     (downloadProgress) => {
//       const progress =
//         downloadProgress.totalBytesWritten /
//         downloadProgress.totalBytesExpectedToWrite;
//       onProgress(id, progress);
//     }
//   );

//   try {
//     const { uri } = await downloadResumable.downloadAsync();
//     console.log("Uri: " + uri);
//     return { uri, id };
//   } catch (error) {
//     console.error(error);
//   }
// }

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
  const downloadId = Math.floor(Math.random() * 1000);

  const download: DownloadType = {
    downloadId,
    progress: 0,
    book: fullBook,
    link: links[0],
    filepath: null,
  };

  DownloadsStore.downloads.set([download, ...DownloadsStore.downloads.get()]);

  const base64Cover = await downloadFileAsBase64(fullBook.coverurl);
  DownloadsStore.downloads[0].book.base64Cover.set(
    `data:image/jpeg;base64,${base64Cover}`
  );

  console.log("cover downloaded");

  const { uri, id } = await downloadFile(
    downloadId,
    download.link.link,
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
