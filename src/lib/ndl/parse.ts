import { MAX_UPDATE_CHECK_COUNT } from "@/constants/db";
import type { BookDetailWithoutId } from "@/types/book";
import { XMLParser } from "fast-xml-parser";
import {
  createAuthors,
  createPublishers,
  getIsbnFromSeeAlso,
  getJpeCode,
  toStringOrUndefined,
} from "./utils";

type OpenSearchResponse = {
  meta: {
    totalResults: number;
    startIndex: number;
    itemsPerPage: number;
  };
  books: BookDetailWithoutId[];
};

type OpenSearchText = {
  "#text": string | number;
  "@_xsi:type": string;
};

type OpenSearchRdfSeeAlso = {
  "@_rdf:resource": string;
};

type OpenSearchItem = {
  title: string;
  link: string;
  /** たぶん書誌データの登録日 **/
  pubDate?: string;
  /** 発売前の書籍の場合、ここに発売日の日付が入ってる **/
  "dc:date"?: OpenSearchText;
  "dc:title"?: string;
  "dc:creator"?: string | string[];
  "dcndl:volume"?: string | number;
  "dc:publisher"?: string | string[];
  "dc:identifier"?: OpenSearchText | OpenSearchText[];
  "rdfs:seeAlso"?: OpenSearchRdfSeeAlso | OpenSearchRdfSeeAlso[];
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
export function parseOpenSearchXml(xml: string): OpenSearchResponse {
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

  const rawBooks: (BookDetailWithoutId | undefined)[] = [];
  let totalResults = parsed.rss.channel["openSearch:totalResults"] ?? 0;

  for (const item of items) {
    // 配列にする
    const identifier = item["dc:identifier"]
      ? Array.isArray(item["dc:identifier"])
        ? item["dc:identifier"]
        : [item["dc:identifier"]]
      : undefined;

    const seeAlsoUrls = item["rdfs:seeAlso"]
      ? Array.isArray(item["rdfs:seeAlso"])
        ? item["rdfs:seeAlso"].map((e) => e["@_rdf:resource"])
        : [item["rdfs:seeAlso"]?.["@_rdf:resource"]]
      : undefined;

    // NDL書誌ID
    const ndlBibId = toStringOrUndefined(
      identifier?.find((id) => id["@_xsi:type"] === "dcndl:NDLBibID")?.[
        "#text"
      ],
    );

    // ISBN
    const isbn = identifier
      ? identifier.find((id) => id["@_xsi:type"] === "dcndl:ISBN")?.["#text"]
      : getIsbnFromSeeAlso(seeAlsoUrls);

    // NDL書誌ID と ISBN がない場合は一意のIDが存在しないためスキップ
    if (!ndlBibId && !isbn) {
      console.warn(`ndlBibId と ISBN がありません: ${item.title}`);
      totalResults--;
      continue;
    }

    // 全国書誌番号
    const jpNo = identifier?.find((id) => id["@_xsi:type"] === "dcndl:JPNO")?.[
      "#text"
    ];

    // JP-eコード
    const jpeCode = getJpeCode(seeAlsoUrls);

    // 巻数があればタイトルに追加
    const title = item["dcndl:volume"]
      ? `${item.title} (${item["dcndl:volume"]})`
      : item.title;

    // NDL書誌IDがなく、ISBNがある場合は新刊かも
    const isPotentialNewRelease = !ndlBibId && typeof isbn !== "undefined";

    // 出版日時
    const publishedDate = isPotentialNewRelease
      ? item["dc:date"]?.["#text"].toString()
      : item.pubDate;

    // 新刊フラグが立っているかつ、出版日が半年以上前の場合は更新チェック回数を最大にして新刊として扱わないように
    const updateCheckCount =
      isPotentialNewRelease && isOlderThanHalfYear(publishedDate)
        ? MAX_UPDATE_CHECK_COUNT
        : 0;

    rawBooks.push({
      title,
      link: item.link,
      authors: createAuthors(item["dc:creator"]),
      publishers: createPublishers(item["dc:publisher"]),
      isbn: toStringOrUndefined(isbn),
      ndlBibId,
      jpNo: toStringOrUndefined(jpNo),
      jpeCode,
      updateCheckCount,
    });
  }

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

/**
 * 出版日が半年以上かどうか
 * @param publishedDate 出版日
 * @returns 半年以上ならtrue
 */
export function isOlderThanHalfYear(
  publishedDateStr: string | undefined,
): boolean {
  const publishedDate = publishedDateStr
    ? new Date(publishedDateStr)
    : undefined;

  if (!publishedDate) {
    return false;
  }

  const now = new Date();

  // JSTに変換
  const publishedDateUtc = new Date(
    publishedDate.getTime() - 9 * 60 * 60 * 1000,
  );

  const halfYearAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 6,
    now.getDate(),
  );

  return publishedDateUtc < halfYearAgo;
}
