import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "기호 5번 김덕홍 — 말보다 실천, 조천을 바꾸겠습니다",
  description:
    "38년 공직 경험, 현장에서 배운 행정으로 조천읍을 확 바꾸겠습니다. 기호 5번 김덕홍 무소속 조천읍 도의원 예비후보.",
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
      <body>{children}</body>
    </html>
  );
}
