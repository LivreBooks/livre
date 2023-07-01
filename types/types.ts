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

export interface Bookmark {
  name: string;
  page: number;
}

export interface DownloadType {
  downloadId: number;
  link: DownloadLink;
  book: FullBookType;
  progress: number;
  filepath: string | null;
  readingInfo: {
    currentPage: number;
    bookmarks: Bookmark[];
    lastRead: string;
  };
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

export interface Account {
  id: string;
  fullname: string;
  email: string;
  created_at: string;
  phone_number?: any;
  avatar_url: string;
  tokens: number;
}

export interface Download {
  id: string;
  book_id: string;
  book_name: string;
  book_cover: string;
  book_author: string;
  read_on: string;
  user_id: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  price: number;
  tokens: number;
  purchase_date: string;
  currency: string;
  provider: string;
}

export interface UserProfile {
  account: Account;
  downloads: Download[];
  purchases: Purchase[];
}

export interface NewUser {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  // Add any additional properties from the response if needed
}

export interface WebviewRequirements {
  user_id: string;
  tokens: number;
  name: string;
  avatar: string;
  email: string;
}

export interface WebviewReturnType {
  order: {
    orderID: string;
    payerID: string;
    paymentID?: any;
    billingToken?: any;
    facilitatorAccessToken: string;
    paymentSource: string;
  };
  transaction: {
    id: string;
    status: string;
    payment_source: {
      paypal: {
        email_address: string;
        account_id: string;
        account_status: string;
        name: {
          given_name: string;
          surname: string;
          full_name?: string;
        };
        address: {
          address_line_1: string;
          admin_area_2: string;
          admin_area_1: string;
          postal_code: string;
          country_code: string;
        };
      };
    };
    purchase_units: {
      reference_id: string;
      shipping: {
        name: {
          given_name: string;
          surname: string;
          full_name?: string;
        };
        address: {
          address_line_1: string;
          admin_area_2: string;
          admin_area_1: string;
          postal_code: string;
          country_code: string;
        };
      };
      payments: {
        captures: {
          id: string;
          status: string;
          amount: {
            currency_code: string;
            value: string;
          };
          final_capture: boolean;
          seller_protection: {
            status: string;
            dispute_categories: string[];
          };
          seller_receivable_breakdown: {
            gross_amount: {
              currency_code: string;
              value: string;
            };
            paypal_fee: {
              currency_code: string;
              value: string;
            };
            net_amount: {
              currency_code: string;
              value: string;
            };
          };
          links: {
            href: string;
            rel: string;
            method: string;
          }[];
          create_time: string;
          update_time: string;
        }[];
      };
    }[];
    payer: {
      name: {
        given_name: string;
        surname: string;
        full_name?: string;
      };
      email_address: string;
      payer_id: string;
      address: {
        address_line_1: string;
        admin_area_2: string;
        admin_area_1: string;
        postal_code: string;
        country_code: string;
      };
    };
    links: {
      href: string;
      rel: string;
      method: string;
    }[];
  };
}

export interface PaypalWebviewSuccessMessage {
  isSuccesful: boolean;
  order: {
    orderID: string;
    payerID: string;
    paymentID?: any;
    billingToken?: any;
    facilitatorAccessToken: string;
    paymentSource: string;
  };
  transaction: {
    error: {
      body: {
        message: string;
        code: string;
      };
      status: number;
      name: string;
    };
  };
  tokens: number;
}

export interface PaypalWebviewFailedMessage {
  isSuccessful: boolean;
  error: Error;
}

export type PaypalWebviewMessage =
  | PaypalWebviewFailedMessage
  | PaypalWebviewSuccessMessage;

export type ThemeType = "auto" | "light" | "dark";
