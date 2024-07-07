import logoUrl from "@/assets/images/logo_landscape.svg";
import { site } from "@/constants/site";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export default function Header(props: ComponentProps<"div">) {
  const style = "p-8 pb-0 text-center";

  return (
    <div className={twMerge(style, props.className)}>
      <a className="block w-fit m-auto" href="/">
        <img width={200} src={logoUrl} alt={site.name} />
      </a>
    </div>
  );
}
