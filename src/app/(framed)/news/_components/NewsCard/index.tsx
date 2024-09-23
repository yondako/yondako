import { site } from "@/constants/site";
import type { InferInput } from "valibot";
import type { newsSchema } from "../../_lib/fetchRecentNews";
import Tag from "./Tag";

type Props = InferInput<typeof newsSchema.item>;

export default function NewsCard({
  slug,
  title,
  emoji,
  tags,
  publishedAt,
}: Props) {
  const href = new URL(`/news/${slug}`, site.infoUrl).toString();

  return (
    <a
      className="block space-y-3 rounded-2xl bg-tertiary-background p-6 transition hover:brightness-95 md:space-y-4 md:p-8"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <p className="text-4xl md:text-5xl">{emoji}</p>
      <p className="font-bold text-base md:text-lg">{title}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-secondary-foreground">{publishedAt}</span>
        <div className="flex space-x-1">
          {tags.map((tag) => (
            <Tag key={tag} name={tag} />
          ))}
        </div>
      </div>
    </a>
  );
}
