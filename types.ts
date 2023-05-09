export interface SubCategoryType {
  name: string;
  id: string;
}

export interface CategoryType {
  name: string;
  id: string;
  subCategories: SubCategoryType[];
}
export interface BookType {
  id: string;
  title: string;
  authors: {
    name: string;
  }[];
  link: string;
  cover: string;
  publisher: string;
  year: string;
  pages: string;
  extension: string;
  size: string;
  language: string;
  isbn: string;
}

export interface FullBookType {
  id: string;
  title: string;
  volumeinfo: string;
  series: string;
  periodical: string;
  author: string;
  year: string;
  edition: string;
  publisher: string;
  city: string;
  pages: string;
  language: string;
  topic: string;
  library: string;
  issue: string;
  identifier: string;
  issn: string;
  asin: string;
  udc: string;
  lbc: string;
  ddc: string;
  lcc: string;
  doi: string;
  googlebookid: string;
  openlibraryid: string;
  commentary: string;
  dpi: string;
  color: string;
  cleaned: string;
  orientation: string;
  paginated: string;
  scanned: string;
  bookmarked: string;
  searchable: string;
  filesize: string;
  extension: string;
  md5: string;
  generic: string;
  visible: string;
  locator: string;
  local: string;
  timeadded: string;
  timelastmodified: string;
  coverurl: string;
  base64Cover?: string | null;
  identifierwodash: string;
  tags: string;
  pagesinfile: string;
  descr: any;
  toc: any;
  sha1: string;
  sha256: string;
  crc32: string;
  edonkey: string;
  aich: string;
  tth: string;
  ipfs_cid: string;
  btih: string;
  torrent: string;
}

export interface DownloadType {
  downloadId: number;
  link: DownloadLink;
  book: FullBookType;
  progress: number;
  filepath: string | null;
}

export interface DownloadLink {
  link: string;
  provider: string;
}

export interface ReaderTheme {
  backgroundColor: string;
  textColor: string;
}

export interface RecommendationCategory {
  category: string;
  books: FullBookType[];
}
