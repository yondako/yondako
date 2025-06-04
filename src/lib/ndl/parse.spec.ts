import { describe, expect, test } from "bun:test";
import { createDummyBookDetail, createDummyItem, createDummyXml } from "@/_mocks/book";
import { MAX_UPDATE_CHECK_COUNT } from "@/constants/db";
import { isOlderThanHalfYear, parseOpenSearchXml } from "./parse";

test("レスポンスの形式が異なる場合、エラーが投げられる", () => {
  const xml = `<rss version="2.0"></rss>`;

  expect(() => {
    parseOpenSearchXml(xml);
  }).toThrow("レスポンスの形式が異なります");
});

test("検索結果がない場合、空のレスポンスが返る", () => {
  const xml = createDummyXml(0);

  expect(parseOpenSearchXml(xml)).toEqual([]);
});

describe("パースできる", () => {
  test("itemが1つの場合", () => {
    const xml = createDummyXml(1, createDummyItem("000000000"));
    const got = parseOpenSearchXml(xml);

    expect(got).toEqual([createDummyBookDetail("000000000")]);
  });

  test("itemが複数の場合", () => {
    const xml = createDummyXml(
      3,
      [createDummyItem("000000000"), createDummyItem("000000001"), createDummyItem("000000002")].join(""),
    );
    const got = parseOpenSearchXml(xml);

    expect(got).toEqual([
      createDummyBookDetail("000000000"),
      createDummyBookDetail("000000001"),
      createDummyBookDetail("000000002"),
    ]);
  });

  test("identifierが1つの場合", () => {
    const xml = createDummyXml(
      1,
      `
      <item>
        <title>ダミータイトル</title>
        <link>https://example.com/books/dummy-link</link>
        <author>ダミー著者</author>
        <category>ダミーカテゴリ</category>
        <category>ダミーカテゴリ2</category>
        <guid isPermaLink="true">https://example.com/books/dummy-link</guid>
        <pubDate>Tue, 5 Mar 2024 17:39:55 +0900</pubDate>
        <dc:title>ダミータイトル</dc:title>
        <dcndl:titleTranscription>ダミー タイトル</dcndl:titleTranscription>
        <dc:creator>ダミー著者</dc:creator>
        <dcndl:creatorTranscription>ダミー チョシャ</dcndl:creatorTranscription>
        <dcndl:seriesTitle>ダミーシリーズ</dcndl:seriesTitle>
        <dcndl:seriesTitleTranscription>ダミー シリーズ</dcndl:seriesTitleTranscription>
        <dc:publisher>ダミー出版社</dc:publisher>
        <dcndl:publicationPlace>JP</dcndl:publicationPlace>
        <dc:date xsi:type="dcterms:W3CDTF">2024</dc:date>
        <dcterms:issued>2024.1</dcterms:issued>
        <dcndl:price>820円</dcndl:price>
        <dc:extent>128p</dc:extent>
        <dc:identifier xsi:type="dcndl:NDLBibID">000000000</dc:identifier>
        <dcndl:genre>ダミージャンル</dcndl:genre>
        <dcndl:genreTranscription>ダミー ジャンル</dcndl:genreTranscription>
        <dc:subject xsi:type="dcndl:NDLC">Y00</dc:subject>
        <dc:subject xsi:type="dcndl:NDC10">000.0</dc:subject>
        <dc:description>ダミー出版</dc:description>
        <rdfs:seeAlso rdf:resource="https://www.books.or.jp/book-details/000000000A11111111111" />
        <rdfs:seeAlso rdf:resource="https://www.books.or.jp/book-details/978404000000000" />
        <dc:description>2024</dc:description>
      </item>
      `,
    );

    const want = parseOpenSearchXml(xml);

    expect(want).toEqual([
      {
        authors: ["ダミー著者"],
        isbn: undefined,
        jpNo: undefined,
        jpeCode: undefined,
        link: "https://example.com/books/dummy-link",
        ndlBibId: "000000000",
        publishers: ["ダミー出版社"],
        title: "ダミータイトル",
        updateCheckCount: 0,
      },
    ]);
  });
});

