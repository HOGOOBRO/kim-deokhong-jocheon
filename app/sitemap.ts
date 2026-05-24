import type { MetadataRoute } from "next";
import { articlePath, getAllArticles } from "@/app/data/news";

const SITE_URL = "https://deokhong.com";

// 사이트의 고정(최상위) 페이지 — 새 페이지를 만들면 여기에 한 줄만 추가.
const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/news", priority: 0.8 },
];

// 매 빌드(=배포)마다 실행되어 sitemap.xml 을 새로 생성한다.
// 보도자료(app/data/news.ts)가 늘거나 줄면 자동으로 반영된다.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: r.priority,
  }));

  const newsEntries: MetadataRoute.Sitemap = getAllArticles().map((a) => ({
    url: `${SITE_URL}${articlePath(a)}`,
    lastModified: a.date,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...newsEntries];
}
