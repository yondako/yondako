import type { BookDetail } from "@/types/book";
import { XMLParser } from "fast-xml-parser";
import { createAuthors, createPublishers, createThumbnailUrl } from "./utils";

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

// NOTE:
// 国立国会図書館が提供するAPIでは最大500件までしか取得できない
// https://ndlsearch.ndl.go.jp/file/help/api/specifications/ndlsearch_api_20240712.pdf
const totalResultsLimit = 500;

/**
 * NDL API (OpenSearch) のレスポンスをパース
 * @param xml レスポンス (RSS)
 * @returns Bookオブジェクトの配列
 */
export function parseOpenSearchResponse(xml: string): OpenSearchResponse {
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

  const totalResults = parsed.rss.channel["openSearch:totalResults"] ?? 0;

  return {
    meta: {
      totalResults:
        totalResults >= totalResultsLimit ? totalResultsLimit : totalResults,
      startIndex: parsed.rss.channel["openSearch:startIndex"] ?? 0,
      itemsPerPage: parsed.rss.channel["openSearch:itemsPerPage"] ?? 0,
    },
    books: rawBooks.filter((book) => book !== undefined),
  };
}
