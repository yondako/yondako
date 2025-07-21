import { XMLParser } from "fast-xml-parser";
import { MAX_UPDATE_CHECK_COUNT } from "@/constants/db";
import type { BookDetailWithoutId } from "@/types/book";
import { createAuthors, createPublishers, getIsbnFromSeeAlso, getJpeCode, toStringOrUndefined } from "./utils";

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
      "openSearch:startIndex": number;
      "openSearch:itemsPerPage": number;
      item: OpenSearchItem | OpenSearchItem[];
    }>;
  };
};

/**
 * NDL API (OpenSearch) のレスポンスをパース
 * @param xml - レスポンス (RSS) のXML文字列
 * @returns Bookオブジェクトの配列
 * @throws エラー - レスポンスの形式が異なる場合
 */
export function parseOpenSearchXml(xml: string): BookDetailWithoutId[] {
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
    return [];
  }

  const items = Array.isArray(parsed.rss.channel.item) ? parsed.rss.channel.item : [parsed.rss.channel.item];

  const rawBooks: (BookDetailWithoutId | undefined)[] = [];

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
    const ndlBibId = toStringOrUndefined(identifier?.find((id) => id["@_xsi:type"] === "dcndl:NDLBibID")?.["#text"]);

    // ISBN
    const isbn = identifier
      ? identifier.find((id) => id["@_xsi:type"] === "dcndl:ISBN")?.["#text"]
      : getIsbnFromSeeAlso(seeAlsoUrls);

    // NDL書誌ID と ISBN がない場合は一意のIDが存在しないためスキップ
    if (!ndlBibId && !isbn) {
      console.warn(`ndlBibId と ISBN がありません: ${item.title}`);
      continue;
    }

    // 全国書誌番号
    const jpNo = identifier?.find((id) => id["@_xsi:type"] === "dcndl:JPNO")?.["#text"];

    // JP-eコード
    const jpeCode = getJpeCode(seeAlsoUrls);

    // 巻数があればタイトルに追加
    const title = item["dcndl:volume"] ? `${item.title} (${item["dcndl:volume"]})` : item.title;

    // NDL書誌IDがなく、ISBNがある場合は新刊かも
    const isPotentialNewRelease = !ndlBibId && typeof isbn !== "undefined";

    // 出版日時
    const publishedDate = isPotentialNewRelease ? item["dc:date"]?.["#text"].toString() : item.pubDate;

    // 新刊フラグが立っているかつ、出版日が半年以上前の場合は更新チェック回数を最大にして新刊として扱わないように
    const updateCheckCount = isPotentialNewRelease && isOlderThanHalfYear(publishedDate) ? MAX_UPDATE_CHECK_COUNT : 0;

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

  return rawBooks.filter((book) => book !== undefined);
}

/**
 * 出版日が半年以上かどうかを判定
 * @param publishedDateStr - 出版日を表す文字列
 * @returns 半年以上前ならtrue、そうでなければfalse
 */
export function isOlderThanHalfYear(publishedDateStr: string | undefined): boolean {
  if (!publishedDateStr) {
    return false;
  }

  try {
    const publishedDate = new Date(publishedDateStr);

    // 無効な日付の場合
    if (Number.isNaN(publishedDate.getTime())) {
      return false;
    }

    const now = new Date();
    const halfYearAgo = new Date(now);
    halfYearAgo.setMonth(now.getMonth() - 6);

    return publishedDate < halfYearAgo;
  } catch {
    return false;
  }
}
