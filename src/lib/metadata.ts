import { site } from "@/constants/site";
import type { Metadata } from "next";

type MetadataOptions = {
  pageTitle?: string;
  noindex?: boolean;
};

export const generateMetadataTitle = ({
  pageTitle,
  noindex = false,
}: MetadataOptions): Metadata => {
  const title = pageTitle
    ? `${pageTitle} | ${site.name}`
    : `${site.name} | ${site.description.short}`;

  return {
    title,
    openGraph: {
      title,
    },
    twitter: {
      title,
    },
    robots: {
      index: !noindex,
    },
  };
};
