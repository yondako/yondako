import { site } from "@/constants/site";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} | ${site.description.short}`,
    short_name: site.name,
    description: site.description.long,
    categories: ["books", "utilities"],
    start_url: "/",
    scope: "/",
    share_target: {
      action: "/api/search/shared-content-receiver/",
      method: "GET",
      params: {
        title: "title",
        text: "text",
      },
    },
    display: "standalone",
    background_color: "#FFFAF6",
    theme_color: "#A17171",
    icons: [
      {
        src: "/images/splash.png",
        sizes: "300x300",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
