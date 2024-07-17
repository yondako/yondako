import imageLogo from "@/assets/images/logo_landscape.svg?url";
import { site } from "@/constants/site";
import Image from "next/image";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export default function MobileHeader(props: ComponentProps<"div">) {
  const style = "p-8 pb-0 text-center";

  return (
    <div className={twMerge(style, props.className)}>
      <a className="m-auto block w-fit" href="/">
        <Image width={200} src={imageLogo} alt={site.name} />
      </a>
    </div>
  );
}
