import type { BookDetail } from "@/types/book";

export const createDummyItem = (id: string) => `
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

export const createTestXml = (total: number, children = "") => {
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

export const createWantBookDetail = (id: string): BookDetail => {
  return {
    authors: ["ダミー著者"],
    isbn: "978-4-04-000000-0",
    jpNo: "00000000",
    link: "https://example.com/books/dummy-link",
    ndlBibId: id,
    publishers: ["ダミー出版社"],
    title: `ダミータイトル ${id}`,
  };
};
