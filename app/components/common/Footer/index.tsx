import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import Link from "../Link";

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
    href: "/",
  },
  {
    title: "プライバシーポリシー",
    href: "/",
  },
];

type Props = {
  portrait?: boolean;
} & ComponentProps<"div">;

export default function Footer({ portrait = false, ...props }: Props) {
  const year = new Date().getFullYear();

  return (
    <div {...props} className={twMerge("text-xs", props.className)}>
      <div className={portrait ? "space-y-1" : "space-x-2"}>
        {links.map(({ title, href }) => (
          <Link
            className={portrait ? "block" : "inline"}
            href={href}
            key={href}
          >
            {title}
          </Link>
        ))}
      </div>
      <p className={portrait ? "mt-4" : "mt-2"}>© {year} yondako</p>
    </div>
  );
}
