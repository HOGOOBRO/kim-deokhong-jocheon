import { articlePath, getAllArticles } from "@/app/data/news";

// 매 빌드(=배포)마다 정적 생성 — sitemap.ts 와 동일한 동작.
// 네이버 서치어드바이저 'RSS 제출'용. 보도자료가 늘면 자동 반영된다.
export const dynamic = "force-static";

const SITE_URL = "https://deokhong.com";
const FEED_URL = `${SITE_URL}/feed.xml`;
const MAX_ITEMS = 20; // 최신 소식만 — 네이버가 기대하는 'latest' 피드 형태

// CDATA 안전 처리: 본문에 ']]>' 가 끼어 섹션을 조기 종료하지 못하도록 분할.
function cdata(text: string): string {
  return `<![CDATA[${text.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

export function GET() {
  const articles = getAllArticles().slice(0, MAX_ITEMS); // 발행일 역순
  const lastBuildDate = new Date().toUTCString();

  const items = articles
    .map((a) => {
      const url = `${SITE_URL}${articlePath(a)}`;
      // RFC-822 형식 (ISO 아님). 기사 페이지의 publishedTime 과 동일하게 09:00 KST.
      const pubDate = new Date(`${a.date}T09:00:00+09:00`).toUTCString();
      return `    <item>
      <title>${cdata(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${cdata(a.category)}</category>
      <dc:creator>${cdata(a.source)}</dc:creator>
      <description>${cdata(a.lead)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>조천읍 도의원 후보 기호 5번 김덕홍 — 소식</title>
    <link>${SITE_URL}/news</link>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
    <description>조천읍 도의원 후보 기호 5번 김덕홍(무소속)의 보도자료·언론보도 최신 소식</description>
    <language>ko-KR</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
