import type { Metadata } from "next";
import { articlePath, getAllArticles } from "@/app/data/news";
import { SiteHeader, SiteFooter } from "./Chrome";
import NewsListClient from "./NewsListClient";

const SITE_URL = "https://deokhong.com";

type SP = { page?: string };

function parsePage(sp: SP): number {
  const n = parseInt(String(sp?.page ?? "1"), 10);
  return Number.isFinite(n) && n > 1 ? n : 1;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SP>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const page = parsePage(sp);
  const total = getAllArticles().length;
  const canonical = page > 1 ? `/news?page=${page}` : "/news";
  const title =
    page > 1
      ? `보도자료 (${page}페이지) — 조천읍 도의원 후보 김덕홍`
      : "보도자료 — 조천읍 도의원 후보 김덕홍";
  const description = `조천읍 도의원 무소속 기호 5번 김덕홍 후보 관련 언론보도 및 캠페인 소식 — 총 ${total}건`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url: `${SITE_URL}${canonical}`,
      siteName: "기호 5번 김덕홍",
      title: "보도자료 — 조천읍 도의원 후보 김덕홍",
      description,
      images: [
        {
          url: `${SITE_URL}/images/hero.png`,
          width: 1681,
          height: 936,
          alt: "기호 5번 김덕홍 · 조천읍 도의원 후보",
        },
      ],
    },
  };
}

export default async function NewsListPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const page = parsePage(sp);
  const articles = getAllArticles();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "보도자료",
    url: `${SITE_URL}/news`,
    hasPart: articles.map((a) => ({
      "@type": "NewsArticle",
      headline: a.title,
      url: `${SITE_URL}${articlePath(a)}`,
      datePublished: `${a.date}T09:00:00+09:00`,
    })),
  };

  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <SiteHeader />

      {/* 페이지 타이틀 블록 */}
      <div className="max-w-[1600px] mx-auto px-5 pt-8 pb-7 md:px-[60px] md:pt-20 md:pb-16 border-b border-[#eaeaea]">
        <div className="flex items-center gap-1.5 text-[11px] md:text-[12px] font-bold tracking-[0.02em] text-[#9a9a9a] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400]" />
          기호 5번 김덕홍
        </div>
        <h1 className="m-0 text-[32px] md:text-[64px] font-bold tracking-[-0.045em] leading-[1.05] text-[#1a1a1a]">
          보도자료
        </h1>
        <p className="mt-3 md:mt-4 mb-0 text-[13px] md:text-[15px] font-semibold text-[#5a5a5a] tracking-[-0.01em]">
          김덕홍 후보 관련 언론보도 및 캠페인 소식 — 총{" "}
          <strong className="text-[#1a1a1a] font-bold">{articles.length}건</strong>
        </p>
      </div>

      <div className="pt-7 md:pt-12">
        <NewsListClient articles={articles} initialPage={page} />
      </div>

      <SiteFooter />
    </div>
  );
}
