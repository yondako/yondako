import type { newsSchema } from "@/app/(framed)/news/_lib/fetchRecentNews";
import { site } from "@/constants/site";
import type { InferInput } from "valibot";
import Tag from "./Tag";

type Props = InferInput<typeof newsSchema.item>;

/**
 * ニュース記事を表示するカードコンポーネント。タイトル、絵文字、タグ、公開日を表示し、クリックで詳細ページへリンクします。
 */
export default function NewsCard({ slug, title, emoji, tags, publishedAt }: Props) {
  const href = new URL(`/news/${slug}`, site.infoUrl).toString();

  return (
    <a
      className="flex items-center space-x-6 rounded-2xl bg-tertiary-background p-8 transition hover:brightness-95"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title}の詳細を見る`}
    >
      <p className="h-fit text-4xl lg:text-5xl">{emoji}</p>

      <div className="w-full">
        <p className="font-bold text-base">{title}</p>
        <div className="mt-2 flex items-center space-x-2 text-xs">
          <div className="flex space-x-1">
            {tags.map((tag) => (
              <Tag key={tag} name={tag} />
            ))}
          </div>
          <span className="text-secondary-foreground">{publishedAt}</span>
        </div>
      </div>
    </a>
  );
}
