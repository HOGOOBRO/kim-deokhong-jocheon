import type { MetadataRoute } from "next";

// 설치형 PWA 매니페스트 — "홈 화면에 추가" 시 앱처럼 standalone 실행.
// Next가 /manifest.webmanifest 로 생성하고 <link rel="manifest"> 를 자동 주입.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "기호 5번 김덕홍 · 조천읍 도의원 후보",
    short_name: "김덕홍",
    description:
      "조천읍 도의원 후보 기호 5번 김덕홍 — 말보다 실천, 조천을 바꾸겠습니다.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#FFCD00",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
