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
const SITE_TITLE = "조천읍 도의원 후보 김덕홍 — 말보다 실천, 조천을 바꾸겠습니다";
const SITE_DESCRIPTION =
  "38년 공직 경험, 현장에서 배운 행정으로 조천읍을 확 바꾸겠습니다. 조천읍 도의원 후보 기호 5번 김덕홍(무소속).";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "조천읍 도의원 후보 기호 5번 김덕홍 — 소식" },
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
    siteName: "조천읍 도의원 후보 김덕홍",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/hero.png",
        width: 1681,
        height: 936,
        alt: "조천읍 도의원 후보 기호 5번 김덕홍",
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
      name: "조천읍 도의원 후보 김덕홍",
      inLanguage: "ko-KR",
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "김덕홍",
      jobTitle: "조천읍 도의원 후보",
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
