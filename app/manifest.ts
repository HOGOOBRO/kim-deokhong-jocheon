import type { MetadataRoute } from "next";

// 설치형 PWA 매니페스트 — "홈 화면에 추가" 시 앱처럼 standalone 실행.
// Next가 /manifest.webmanifest 로 생성하고 <link rel="manifest"> 를 자동 주입.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "김덕홍 · 조천읍 도의원",
    short_name: "김덕홍",
    description:
      "조천읍 도의원 김덕홍 — 말보다 실천, 조천을 바꾸겠습니다.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#FFCD00",
    // maskable 엔트리: 풀블리드(여백 없는) 아이콘이라 런처가 흰 원형으로 감싸지 않고
    // 자체 마스크(둥근네모/원)로 잘라 쓴다 — "네모 안 흰 동그라미" 방지.
    // any 엔트리도 같이 둬서 마스크 미지원 환경 폴백.
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
