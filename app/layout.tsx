import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-ETEGPL34NQ";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

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
        url: "/images/hero.png",
        width: 1681,
        height: 936,
        alt: "제주특별자치도 조천읍 도의원 김덕홍",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/hero.png"],
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
      image: `${SITE_URL}/images/hero.png`,
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
    <html lang="ko" className={jetbrainsMono.variable}>
      <head>
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
