import React from "react";
import PolicySections from "./components/PolicySections";
import RecentNews from "./components/RecentNews";
import ScrollHint from "./components/ScrollHint";
import SnapScroll from "./components/SnapScroll";
import EventBottomSheet from "./components/EventBottomSheet";
import SchedulePopup from "./components/SchedulePopup";
import PolicyCarousel from "./components/PolicyCarousel";

const imgHero = "/images/hero.png";
const imgHeroMo = "/images/hero-mo.png";
const imgQuoteMo = "/images/quote2-mo.png";
const imgQuotePc = "/images/quote2-pc.png";
const SNS_LINKS = {
  instagram: "https://www.instagram.com/dukhong4jocheon?igsh=bm1lanYyeXd2OXJs",
  facebook: "https://www.facebook.com/share/18VzrpoQnn/?mibextid=wwXIfr",
};

export default function Home() {
  return (
    <main className="w-full bg-white">
      <SnapScroll />
      <EventBottomSheet />
      <SchedulePopup />
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
            alt="김덕홍 도의원"
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
              말보다 실천 !<br />
              조천읍을 <span className="text-[#fcd100]">확</span> 바꾸겠습니다.
            </p>
          </div>

          {/* Mobile: 직함 라벨 24px + 김덕홍 114px (제주특별자치도 확장에 맞춰 축소) */}
          <div className="md:hidden absolute left-4 bottom-[53px] flex flex-col items-start gap-1">
            <div className="px-[6px]">
              <p
                className="text-[#fcd100] font-bold whitespace-nowrap"
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontSize: "24px",
                  letterSpacing: "-0.02em",
                  lineHeight: "1.25",
                }}
              >
                제주특별자치도 조천읍 도의원
              </p>
            </div>
            <p
              className="text-white font-bold whitespace-nowrap"
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontSize: "min(114px, 30.4vw)",
                letterSpacing: "-0.05em",
                lineHeight: "normal",
              }}
            >
              김덕홍
            </p>
          </div>
          {/* Desktop: 직함 라벨 44px + 김덕홍 210px (제주특별자치도 확장에 맞춰 라벨 축소) */}
          <div className="hidden md:flex flex-col items-start gap-1 lg:gap-[10px] absolute left-4 sm:left-8 lg:left-[60px] bottom-[100px] sm:bottom-[110px] lg:bottom-[120px]">
            <div className="px-1 sm:px-3">
              <p
                className="text-[#fcd100] font-bold whitespace-nowrap"
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontSize: "clamp(24px, 3.06vw, 44px)",
                  letterSpacing: "-0.02em",
                  lineHeight: "1.25",
                }}
              >
                제주특별자치도 조천읍 도의원
              </p>
            </div>
            <p
              className="text-white font-bold whitespace-nowrap"
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontSize: "clamp(64px, 14.58vw, 210px)",
                letterSpacing: "-0.05em",
                lineHeight: "normal",
              }}
            >
              김덕홍
            </p>
          </div>

          {/* Scroll hint at bottom center */}
          <ScrollHint />
        </div>
      </section>

      {/* ── 01.5 Policy carousel (키비주얼 바로 아래) ── */}
      <PolicyCarousel />

      {/* ── 02 Overview (yellow full-bleed bg) ── */}
      <section id="overview" className="bg-[#ffcd00] w-full overflow-hidden">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-8 md:gap-[60px] lg:gap-[180px] items-stretch md:items-center pt-[24px] md:pt-[40px] lg:pt-[56px] pb-8 md:pb-0">
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

          {/* Mobile divider (Figma 205:3261 — within content x:16, w:358) */}
          <div className="md:hidden h-[1px] mx-4 bg-[#1c1c1c]/20" />

          {/* Career timeline */}
          <div className="w-full">
            {/* Desktop divider */}
            <div className="hidden md:block h-[1px] bg-[#1c1c1c]/20 mx-[10px]" />
            {/* Mobile: vertical timeline w/ vertical dividers. Desktop: horizontal row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between px-10 md:px-8 lg:px-[60px] py-0 md:py-[24px] lg:py-[32px] gap-6 md:gap-2 lg:gap-4">
              {[
                { year: "2026", title: "조천읍 제주도의원" },
                { year: "2020", title: "조천읍장" },
                { year: "2018", title: "아라동장" },
                { year: "2012", title: "한라산국립공원 탐방안내소관리팀장" },
                { year: "2009", title: "절물자연휴양림 관리생태소장" },
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
                      className="font-bold text-[32px] lg:text-[40px] leading-[1.25] w-full"
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {item.year}
                    </p>
                  </div>
                  {i < 4 && (
                    <div className="w-px h-[32px] md:h-[60px] lg:h-[71px] bg-[#1c1c1c]/30 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 Quote ── */}
      {/* Mobile (Figma 209:3317): quote + bottom CTA. Desktop (Figma 209:3385): CTA only. */}
      <section
        id="quote"
        className="relative w-full overflow-hidden bg-black h-screen min-h-[640px] md:h-[800px] md:min-h-0"
      >
        {/* Mobile bg + 40% overlay */}
        <img
          src={imgQuoteMo}
          alt=""
          aria-hidden
          className="md:hidden absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="md:hidden absolute inset-0 bg-black/40" />
        {/* Desktop bg at 80% opacity (Figma 209:3386 — image opacity-80, bg-black behind) */}
        <img
          src={imgQuotePc}
          alt=""
          aria-hidden
          className="hidden md:block absolute inset-0 w-full h-full object-cover object-center opacity-80"
        />

        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px]">
          {/* Mobile: quote text top (Figma 209:3319) */}
          <div className="md:hidden absolute left-4 top-[32px] w-[358px] flex flex-col gap-6 text-white">
            <div className="flex flex-col gap-3 font-bold">
              <p
                className="text-[24px]"
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  letterSpacing: "-0.02em",
                  lineHeight: "1.3",
                }}
              >
                &ldquo;같이 일할 땐 힘들었죠&rdquo;
              </p>
              <div
                className="opacity-70 text-[14px]"
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
              className="text-[12px] font-bold"
              style={{
                fontFamily: "Pretendard, sans-serif",
                letterSpacing: "-0.02em",
                lineHeight: "1.5",
              }}
            >
              - 前 제주시 공직 동료
            </p>
          </div>

          {/* Mobile: bottom CTA (Figma 213:3417 — x:49 y:666 w:292 h:130 → 48px from section bottom) */}
          <div className="md:hidden absolute left-1/2 -translate-x-1/2 bottom-[48px] w-[292px] flex flex-col gap-4 items-center">
            <p
              className="text-white font-bold text-[32px] text-center"
              style={{
                fontFamily: "Pretendard, sans-serif",
                letterSpacing: "-0.02em",
                lineHeight: "1.25",
              }}
            >
              덕홍과 읍민이
              <br />
              함께 그리는 조천의 미래
            </p>
            <a
              href="#policies"
              className="bg-white text-[#1c1c1c] text-[12px] font-bold px-3 py-2 rounded-full hover:bg-[#ddd] transition-colors whitespace-nowrap"
              style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.01em" }}
            >
              자세히보기
            </a>
          </div>

          {/* Desktop: centered CTA (Figma 209:3387 — top:50%+161 w:760) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] flex-col gap-6 items-center"
            style={{ top: "calc(50% + 161px)" }}
          >
            <p
              className="text-white font-bold text-center whitespace-nowrap"
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontSize: "clamp(40px, 5vw, 72px)",
                letterSpacing: "-0.02em",
                lineHeight: "1.25",
              }}
            >
              덕홍과 읍민이
              <br />
              함께 그리는 조천의 미래
            </p>
            <a
              href="#policies"
              className="bg-white text-[#1c1c1c] text-[16px] px-6 py-3 rounded-full hover:bg-[#ddd] transition-colors whitespace-nowrap"
              style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.01em" }}
            >
              자세히보기
            </a>
          </div>
        </div>
      </section>

      {/* ── 04 Policy Sections (full-bleed sticky scroll snap) ── */}
      <div id="policies">
        <PolicySections />
      </div>

      {/* ── 05 최근 보도자료 (구 인스타 섹션 자리) ── */}
      <RecentNews />

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
                김덕홍
              </p>
              <p
                className="leading-[1.6]"
                style={{ fontFamily: "Pretendard, sans-serif" }}
              >
                제주특별자치도 조천읍 도의원
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
