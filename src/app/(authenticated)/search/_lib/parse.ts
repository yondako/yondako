import { THUMBNAIL_API_BASE_URL } from "@/constants/api";
import type { BookDetail } from "@/types/book";
import { XMLParser } from "fast-xml-parser";

/**
 * 書影画像のURLを作成
 * @param id JP-eコードもしくはISBN-13
 * @return URL
 */
const createThumbnailUrl = (id: string | undefined): string | undefined => {
  return id
    ? `${THUMBNAIL_API_BASE_URL}/${id.replace(/-/g, "")}.jpg`
    : undefined;
};

/**
 * 著者名の配列を作成
 * @param authors カンマ区切りの著者名 or 著者名の配列
 * @return 著者名の配列
 */
const createAuthors = (
  rawAuthors: string | string[] | undefined,
): string[] | undefined => {
  if (!rawAuthors) {
    return;
  }

  const authors = Array.isArray(rawAuthors)
    ? rawAuthors
    : rawAuthors.split(",");

  const results = authors
    .map((author) =>
      author
        // yyyy-yyyy pub. (YYYY年) を消す
        .replace(/(\d{4}-(\d{0,4})?|pub. \d{4}|\(\d{4}年\))/, "")
        // 苗字と名前を区切っているカンマを消す
        .replace(", ", " ")
        .trim(),
    )
    .filter((author) => author !== "");

  // 重複を排除
  return [...new Set(results)];
};

/**
 * 出版社の配列を作成
 * @param publishers カンマ区切りの出版社名 or 出版社名の配列
 * @return 出版社名の配列
 */
function createPublishers(
  rawPublisher: string | string[] | undefined,
): string[] | undefined {
  if (!rawPublisher) {
    return;
  }

  const publishers = Array.isArray(rawPublisher)
    ? rawPublisher
    : rawPublisher.split(",");

  return [...new Set(publishers)];
}

type OpenSearchResponse = {
  meta: {
    totalResults: number;
    startIndex: number;
    itemsPerPage: number;
  };
  books: BookDetail[];
};

type OpenSearchDcIdentifier = {
  "#text": string;
  "@_xsi:type": string;
};

type OpenSearchItem = {
  title: string;
  link: string;
  "dc:title"?: string;
  "dc:creator"?: string | string[];
  "dcndl:volume"?: string;
  "dc:publisher"?: string | string[];
  "dc:identifier"?: OpenSearchDcIdentifier | OpenSearchDcIdentifier[];
};

type OpenSearchResult = {
  rss?: {
    channel: Partial<{
      "openSearch:totalResults": number;
      "openSearch:startIndex": number;
      "openSearch:itemsPerPage": number;
      item: OpenSearchItem | OpenSearchItem[];
    }>;
  };
};

/**
 * NDL API (OpenSearch) のレスポンスをパース
 * @param xml レスポンス (RSS)
 * @returns Bookオブジェクトの配列
 */
export const parseOpenSearchResponse = (xml: string): OpenSearchResponse => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    trimValues: true,
    parseAttributeValue: true,
    numberParseOptions: {
      hex: false,
      leadingZeros: false,
    },
  });

  const parsed: OpenSearchResult = parser.parse(xml);

  if (!parsed?.rss?.channel) {
    throw new Error("レスポンスの形式が異なります");
  }

  // 検索結果なし
  if (!parsed.rss.channel.item) {
    return {
      meta: {
        totalResults: 0,
        startIndex: 0,
        itemsPerPage: 0,
      },
      books: [],
    };
  }

  const items = Array.isArray(parsed.rss.channel.item)
    ? parsed.rss.channel.item
    : [parsed.rss.channel.item];

  const rawBooks: (BookDetail | undefined)[] = items.map((item) => {
    if (!item["dc:identifier"]) {
      console.error(`dc:identifier がありません: ${item.title}`);
      return;
    }

    const identifier = Array.isArray(item["dc:identifier"])
      ? item["dc:identifier"]
      : [item["dc:identifier"]];

    const ndlBibId = identifier.find(
      (id) => id["@_xsi:type"] === "dcndl:NDLBibID",
    )?.["#text"];

    // NDLBibID がない場合はDBに追加できないのでスキップ
    if (!ndlBibId) {
      console.error(`NDLBibIDがありません: ${item.title}`);
      return;
    }

    // 巻数があればタイトルに追加
    const title = item["dcndl:volume"]
      ? `${item.title} (${item["dcndl:volume"]})`
      : item.title;

    const isbn = identifier.find((id) => id["@_xsi:type"] === "dcndl:ISBN")?.[
      "#text"
    ];

    const jpNo = identifier.find((id) => id["@_xsi:type"] === "dcndl:JPNO")?.[
      "#text"
    ];

    return {
      title,
      link: item.link,
      authors: createAuthors(item["dc:creator"]),
      publishers: createPublishers(item["dc:publisher"]),
      isbn,
      ndlBibId,
      jpNo,
      thumbnailUrl: createThumbnailUrl(isbn),
    };
  });

  return {
    meta: {
      totalResults: parsed.rss.channel["openSearch:totalResults"] ?? 0,
      startIndex: parsed.rss.channel["openSearch:startIndex"] ?? 0,
      itemsPerPage: parsed.rss.channel["openSearch:itemsPerPage"] ?? 0,
    },
    books: rawBooks.filter((book) => book !== undefined),
  };
};
