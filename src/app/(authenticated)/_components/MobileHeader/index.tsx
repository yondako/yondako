import imageLogo from "@/assets/images/logo/landscape.svg?url";
import { site } from "@/constants/site";
import Image from "next/image";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export default function MobileHeader(props: ComponentPropsWithoutRef<"div">) {
  const style = "p-8 pb-0 text-center";

  return (
    <div className={twMerge(style, props.className)}>
      <Link className="m-auto block w-fit" href="/">
        <Image width={200} src={imageLogo} alt={site.name} priority />
        <p className="text-right text-tako text-xs leading-3">ver.beta</p>
      </Link>
    </div>
  );
}
