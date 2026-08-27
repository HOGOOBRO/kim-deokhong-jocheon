import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-ETEGPL34NQ";

// next/font(JetBrains Mono)는 제거함 — 빌드 시점에 Google Fonts를 받아오는데
// 그 요청이 실패하면 배포 전체가 깨진다(2026-08-12 실제 실패). 현재 화면에서는
// 쓰지 않고 캠페인 컴포넌트에만 var(--font-jetbrains-mono) 참조가 남아 있으며,
// 미정의 시 monospace로 폴백된다. 재사용 시 CDN link 방식으로 되살릴 것.

const SITE_URL = "https://deokhong.com";
const SITE_TITLE = "제주특별자치도 조천읍 도의원 김덕홍 | 현장에서 듣고, 의정으로 답합니다";
const SITE_DESCRIPTION =
  "38년 공직 경험으로 조천의 현장을 직접 살피고, 의정으로 답합니다. 제주특별자치도 조천읍 도의원 김덕홍의 의정활동과 보도 기록.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "제주특별자치도 조천읍 도의원 김덕홍 소식" },
      ],
    },
  },
  verification: {
    other: {
      "naver-site-verification": "62da26393183899f2bb4df957d8a124116c08bbc",
    },
  },
  appleWebApp: {
    capable: true,
    title: "김덕홍",
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "제주특별자치도 조천읍 도의원 김덕홍",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "제주특별자치도 조천읍 도의원 김덕홍",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/og-home.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "제주특별자치도 조천읍 도의원 김덕홍",
      inLanguage: "ko-KR",
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "김덕홍",
      jobTitle: "제주특별자치도 조천읍 도의원",
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      image: `${SITE_URL}/images/og-home.jpg`,
      address: {
        "@type": "PostalAddress",
        addressRegion: "제주특별자치도",
        addressLocality: "제주시 조천읍",
        addressCountry: "KR",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* 첫 화면 제목 세리프는 자가 호스팅 서브셋을 미리 받는다.
            CDN 폰트는 CSS 70KB를 받아 해석한 뒤 폰트 조각을 다시 받는 구조라
            그 사이 제목이 대체 고딕으로 그려졌다가 세리프로 바뀌는 게 보인다.
            글자 파일은 scripts/build-hero-font.sh로 생성. */}
        <link
          rel="preload"
          href="/fonts/noto-serif-kr-hero-600.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        {/* 리뉴얼 홈 타이포 — 한글 세리프(next/font는 한글 서브셋 미제공이라 CDN 사용) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Noto+Serif+KR:wght@500;600;700&display=swap"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>

      {/* Google Analytics 4 (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </html>
  );
}
