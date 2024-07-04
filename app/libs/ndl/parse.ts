import { THUMBNAIL_API_BASE_URL } from "@/constants/api";
import { BookInfo } from "@/types/book";
import { AnyNode } from "domhandler";
import { getElementsByTagName, textContent } from "domutils";
import * as htmlparser2 from "htmlparser2";

const getValue = (tagName: string, node: AnyNode | AnyNode[]) => {
  const elements = getElementsByTagName(tagName, node, false, 1);

  return textContent(elements).trim();
};

const getValues = (tagName: string, node: AnyNode | AnyNode[]) => {
  const elements = getElementsByTagName(tagName, node, false);

  if (elements.length === 0) {
    return undefined;
  }

  const values = elements.map((e) => textContent(e).trim());

  return [...new Set(values)];
};

const getValueByAttr = (
  tagName: string,
  attrName: string,
  attrValue: string,
  node: AnyNode | AnyNode[],
) => {
  const elements = getElementsByTagName(tagName, node, false);

  for (const elm of elements) {
    if (elm.attribs[attrName] === attrValue) {
      return textContent(elm).trim();
    }
  }

  return undefined;
};

/**
 * 書影画像のURLを作成
 * @param id JP-eコードもしくはISBN-13
 * @return URL
 */
const createThumbnailUrl = (id: string | undefined) => {
  return id
    ? `${THUMBNAIL_API_BASE_URL}/${id.replace(/-/g, "")}.jpg`
    : undefined;
};

/**
 * 著者名の配列を作成
 * @param authors 著者名の配列
 * @return 著者名の配列
 */
const createAuthors = (authors: string[] | undefined) => {
  if (!authors) {
    return;
  }

  const results = authors
    .map((author) =>
      author
        // yyyy-yyyy, pub., (YYYY年) を消す
        .replace(/(, \d{4}-(\d{0,4})?|pub. \d{4}|\(\d{4}年\))/, "")
        // 苗字と名前を区切っているカンマを消す
        .replace(", ", " ")
        .trim(),
    )
    .filter((author) => author !== "");

  return results;
};

/**
 * NDL API (OpenSearch) のレスポンスをパース
 * @param xml レスポンス (RSS)
 * @returns Bookオブジェクトの配列
 */
export const parseOpenSearchResponse = (xml: string) => {
  // NOTE: 自己完結タグがあるとうまくパースできないので除く
  const replacedXml = xml.replace(/<\S+\/>/g, "");

  const dom = htmlparser2.parseDocument(replacedXml);
  let results: BookInfo[] = [];

  for (const childNode of dom.childNodes) {
    const items = getElementsByTagName("item", childNode).map(
      (item): BookInfo | undefined => {
        const { children } = item;

        const ndlBibId = getValueByAttr(
          "dc:identifier",
          "xsi:type",
          "dcndl:NDLBibID",
          children,
        );

        // NDLBibIDがないものは除外
        if (!ndlBibId) {
          return;
        }

        let title = getValue("title", children);

        // 巻数があればタイトルに追加
        const vol = getValue("dcndl:volume", children);
        if (vol) {
          title = `${title} (${vol})`;
        }

        const isbn = getValueByAttr(
          "dc:identifier",
          "xsi:type",
          "dcndl:ISBN",
          children,
        );

        return {
          title,
          link: getValue("guid", children),
          authors: createAuthors(getValues("dc:creator", children)),
          publishers: getValues("dc:publisher", children),
          isbn,
          ndlBibId,
          jpNo: getValueByAttr(
            "dc:identifier",
            "xsi:type",
            "dcndl:JPNO",
            children,
          ),
          thumbnailUrl: createThumbnailUrl(isbn),
        };
      },
    );

    results = results.concat(
      items.filter((item): item is BookInfo => typeof item !== "undefined"),
    );
  }

  return results;
};
