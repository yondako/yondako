import { site } from "@/constants/site";
import type { Metadata } from "next";

export const generateMetadataTitle = (pageTitle?: string): Metadata => {
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
  };
};
