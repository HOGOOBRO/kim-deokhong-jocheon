import type { MetadataRoute } from "next";
import { getAllArticles, articlePath } from "@/app/data/news";

const SITE_URL = "https://deokhong.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const news = getAllArticles().map((a) => ({
    url: `${SITE_URL}${articlePath(a)}`,
    lastModified: a.date,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...news,
  ];
}
