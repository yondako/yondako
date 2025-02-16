import { site } from "@/constants/site";
import type { Metadata } from "next";

type MetadataOptions = {
  pageTitle: string;
  noindex?: boolean;
};

export const generateMetadataTitle = (options?: MetadataOptions): Metadata => {
  const title = options
    ? `${options.pageTitle} | ${site.name}`
    : `${site.name} | ${site.description.short}`;

  const index = options?.noindex ? !options.noindex : true;

  return {
    title,
    openGraph: {
      title,
    },
    twitter: {
      title,
    },
    robots: {
      index,
    },
  };
};
