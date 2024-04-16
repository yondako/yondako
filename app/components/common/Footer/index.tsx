import { classNames } from "@/libs/classNames";
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
} & JSX.IntrinsicElements["footer"];

export default function Footer({ portrait = false, ...props }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer
      {...props}
      className={classNames(
        "text-xs",
        portrait ? "text-left" : "text-center",
        props.className,
      )}
    >
      <div className={portrait ? "space-y-1" : "space-x-2"}>
        {links.map(({ title, href }) => (
          <Link className={portrait ? "block" : ""} href={href} key={href}>
            {title}
          </Link>
        ))}
      </div>
      <p className="mt-2">© {year} yondako</p>
    </footer>
  );
}
