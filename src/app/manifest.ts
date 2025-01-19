import { site } from "@/constants/site";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} | ${site.description.short}`,
    short_name: site.name,
    description: site.description.long,
    start_url: "/",
    display: "standalone",
    background_color: "#FFFAF6",
    theme_color: "#A17171",
    icons: [
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
