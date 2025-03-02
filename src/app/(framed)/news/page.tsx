import { PATH_NEWS } from "@/constants/path";
import { getAuth } from "@/lib/auth";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/path";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import NewsCard from "./_components/NewsCard";
import UpdateLastNewsCheckedAt from "./_components/UpdateLastNewsCheckedAt";
import { fetchRecentNews } from "./_lib/fetchRecentNews";

export const metadata = generateMetadataTitle({
  pageTitle: "お知らせ",
  noindex: true,
});

export default async function News() {
  const { env } = await getCloudflareContext({
    async: true,
  });

  const auth = getAuth(env.DB);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect(createSignInPath(PATH_NEWS));
  }
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
