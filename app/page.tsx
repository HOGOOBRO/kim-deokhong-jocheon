import React from "react";
import PolicySections from "./components/PolicySections";
import PostsCarousel, { Post } from "./components/PostsCarousel";
import ScrollHint from "./components/ScrollHint";
import SnapScroll from "./components/SnapScroll";

const imgHero = "/images/hero.png";
const imgHeroMo = "/images/hero-mo.png";
const imgQuoteBg = "/images/quote-bg.png";
const imgPost1 = "/images/post1.png";
const imgPost2 = "/images/post2.png";
const imgPost3 = "/images/post3.png";
const imgPost4 = "/images/post4.png";
const SNS_LINKS = {
  instagram: "https://www.instagram.com/dukhong4jocheon?igsh=bm1lanYyeXd2OXJs",
  facebook: "https://www.facebook.com/share/18VzrpoQnn/?mibextid=wwXIfr",
};

const posts: Post[] = [
  {
    img: imgPost1,
    imgH: 424,
    category: "기록이 말합니다",
    title: "절물, 전국 1위",
    tags: ["#절물자연휴양림", "#진짜일꾼"],
    url: "https://www.instagram.com/p/DYRldAPkxnM/?igsh=OGxqeHhoNXlhYmI0",
  },
  {
    img: imgPost2,
    imgH: 530,
    category: "아침인사",
    title: "비가 내리는 날에도\n거리에 선 이유",
    tags: ["#말보다실천", "#출근길인사"],
    url: "https://www.instagram.com/p/DYHEe-ak9Tl/?igsh=b2RqaXhnZHEzeTIy",
  },
  {
    img: imgPost3,
    imgH: 424,
    category: "정책 소개",
    title: "김덕홍이 청년에게\n드리는 3가지 약속",
    tags: ["#청년정책", "#조천읍", "#살기좋은조천"],
    url: "https://www.instagram.com/p/DYCMB0Bk9OF/?igsh=MXE4dDMzMHd0czZhYg==",
  },
  {
    img: imgPost4,
    imgH: 530,
    category: "문안인사",
    title: "가정의 달,\n김덕홍의 마음",
    tags: ["#어버이날", "#어린이날", "#가정의달"],
    url: "https://www.instagram.com/p/DX8rG42T5F2/?igsh=cmdqMnBjcm5jMzZn",
  },
];

