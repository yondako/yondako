import { describe, expect, test } from "bun:test";
import type { BookDetail } from "@/types/book";
import { parseOpenSearchXml } from ".";

const createDummyItem = (id: string) => `
<item>
  <title>ダミータイトル ${id}</title>
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
  <dc:identifier xsi:type="dcndl:ISBN">978-4-04-000000-0</dc:identifier>
  <dc:identifier xsi:type="dcndl:NDLBibID">${id}</dc:identifier>
  <dc:identifier xsi:type="dcndl:JPNO">00000000</dc:identifier>
  <dc:identifier xsi:type="dcndl:TOHANMARCNO">00000000</dc:identifier>
  <dcndl:genre>ダミージャンル</dcndl:genre>
  <dcndl:genreTranscription>ダミー ジャンル</dcndl:genreTranscription>
  <dc:subject xsi:type="dcndl:NDLC">Y00</dc:subject>
  <dc:subject xsi:type="dcndl:NDC10">000.0</dc:subject>
  <dc:description>ダミー出版</dc:description>
  <rdfs:seeAlso rdf:resource="https://example.com/books/dummy-link"/>
  <rdfs:seeAlso rdf:resource="https://example.com/books/dummy-link2"/>
  <rdfs:seeAlso rdf:resource="https://example.com/books/dummy-link3"/>
  <dc:description>2024</dc:description>
</item>
`;

const createTestXml = (total: number, children = "") => {
  return `
  <rss version="2.0">
    <channel>
      <title>テスト</title>
      <link>https://example.com</link>
      <description>説明文</description>
      <language>ja</language>
      <openSearch:totalResults>${total}</openSearch:totalResults>
      <openSearch:startIndex>1</openSearch:startIndex>
      <openSearch:itemsPerPage>10</openSearch:itemsPerPage>
      ${children.trim()}
    </channel>
  </rss>
  `;
};

const createWantBookDetail = (id: string): BookDetail => {
  return {
    authors: ["ダミー著者"],
    isbn: "978-4-04-000000-0",
    jpNo: "00000000",
    link: "https://example.com/books/dummy-link",
    ndlBibId: id,
    publishers: ["ダミー出版社"],
    thumbnailUrl: "https://ndlsearch.ndl.go.jp/thumbnail/9784040000000.jpg",
    title: `ダミータイトル ${id}`,
  };
};

test("レスポンスの形式が異なる場合、エラーが投げられる", () => {
  const xml = `<rss version="2.0"></rss>`;

  expect(() => {
    parseOpenSearchXml(xml);
  }).toThrow("レスポンスの形式が異なります");
});

test("検索結果がない場合、空のレスポンスが返る", () => {
  const xml = createTestXml(0);

  expect(parseOpenSearchXml(xml)).toEqual({
    meta: {
      totalResults: 0,
      startIndex: 0,
      itemsPerPage: 0,
    },
    books: [],
  });
});

describe("パースできる", () => {
  test("itemが1つの場合", () => {
    const xml = createTestXml(1, createDummyItem("000000000"));
    const got = parseOpenSearchXml(xml);

    expect(got).toEqual({
      meta: {
        totalResults: 1,
        startIndex: 1,
        itemsPerPage: 10,
      },
      books: [createWantBookDetail("000000000")],
    });
  });

  test("itemが複数の場合", () => {
    const xml = createTestXml(
      3,
      [
        createDummyItem("000000000"),
        createDummyItem("000000001"),
        createDummyItem("000000002"),
      ].join(""),
    );
    const got = parseOpenSearchXml(xml);

    expect(got).toEqual({
      meta: {
        totalResults: 3,
        startIndex: 1,
        itemsPerPage: 10,
      },
      books: [
        createWantBookDetail("000000000"),
        createWantBookDetail("000000001"),
        createWantBookDetail("000000002"),
      ],
    });
  });

  test("identifierが1つの場合", () => {
    const xml = createTestXml(
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
        <rdfs:seeAlso rdf:resource="https://example.com/books/dummy-link"/>
        <rdfs:seeAlso rdf:resource="https://example.com/books/dummy-link2"/>
        <rdfs:seeAlso rdf:resource="https://example.com/books/dummy-link3"/>
        <dc:description>2024</dc:description>
      </item>
      `,
    );

    const want = parseOpenSearchXml(xml);

    expect(want).toEqual({
      meta: {
        totalResults: 1,
        startIndex: 1,
        itemsPerPage: 10,
      },
      books: [
        {
          ...createWantBookDetail("000000000"),
          title: "ダミータイトル",
          thumbnailUrl: undefined,
          isbn: undefined,
          jpNo: undefined,
        },
      ],
    });
  });
});

test("NDLBibIDが無いものは除外される", () => {
  const xml = createTestXml(
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
        <rdfs:seeAlso rdf:resource="https://example.com/books/dummy-link"/>
        <rdfs:seeAlso rdf:resource="https://example.com/books/dummy-link2"/>
        <rdfs:seeAlso rdf:resource="https://example.com/books/dummy-link3"/>
        <dc:description>2024</dc:description>
      </item>
      ${createDummyItem("000000000")}
      `,
  );

  const want = parseOpenSearchXml(xml);

  expect(want).toEqual({
    meta: {
      totalResults: 1,
      startIndex: 1,
      itemsPerPage: 10,
    },
    books: [createWantBookDetail("000000000")],
  });
});

test("巻数がある場合はタイトルに含まれる", () => {
  const xml = createTestXml(
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
      <rdfs:seeAlso rdf:resource="https://example.com/books/dummy-link"/>
      <rdfs:seeAlso rdf:resource="https://example.com/books/dummy-link2"/>
      <rdfs:seeAlso rdf:resource="https://example.com/books/dummy-link3"/>
      <dc:description>2024</dc:description>
    </item>
      `,
  );

  const want = parseOpenSearchXml(xml);

  expect(want).toEqual({
    meta: {
      totalResults: 1,
      startIndex: 1,
      itemsPerPage: 10,
    },
    books: [
      {
        ...createWantBookDetail("000000000"),
        title: "ダミータイトル (05)"
      }
    ],
  });
});

test("totalResultsが500件以上なら丸められる", () => {
  const xml = createTestXml(1000, createDummyItem("000000000"));

  expect(parseOpenSearchXml(xml)).toEqual({
    meta: {
      totalResults: 500,
      startIndex: 1,
      itemsPerPage: 10,
    },
    books: [
      createWantBookDetail("000000000")
    ],
  });
  
})