test("NDL書誌IDがなくidentifierが無い場合、seeAlsoからISBNを取得する", () => {
  const xml = createDummyXml(
    1,
    `
    <item>
      <title>ダミータイトル</title>
      <link>https://example.com/books/dummy-link</link>
      <author>ダミー著者</author>
      <category>ダミーカテゴリ</category>
      <category>ダミーカテゴリ2</category>
      <guid isPermaLink="true">https://example.com/books/dummy-link</guid>
      <pubDate>Tue, 5 Mar 2024 17:39:55 +0900</pubDate>
      <dc:title>ダミータイトル</dc:title>
      <dc:creator>ダミー著者</dc:creator>
      <dcndl:creatorTranscription>ダミー チョシャ</dcndl:creatorTranscription>
      <rdfs:seeAlso rdf:resource="https://www.books.or.jp/book-details/00000000A11111111111" />
      <rdfs:seeAlso rdf:resource="https://www.books.or.jp/book-details/9784040000000" />
    </item>
      `,
  );

  const want = parseOpenSearchXml(xml);

  expect(want).toEqual([
    {
      authors: ["ダミー著者"],
      isbn: "9784040000000",
      jpNo: undefined,
      jpeCode: "00000000A11111111111",
      link: "https://example.com/books/dummy-link",
      ndlBibId: undefined,
      publishers: undefined,
      title: "ダミータイトル",
      updateCheckCount: 0,
    },
  ]);
});

test("NDL書誌IDとISBNが無いものは除外される", () => {
  const xml = createDummyXml(
    2,
    `
      <item>
        <title>ダミータイトル</title>
        <link>https://example.com/books/dummy-link</link>
        <author>ダミー著者</author>
        <category>ダミーカテゴリ</category>
        <category>ダミーカテゴリ2</category>
        <guid isPermaLink="true">https://example.com/books/dummy-link</guid>
        <pubDate>Tue, 5 Mar 2024 17:39:55 +0900</pubDate>
        <dc:title>ダミータイトル</dc:title>
        <dcndl:titleTranscription>ダミー タイトル</dcndl:titleTranscription>
        <dc:creator>ダミー著者</dc:creator>
        <dcndl:creatorTranscription>ダミー チョシャ</dcndl:creatorTranscription>
        <dcndl:seriesTitle>ダミーシリーズ</dcndl:seriesTitle>
        <dcndl:seriesTitleTranscription>ダミー シリーズ</dcndl:seriesTitleTranscription>
        <dc:publisher>ダミー出版社</dc:publisher>
        <dcndl:publicationPlace>JP</dcndl:publicationPlace>
        <dc:date xsi:type="dcterms:W3CDTF">2024</dc:date>
        <dcterms:issued>2024.1</dcterms:issued>
        <dcndl:price>820円</dcndl:price>
        <dc:extent>128p</dc:extent>
        <dcndl:genre>ダミージャンル</dcndl:genre>
        <dcndl:genreTranscription>ダミー ジャンル</dcndl:genreTranscription>
        <dc:subject xsi:type="dcndl:NDLC">Y00</dc:subject>
        <dc:subject xsi:type="dcndl:NDC10">000.0</dc:subject>
        <dc:description>ダミー出版</dc:description>
        <dc:description>2024</dc:description>
      </item>
      ${createDummyItem("000000000")}
      `,
  );

  const want = parseOpenSearchXml(xml);

  expect(want).toEqual([createDummyBookDetail("000000000")]);
});

