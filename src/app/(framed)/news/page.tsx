import { generateMetadataTitle } from "@/lib/metadata";
import NewsCard from "./_components/NewsCard";
import UpdateLastNewsCheckedAt from "./_components/UpdateLastNewsCheckedAt";
import { fetchRecentNews } from "./_lib/fetchRecentNews";

export const runtime = "edge";

export const metadata = generateMetadataTitle({
  pageTitle: "お知らせ",
  noindex: true,
});

export default async function News() {
  const recentNews = await fetchRecentNews();

  return (
    <>
      <UpdateLastNewsCheckedAt />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {recentNews.map((news) => (
          <NewsCard key={news.slug} {...news} />
        ))}
      </div>
    </>
  );
}
