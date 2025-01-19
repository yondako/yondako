import ImageLogo from "@/assets/images/logo/landscape.svg";
import { site } from "@/constants/site";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export default function MobileHeader(props: ComponentPropsWithoutRef<"div">) {
  const style = "p-8 pb-0 text-center";

  return (
    <div className={twMerge(style, props.className)}>
      <Link className="m-auto block w-fit" href="/">
        <ImageLogo className="w-48" aria-description={site.name} />
      </Link>
    </div>
  );
}
