import { links } from "@/constants/site";
import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import ExternalLink from "../ExternalLink";

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
