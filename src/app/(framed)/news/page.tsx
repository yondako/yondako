import { generateMetadataTitle } from "@/lib/metadata";
import NewsCard from "./_components/NewsCard";
import { fetchRecentNews } from "./_lib/fetchRecentNews";

export const runtime = "edge";

export const metadata = generateMetadataTitle("お知らせ");

export default async function News() {
  const recentNews = await fetchRecentNews();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {recentNews.map((news) => (
        <NewsCard key={news.slug} {...news} />
      ))}
    </div>
  );
}
