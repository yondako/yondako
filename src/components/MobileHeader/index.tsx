import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import ImageLogo from "#src/assets/images/logo/landscape.svg";
import { site } from "#src/constants/site";

export default function MobileHeader(props: ComponentPropsWithoutRef<"div">) {
  const style = "p-8 pb-0 text-center";

  return (
    <div className={twMerge(style, props.className)}>
      <Link className="m-auto block w-fit" href="/">
        <ImageLogo className="w-48" aria-description={site.name} />
        <p className="text-right text-xs leading-3">ver.beta</p>
      </Link>
    </div>
  );
}
