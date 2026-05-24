import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import {
  articlePath,
  getAllArticles,
  getArticleById,
  parseNewsParam,
  type Article,
  type ArticleBlock,
} from "@/app/data/news";
import { SiteHeader, SiteFooter } from "@/app/news/Chrome";
import ShareRow from "./ShareRow";

const SITE_URL = "https://deokhong.com";
// 키비주얼 없는 자료의 OG 폴백 이미지 (홈 히어로 재사용)
const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/images/hero.png`,
  width: 1681,
  height: 936,
  alt: "기호 5번 김덕홍 · 조천읍 도의원 후보",
};

type Params = { slug: string };

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: `${a.id}-${a.slug}` }));
}

function resolveArticle(slug: string): Article | undefined {
  const parsed = parseNewsParam(slug);
  return parsed ? getArticleById(parsed.id) : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = resolveArticle(slug);
  if (!article) return { title: "보도자료를 찾을 수 없습니다 | 조천읍 도의원 후보 김덕홍" };

  const path = articlePath(article);
  const url = `${SITE_URL}${path}`;
  const ogImage = article.heroPc
    ? {
        url: `${SITE_URL}${article.heroPc}`,
        width: 2160,
        height: 1080,
        alt: article.heroAlt,
      }
    : DEFAULT_OG_IMAGE;

  return {
    title: `${article.title} | 조천읍 도의원 후보 김덕홍`,
    description: article.lead,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      locale: "ko_KR",
      url,
      siteName: "기호 5번 김덕홍",
      title: article.title,
      description: article.lead,
      publishedTime: `${article.date}T09:00:00+09:00`,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.lead,
      images: [ogImage.url],
    },
  };
}

function dateLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

function ArticleBodyBlocks({ body }: { body: ArticleBlock[] }) {
  return (
    <div className="text-[#1a1a1a] break-keep [overflow-wrap:break-word]">
      {body.map((b, i) => {
        if (b.type === "p") {
          return (
            <p
              key={i}
              className="mb-[18px] text-[16px] md:text-[18px] leading-[1.75] text-[#2a2a2a] tracking-[-0.015em]"
            >
              {b.text}
            </p>
          );
        }
        if (b.type === "h2") {
          return (
            <h2
              key={i}
              className="mt-8 mb-3.5 md:mt-10 md:mb-4 text-[20px] md:text-[24px] font-bold text-[#1a1a1a] tracking-[-0.03em] leading-[1.3] text-balance"
            >
              {b.text}
            </h2>
          );
        }
        if (b.type === "list") {
          return (
            <ul key={i} className="my-[18px] flex flex-col gap-2.5">
              {b.items.map((it, j) => (
                <li
                  key={j}
                  className="relative pl-5 text-[16px] md:text-[18px] leading-[1.6] text-[#2a2a2a] tracking-[-0.015em]"
                >
                  <span className="absolute left-0 top-[0.62em] w-1.5 h-1.5 rounded-full bg-[#FFD400]" />
                  {it}
                </li>
              ))}
            </ul>
          );
        }
        // quote
        return (
          <blockquote
            key={i}
            className="my-6 md:my-8 px-[22px] py-5 md:px-7 md:py-[26px] bg-[#fffbe5] border-l-4 border-[#FFD400] rounded-[4px_10px_10px_4px]"
          >
            <div className="text-[17px] md:text-[20px] leading-[1.55] font-bold text-[#1a1a1a] tracking-[-0.02em] text-balance">
              “{b.text}”
            </div>
            <div className="mt-2.5 text-[12px] md:text-[13px] font-bold text-[#5a5a5a] tracking-[-0.01em]">
              — {b.cite}
            </div>
          </blockquote>
        );
      })}
    </div>
  );
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const parsed = parseNewsParam(slug);
  if (!parsed) notFound();
  const article = getArticleById(parsed.id);
  if (!article) notFound();

  // 슬러그 불일치(또는 id만) → 카논 URL로 301(308 영구)
  const canonicalParam = `${article.id}-${article.slug}`;
  if (slug !== canonicalParam) permanentRedirect(articlePath(article));

  const path = articlePath(article);
  const shareUrl = `${SITE_URL}${path}`;
  const shareImage = article.heroPc
    ? `${SITE_URL}${article.heroPc}`
    : DEFAULT_OG_IMAGE.url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        headline: article.title,
        datePublished: `${article.date}T09:00:00+09:00`,
        dateModified: `${article.date}T09:00:00+09:00`,
        author: { "@type": "Organization", name: "김덕홍 캠페인" },
        publisher: {
          "@type": "Organization",
          name: "기호 5번 김덕홍",
          logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` },
        },
        image: shareImage,
        description: article.lead,
        mainEntityOfPage: { "@type": "WebPage", "@id": shareUrl },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "소식", item: `${SITE_URL}/news` },
          { "@type": "ListItem", position: 2, name: article.category, item: shareUrl },
        ],
      },
    ],
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

      {/* ── Variation A — 풀블리드 히어로 + 타이틀 오버레이 ── */}
      <div className="relative w-full h-[360px] md:h-[560px] bg-[#2a2a2a] overflow-hidden">
        {article.hasHero && article.heroPc ? (
          <>
            <img
              src={article.heroMo ?? article.heroPc}
              alt={article.heroAlt}
              width={1170}
              height={720}
              className="md:hidden absolute inset-0 w-full h-full object-cover object-center"
            />
            <img
              src={article.heroPc}
              alt={article.heroAlt}
              width={2160}
              height={1080}
              className="hidden md:block absolute inset-0 w-full h-full object-cover object-top"
            />
          </>
        ) : null}

        {/* 가독성용 그라데이션 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.85) 100%)",
          }}
        />

        {/* 타이틀 블록 (하단) */}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-[26px] md:px-8 md:pb-11">
          <div className="max-w-[1000px] mx-auto">
            <span className="inline-flex items-center bg-[#FFD400] text-[#1a1a1a] rounded-[4px] px-2.5 py-[5px] md:px-3 md:py-1.5 text-[11px] md:text-[12px] font-bold tracking-[-0.01em]">
              {article.category}
            </span>
            <h1 className="mt-3.5 mb-3.5 md:mt-5 md:mb-5 text-white text-[26px] md:text-[44px] font-bold leading-[1.2] tracking-[-0.035em] text-balance break-keep">
              {article.title}
            </h1>
            <div className="flex items-center gap-2 md:gap-3.5 text-[12px] md:text-[14px] font-bold text-white/85 tracking-[-0.01em] flex-wrap">
              <time dateTime={article.date}>{dateLong(article.date)}</time>
              <span className="text-white/35">·</span>
              <span>{article.source}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <article className="max-w-[720px] mx-auto px-5 pt-8 md:px-6 md:pt-14">
        <div className="mb-6 md:mb-8 flex items-center gap-1.5 text-[12px] md:text-[13px] font-semibold tracking-[-0.01em] text-[#9a9a9a]">
          <Link
            href="/news"
            className="no-underline text-[#9a9a9a] [@media(hover:hover)]:hover:text-[#1a1a1a]"
          >
            소식
          </Link>
          <span className="text-[#d0d0d0]">/</span>
          <span className="text-[#1a1a1a]">{article.category}</span>
        </div>

        {/* 리드 */}
        <p className="m-0 text-[18px] md:text-[21px] font-bold text-[#1a1a1a] leading-[1.55] tracking-[-0.02em] text-balance break-keep mb-7 pb-6 md:mb-10 md:pb-8 border-b border-[#eaeaea]">
          {article.lead}
        </p>

        <ArticleBodyBlocks body={article.body} />

        {/* 원문 출처 콜아웃 */}
        {article.sourceUrl ? (
          <div className="mt-7 md:mt-9 px-[18px] py-4 md:px-[22px] md:py-[18px] border border-[#eaeaea] rounded-xl flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="text-[11px] md:text-[12px] font-bold tracking-[0.14em] text-[#9a9a9a] mb-1">
                원문 출처
              </div>
              <div className="text-[14px] md:text-[15px] font-bold text-[#1a1a1a] tracking-[-0.01em]">
                {article.source}
              </div>
            </div>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#1a1a1a] text-white px-3.5 py-2 md:px-[18px] md:py-2.5 rounded-lg text-[12px] md:text-[13px] font-bold tracking-[-0.01em] no-underline [@media(hover:hover)]:hover:opacity-90"
            >
              원문 보기
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                <path
                  d="M3 3h6v6M3 9l6-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </a>
          </div>
        ) : null}

        {/* 공유 */}
        <div className="mt-7 md:mt-10">
          <ShareRow
            url={shareUrl}
            title={article.title}
            description={article.lead}
            image={shareImage}
          />
        </div>

        {/* 목록으로 */}
        <div className="mt-9 md:mt-12 pt-7 md:pt-9 border-t border-[#eaeaea]">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-[14px] md:text-[15px] font-bold text-[#1a1a1a] no-underline [@media(hover:hover)]:hover:opacity-70"
          >
            ← 보도자료 목록 전체보기
          </Link>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