test("巻数がある場合はタイトルに含まれる", () => {
  const xml = createDummyXml(
    1,
    `
    <item>
      <title>ダミータイトル</title>
      <link>https://example.com/books/dummy-link</link>
      <author>ダミー著者</author>
      <category>ダミーカテゴリ</category>
      <category>ダミーカテゴリ2</category>
      <guid isPermaLink="true">https://example.com/books/dummy-link</guid>
      <pubDate>Tue, 5 Mar 2024 17:39:55 +0900</pubDate>
      <dc:title>ダミータイトル</dc:title>
      <dcndl:titleTranscription>ダミー タイトル</dcndl:titleTranscription>
      <dcndl:volume>05</dcndl:volume>
      <dc:creator>ダミー著者</dc:creator>
      <dcndl:creatorTranscription>ダミー チョシャ</dcndl:creatorTranscription>
      <dcndl:seriesTitle>ダミーシリーズ</dcndl:seriesTitle>
      <dcndl:seriesTitleTranscription>ダミー シリーズ</dcndl:seriesTitleTranscription>
      <dc:publisher>ダミー出版社</dc:publisher>
      <dcndl:publicationPlace>JP</dcndl:publicationPlace>
      <dc:date xsi:type="dcterms:W3CDTF">2024</dc:date>
      <dcterms:issued>2024.1</dcterms:issued>
      <dcndl:price>820円</dcndl:price>
      <dc:extent>128p</dc:extent>
      <dc:identifier xsi:type="dcndl:ISBN">978-4-04-000000-0</dc:identifier>
      <dc:identifier xsi:type="dcndl:NDLBibID">000000000</dc:identifier>
      <dc:identifier xsi:type="dcndl:JPNO">00000000</dc:identifier>
      <dc:identifier xsi:type="dcndl:TOHANMARCNO">00000000</dc:identifier>
      <dcndl:genre>ダミージャンル</dcndl:genre>
      <dcndl:genreTranscription>ダミー ジャンル</dcndl:genreTranscription>
      <dc:subject xsi:type="dcndl:NDLC">Y00</dc:subject>
      <dc:subject xsi:type="dcndl:NDC10">000.0</dc:subject>
      <dc:description>ダミー出版</dc:description>
      <rdfs:seeAlso rdf:resource="https://www.books.or.jp/book-details/00000000A11111111111" />
      <rdfs:seeAlso rdf:resource="https://www.books.or.jp/book-details/9784040000000" />
      <dc:description>2024</dc:description>
    </item>
      `,
  );

  const want = parseOpenSearchXml(xml);

  expect(want).toEqual([
    {
      authors: ["ダミー著者"],
      isbn: "978-4-04-000000-0",
      jpNo: "00000000",
      jpeCode: "00000000A11111111111",
      link: "https://example.com/books/dummy-link",
      ndlBibId: "000000000",
      publishers: ["ダミー出版社"],
      title: "ダミータイトル (05)",
      updateCheckCount: 0,
    },
  ]);
});

test("totalResultsが500件以上なら丸められる", () => {
  const xml = createDummyXml(1000, createDummyItem("000000000"));

  expect(parseOpenSearchXml(xml)).toEqual([createDummyBookDetail("000000000")]);
});

test("新刊が6ヶ月以上前の場合、updateCheckCountがMAX_UPDATE_CHECK_COUNTになる", () => {
  const xml = `
    <rss>
      <channel>
        <item>
          <title>Old Test Book</title>
          <link>http://example.com/oldbook</link>
          <dc:creator>Old Author</dc:creator>
          <dc:publisher>Old Publisher</dc:publisher>
          <dc:identifier xsi:type="dcndl:ISBN">0987654321</dc:identifier>
          <dc:date xsi:type="dcterms:W3CDTF">2022-01-01</dc:date>
        </item>
        <openSearch:totalResults>1</openSearch:totalResults>
        <openSearch:startIndex>1</openSearch:startIndex>
        <openSearch:itemsPerPage>1</openSearch:itemsPerPage>
      </channel>
    </rss>
  `;

  const result = parseOpenSearchXml(xml);
  expect(result[0].updateCheckCount).toBe(MAX_UPDATE_CHECK_COUNT);
});

describe("isOlderThanHalfYear", () => {
  test("半年以上前の日付ならTrue", () => {
    const oldDate = "2022-01-01";
    expect(isOlderThanHalfYear(oldDate)).toBeTrue();
  });

  test("最近の日付ならfalse", () => {
    const recentDate = new Date();
    recentDate.setMonth(recentDate.getMonth() - 5);
    expect(isOlderThanHalfYear(recentDate.toISOString().split("T")[0])).toBeFalse();
  });

  test("undefinedならfalse", () => {
    expect(isOlderThanHalfYear(undefined)).toBeFalse();
  });
});