export default function Home() {
  return (
    <main className="w-full bg-white">
      <SnapScroll />
      {/* ── 01 Hero / Key Visual ── */}
      <section
        id="hero"
        className="relative w-full h-screen min-h-[640px] overflow-hidden bg-black snap-section"
      >
        {/* Image: mobile vs desktop (Figma uses different photos) */}
        <picture>
          <source media="(min-width: 768px)" srcSet={imgHero} />
          <img
            src={imgHeroMo}
            alt="김덕홍 후보"
            className="absolute inset-0 w-full h-full object-cover object-center md:object-[73%_center]"
          />
        </picture>

        {/* Mobile: top gradient (Figma 192:2329 — 266px black/50 fade) */}
        <div className="md:hidden absolute inset-x-0 top-0 h-[266px] bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
        {/* Desktop: left-side gradient */}
        <div className="hidden md:block absolute inset-y-0 left-0 w-[72.5%] bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />

        {/* 1440 content container */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px]">
          {/* Mobile caption — centered 32px (Figma 194:2836) */}
          <div className="md:hidden absolute top-[40px] left-1/2 -translate-x-1/2 w-[min(358px,calc(100%-32px))] text-center">
            <p
              className="text-white font-bold opacity-90"
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontSize: "32px",
                letterSpacing: "-0.02em",
                lineHeight: "1.6",
              }}
            >
              말보다 실천 !<br />
              조천읍을 <span className="text-[#fcd100]">확</span> 바꾸겠습니다.
            </p>
          </div>
          {/* Desktop caption — left-aligned 60px */}
          <div className="hidden md:block absolute left-4 sm:left-8 lg:left-[60px] top-5 sm:top-8 lg:top-[40px] w-[min(648px,90%)]">
            <p
              className="text-white font-bold leading-[1.6] opacity-90"
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontSize: "clamp(24px, 4.17vw, 60px)",
                letterSpacing: "-0.02em",
              }}
            >
              말보다실천 !<br />
              조천읍을 확 바꾸겠습니다.
            </p>
          </div>

          {/* Mobile "5" + 김덕홍 — Figma 192:2322 (left:16, top:631, gap-1, "5":160, 김덕홍:88) */}
          <div className="md:hidden absolute left-4 bottom-[53px] flex items-center gap-1">
            <p
              className="text-[#fcd100] font-bold leading-none"
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontSize: "160px",
                letterSpacing: "-0.05em",
              }}
            >
              5
            </p>
            <div className="flex flex-col gap-1 items-start">
              <div className="px-[6px]">
                <p
                  className="text-white font-bold whitespace-nowrap"
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontSize: "20px",
                    letterSpacing: "-0.02em",
                    lineHeight: "1.25",
                  }}
                >
                  준비된 <span className="text-[#fcd100]">진짜 일꾼</span>, 기호 5번
                </p>
              </div>
              <p
                className="text-white font-bold whitespace-nowrap"
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontSize: "88px",
                  letterSpacing: "-0.05em",
                  lineHeight: "normal",
                }}
              >
                김덕홍
              </p>
            </div>
          </div>
          {/* Desktop "5" + 김덕홍 */}
          <div className="hidden md:flex absolute left-4 sm:left-8 lg:left-[60px] items-center gap-2 lg:gap-[10px] bottom-[100px] sm:bottom-[110px] lg:bottom-[120px]">
            <p
              className="text-[#fcd100] font-bold leading-none"
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontSize: "clamp(80px, 22vw, 320px)",
                letterSpacing: "-0.05em",
              }}
            >
              5
            </p>
            <div className="flex flex-col gap-1 lg:gap-[10px]">
              <div className="px-1 sm:px-3">
                <p
                  className="text-white font-bold whitespace-nowrap"
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontSize: "clamp(14px, 3.3vw, 48px)",
                    letterSpacing: "-0.02em",
                    lineHeight: "1.25",
                  }}
                >
                  준비된 <span className="text-[#fcd100]">진짜 일꾼</span>, 기호 5번
                </p>
              </div>
              <p
                className="text-white font-bold whitespace-nowrap"
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontSize: "clamp(50px, 14vw, 200px)",
                  letterSpacing: "-0.05em",
                  lineHeight: "normal",
                }}
              >
                김덕홍
              </p>
            </div>
          </div>

          {/* Scroll hint at bottom center */}
          <ScrollHint />
        </div>
      </section>

      {/* ── 02 Overview (yellow full-bleed bg) ── */}
      <section id="overview" className="bg-[#ffcd00] w-full overflow-hidden">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-0 md:gap-[60px] lg:gap-[180px] items-stretch md:items-center pt-[32px] md:pt-[100px] lg:pt-[160px] pb-0">
          {/* Text — mobile 24px no-explicit-breaks, desktop 40px with intentional breaks */}
          <div className="px-4 md:px-8 lg:px-0 py-6 md:py-0">
            {/* Mobile: single sentences per paragraph, let browser wrap */}
            <div
              className="md:hidden font-bold text-[#1c1c1c] w-full text-[24px] flex flex-col gap-[1.6em]"
              style={{
                fontFamily: "Pretendard, sans-serif",
                letterSpacing: "-0.02em",
                lineHeight: "1.6",
              }}
            >
              <p>38년 공직 경험, 행정은 책상이 아니라 현장에서 배웠습니다.</p>
              <p>절물자연휴양림, 한라산국립공원, 아라동, 조천읍까지. 주민 가까이에서 듣고, 직접 해결해 왔습니다.</p>
              <p>이제 그 경험을 조천의 변화로 이어가겠습니다.</p>
            </div>
            {/* Desktop: explicit line breaks for visual layout */}
            <p
              className="hidden md:block font-bold text-[#1c1c1c] w-full lg:w-[870px] whitespace-pre-wrap text-[clamp(18px,2.8vw,40px)]"
              style={{
                fontFamily: "Pretendard, sans-serif",
                letterSpacing: "-0.02em",
                lineHeight: "1.6",
              }}
            >
              38년 공직 경험,{"\n"}
              행정은 책상이 아니라 현장에서 배웠습니다.{"\n"}
              {"​"}{"\n"}
              절물자연휴양림, 한라산국립공원, 아라동, 조천읍까지.{"\n"}
              주민 가까이에서 듣고, 직접 해결해 왔습니다.{"\n"}
              {"​"}{"\n"}
              이제 그 경험을 조천의 변화로 이어가겠습니다.
            </p>
          </div>

          {/* Mobile divider full-width */}
          <div className="md:hidden h-[1px] w-full bg-[#1c1c1c]/20" />

          {/* Career timeline */}
          <div className="w-full">
            {/* Desktop divider */}
            <div className="hidden md:block h-[1px] bg-[#1c1c1c]/20 mx-[10px]" />
            {/* Mobile: vertical timeline w/ vertical dividers. Desktop: horizontal row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 md:px-8 lg:px-[60px] py-6 md:py-[24px] lg:py-[32px] gap-6 md:gap-2 lg:gap-4">
              {[
                { year: "2009", title: "절물자연휴양림 관리생태소장" },
                { year: "2012", title: "한라산국립공원 탐방안내소관리팀장" },
                { year: "2018", title: "아라동장" },
                { year: "2022", title: "조천읍장" },
              ].map((item, i) => (
                <React.Fragment key={item.year}>
                  <div className="flex flex-col items-start text-[#1c1c1c] min-w-0">
                    <p
                      className="font-bold leading-[1.5] w-full text-[16px] md:text-[12px] lg:text-[14px]"
                      style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.01em" }}
                    >
                      {item.title}
                    </p>
                    <p
                      className="font-bold text-[40px] md:text-[32px] lg:text-[40px] leading-[1.25] w-full"
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {item.year}
                    </p>
                  </div>
                  {i < 3 && (
                    <div className="w-px h-[71px] md:h-[60px] lg:h-[71px] bg-[#1c1c1c]/30 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 Quote ── */}
      <section
        id="quote"
        className="relative w-full overflow-hidden h-screen min-h-[640px] md:h-[56vw] md:min-h-[480px] md:max-h-[810px]"
      >
        <img
          src={imgQuoteBg}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-[70%_center] md:object-center"
        />
        {/* Mobile: light overlay; Desktop: 40% black overlay */}
        <div className="absolute inset-0 bg-black/[0.04] md:bg-black/40" />
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px]">
          <div className="absolute left-4 md:left-8 lg:left-[60px] top-[32px] md:top-[80px] w-[min(760px,calc(100%-32px))] md:w-[min(760px,90vw)] flex flex-col gap-6 md:gap-6 text-white">
            <div className="flex flex-col gap-3 md:gap-6 font-bold">
              <p
                className="text-[24px] md:text-[clamp(22px,2.8vw,40px)]"
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  letterSpacing: "-0.02em",
                  lineHeight: "1.3",
                }}
              >
                &ldquo;같이 일할 땐 힘들었죠&rdquo;
              </p>
              <div
                className="opacity-70 md:opacity-50 text-[14px] md:text-[clamp(16px,2.2vw,32px)]"
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  letterSpacing: "-0.02em",
                  lineHeight: "1.6",
                }}
              >
                <p>적당히 넘어가는 걸 못 봤습니다.</p>
                <p>현장은 직접 봐야 했고, 주민 이야기도 끝까지 들어야 했습니다.</p>
                <p>그래도, 결과는 늘 만들어내던 사람이었어요.</p>
              </div>
            </div>
            <p
              className="text-[12px] md:text-[clamp(14px,1.25vw,18px)]"
              style={{
                fontFamily: "Pretendard, sans-serif",
                letterSpacing: "-0.02em",
                lineHeight: "1.5",
              }}
            >
              ○○○ 前 제주시 공직 동료
            </p>
          </div>
        </div>
      </section>

      {/* ── 04 Policy Sections (full-bleed sticky scroll snap) ── */}
      <div id="policies">
        <PolicySections />
      </div>

      {/* ── 05 Posts Carousel ── */}
      <div id="posts">
        <PostsCarousel posts={posts} />
      </div>

      {/* ── 06 Footer (full-bleed bg) ── */}
      <footer id="footer" className="bg-[#f7f7f7] w-full">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start justify-between px-4 sm:px-8 lg:px-[60px] py-[60px] lg:py-[80px] gap-8 sm:gap-4">
          <div className="flex flex-col gap-[12px] lg:gap-[15px] text-[#1c1c1c] w-full sm:w-auto lg:w-[764px]">
            <p
              className="text-[14px] lg:text-[16px] leading-[1.6]"
              style={{ fontFamily: "Pretendard, sans-serif" }}
            >
              말보다 실천으로,<br />
              조천읍의 변화를 만들겠습니다.
            </p>
            <div className="flex flex-wrap gap-2 items-center text-[14px] lg:text-[16px]">
              <p
                className="font-bold leading-[2.4]"
                style={{ fontFamily: "Pretendard, sans-serif" }}
              >
                기호 5번 김덕홍
              </p>
              <p
                className="leading-[1.6]"
                style={{ fontFamily: "Pretendard, sans-serif" }}
              >
                무소속 조천읍 도의원 예비후보
              </p>
            </div>
            <p
              className="text-[12px] lg:text-[14px] leading-[1.6]"
              style={{ fontFamily: "Pretendard, sans-serif" }}
            >
              © 2026 김덕홍 선거사무소.<br />
              All rights reserved.
            </p>
          </div>

          {/* Social icons — IG + FB only */}
          <div className="flex gap-4 items-start">
            <a
              href={SNS_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="인스타그램으로 이동"
              className="bg-[#555] rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#333] transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href={SNS_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="페이스북으로 이동"
              className="bg-[#555] rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#333] transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="white"
                aria-hidden="true"
              >
                <path d="M13.5 21v-7.5h2.55l.38-2.95H13.5V8.7c0-.85.24-1.43 1.45-1.43h1.55V4.63c-.27-.04-1.19-.12-2.27-.12-2.24 0-3.78 1.37-3.78 3.88v2.16H7.9v2.95h2.55V21h3.05z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
