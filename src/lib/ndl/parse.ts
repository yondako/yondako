import { XMLParser } from "fast-xml-parser";
import type { BookDetail } from "#src/types/book";
import {
  createAuthors,
  createPublishers,
  getJpeCode,
  toStringOrUndefined,
} from "./utils";

type OpenSearchResponse = {
  meta: {
    totalResults: number;
    startIndex: number;
    itemsPerPage: number;
  };
  books: BookDetail[];
};

type OpenSearchDcIdentifier = {
  "#text": string | number;
  "@_xsi:type": string;
};

type OpenSearchRdfSeeAlso = {
  "@_rdf:resource": string;
};

type OpenSearchItem = {
  title: string;
  link: string;
  "dc:title"?: string;
  "dc:creator"?: string | string[];
  "dcndl:volume"?: string | number;
  "dc:publisher"?: string | string[];
  "dc:identifier"?: OpenSearchDcIdentifier | OpenSearchDcIdentifier[];
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

  let totalResults = parsed.rss.channel["openSearch:totalResults"] ?? 0;

  const rawBooks: (BookDetail | undefined)[] = items.map((item) => {
    if (!item["dc:identifier"]) {
      console.error(`dc:identifier がありません: ${item.title}`);
      totalResults--;
      return;
    }

    const identifier = Array.isArray(item["dc:identifier"])
      ? item["dc:identifier"]
      : [item["dc:identifier"]];

    const ndlBibId = toStringOrUndefined(
      identifier.find((id) => id["@_xsi:type"] === "dcndl:NDLBibID")?.["#text"],
    );

    // NDLBibID がない場合はDBに追加できないのでスキップ
    if (!ndlBibId) {
      console.error(`NDLBibIDがありません: ${item.title}`);
      totalResults--;
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

    const seeAlsoUrls = Array.isArray(item["rdfs:seeAlso"])
      ? item["rdfs:seeAlso"].map((e) => e["@_rdf:resource"])
      : [item["rdfs:seeAlso"]?.["@_rdf:resource"]];

    const jpeCode = getJpeCode(seeAlsoUrls);

    return {
      title,
      link: item.link,
      authors: createAuthors(item["dc:creator"]),
      publishers: createPublishers(item["dc:publisher"]),
      isbn: toStringOrUndefined(isbn),
      ndlBibId,
      jpNo: toStringOrUndefined(jpNo),
      jpeCode,
    };
  });

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
