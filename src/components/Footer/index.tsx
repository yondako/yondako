import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import ExternalLink from "../ExternalLink";

type LinkItem = {
  title: string;
  href: string;
};

const links: LinkItem[] = [
  {
    title: "データソース",
    href: "https://docs.yondako.com/data-source",
  },
  {
    title: "GitHub",
    href: "https://github.com/yondako/yondako",
  },
  {
    title: "利用規約",
    href: "https://docs.yondako.com/terms",
  },
  {
    title: "プライバシーポリシー",
    href: "https://docs.yondako.com/privacy",
  },
];

export type FooterProps = {
  portrait?: boolean;
  showTermsNotice?: boolean;
} & ComponentPropsWithoutRef<"div">;

export default function Footer({
  portrait = false,
  showTermsNotice = false,
  ...props
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <div {...props} className={twMerge("text-xs", props.className)}>
      {showTermsNotice && (
        <p className="mb-2 text-xs">
          アカウントを登録することにより、
          <ExternalLink className="mx-1" href={links[2].href}>
            {links[2].title}
          </ExternalLink>
          および
          <ExternalLink className="mx-1" href={links[3].href}>
            {links[3].title}
          </ExternalLink>
          に同意したものとみなされます。
        </p>
      )}

      <div className={portrait ? "space-y-1" : "space-x-2"}>
        {links.map(({ title, href }) => {
          if (
            showTermsNotice &&
            (title === "利用規約" || title === "プライバシーポリシー")
          ) {
            return null;
          }

          return (
            <ExternalLink
              className={portrait ? "block" : "inline"}
              href={href}
              key={href}
            >
              {title}
            </ExternalLink>
          );
        })}
      </div>
      <p className={portrait ? "mt-4" : "mt-2"}>© {year} yondako</p>
    </div>
  );
}
