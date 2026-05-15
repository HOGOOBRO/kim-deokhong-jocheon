"use client";
import { useEffect, useRef, useState } from "react";

const imgPolicy1 = "/images/policy1.png";
const imgPolicy2 = "/images/policy2.png";
const imgPolicy2Mo = "/images/policy2-mo.png";
const imgPolicy3 = "/images/policy3.png";
const imgPolicy3Mo = "/images/policy3-mo.png";
const imgPolicy4 = "/images/policy4.jpg";
const imgPolicy4Mo = "/images/policy4-mo.png";

type IconKey = "policy1" | "policy2" | "policy3";

const ICONS: Record<
  IconKey,
  { src: string; bg: string; inset: string }
> = {
  policy1: {
    src: "/icons/icon-policy1.svg",
    bg: "bg-[#16a34a]",
    inset: "7.5% 23.87% -62.26% -10.56%",
  },
  policy2: {
    src: "/icons/icon-policy2.svg",
    bg: "bg-[#d97706]",
    inset: "-26.94% 12.56% -14.58% 10.53%",
  },
  policy3: {
    src: "/icons/icon-policy3.svg",
    bg: "bg-[#2563eb]",
    inset: "-43.75% 12.54% -30.5% 1.27%",
  },
};

function PolicyIcon({ icon }: { icon: IconKey }) {
  const cfg = ICONS[icon];
  return (
    <div
      className={`${cfg.bg} h-[34px] w-[60px] md:h-[68px] md:w-[120px] lg:h-[80px] lg:w-[142px] rounded-[5px] md:rounded-[10px] lg:rounded-[12px] overflow-hidden shrink-0 relative`}
    >
      <div className="absolute" style={{ inset: cfg.inset }}>
        <img
          src={cfg.src}
          alt=""
          aria-hidden
          className="block w-full h-full"
          style={{ maxWidth: "none" }}
        />
      </div>
    </div>
  );
}

function Section01() {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-1/2 md:left-4 lg:left-[60px] -translate-x-1/2 md:translate-x-0 w-[358px] md:w-[min(568px,85%)] flex flex-col gap-1 items-start">
      <p
        className="text-white font-bold text-[12px] md:text-[20px] lg:text-[24px] leading-[1.5]"
        style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.02em" }}
      >
        교통, 생활 인프라
      </p>
      <div className="flex gap-[7.56px] md:gap-2 lg:gap-3 items-center flex-wrap">
        <p
          className="text-white font-semibold text-[32px] md:text-[44px] lg:text-[52px] leading-[1.25] whitespace-nowrap"
          style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.02em" }}
        >
          생활문제를
        </p>
        <PolicyIcon icon="policy1" />
        <p
          className="text-white font-semibold text-[32px] md:text-[44px] lg:text-[52px] leading-[1.25] whitespace-nowrap"
          style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.02em" }}
        >
          해결하는
        </p>
      </div>
      <p
        className="text-white font-semibold text-[32px] md:text-[44px] lg:text-[52px] leading-[1.25]"
        style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.02em" }}
      >
        세심한 시선
      </p>
    </div>
  );
}

function Section02() {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-1/2 md:left-auto md:right-4 lg:right-[60px] -translate-x-1/2 md:translate-x-0 w-[358px] md:w-[min(502px,85%)] flex flex-col gap-1 items-end">
      <p
        className="text-white font-bold text-[12px] md:text-[20px] lg:text-[24px] leading-[1.5] text-right"
        style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.02em" }}
      >
        환경, 곶자왈 보전
      </p>
      <div className="flex gap-[7.56px] md:gap-2 lg:gap-3 items-center flex-wrap justify-end">
        <p
          className="text-white font-semibold text-[32px] md:text-[44px] lg:text-[52px] leading-[1.25] whitespace-nowrap"
          style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.02em" }}
        >
          다음
        </p>
        <PolicyIcon icon="policy2" />
        <p
          className="text-white font-semibold text-[32px] md:text-[44px] lg:text-[52px] leading-[1.25] whitespace-nowrap"
          style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.02em" }}
        >
          세대에게
        </p>
      </div>
      <p
        className="text-white font-semibold text-[32px] md:text-[44px] lg:text-[52px] leading-[1.25] text-right"
        style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.02em" }}
      >
        물려줄 조천의 숨결
      </p>
    </div>
  );
}

function Section03() {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[358px] md:w-[min(498px,85%)] flex flex-col gap-1 md:gap-2 items-center">
      <p
        className="text-white font-bold text-[12px] md:text-[20px] lg:text-[24px] leading-[1.5] text-center"
        style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.02em" }}
      >
        돌봄, 복지
      </p>
      <div className="flex gap-[7.56px] md:gap-2 lg:gap-3 items-center flex-wrap justify-center">
        <p
          className="text-white font-semibold text-[32px] md:text-[40px] lg:text-[52px] leading-[1.25] whitespace-nowrap"
          style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.02em" }}
        >
          어르신의 하루부터
        </p>
        <PolicyIcon icon="policy3" />
      </div>
      <p
        className="text-white font-semibold text-[32px] md:text-[40px] lg:text-[52px] leading-[1.25] text-center"
        style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.02em" }}
      >
        아이의 내일까지
      </p>
    </div>
  );
}

function Section04() {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[358px] md:w-[min(754px,85%)] flex flex-col gap-1 md:gap-2 items-center text-center">
      <p
        className="text-white font-bold text-[12px] md:text-[20px] lg:text-[24px] leading-[1.5]"
        style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.02em" }}
      >
        민생, 경제
      </p>
      <div className="flex gap-3 lg:gap-[18px] items-center justify-center flex-wrap whitespace-nowrap">
        <p
          className="text-white font-semibold text-[32px] md:text-[44px] lg:text-[56px] leading-[1.25]"
          style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.02em" }}
        >
          떠나는 조천이
        </p>
        <p
          className="text-white font-semibold text-[32px] md:text-[44px] lg:text-[56px] leading-[1.25]"
          style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.02em" }}
        >
          아닌
        </p>
      </div>
      <p
        className="font-semibold text-[48px] md:text-[60px] lg:text-[84px] leading-[1.25] text-[#ffcd00]"
        style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.02em" }}
      >
        돌아오는 조천
      </p>
    </div>
  );
}

const SECTIONS = [
  { img: imgPolicy1, imgMo: imgPolicy1, content: <Section01 /> },
  { img: imgPolicy2, imgMo: imgPolicy2Mo, content: <Section02 /> },
  { img: imgPolicy3, imgMo: imgPolicy3Mo, content: <Section03 /> },
  { img: imgPolicy4, imgMo: imgPolicy4Mo, content: <Section04 /> },
];

export default function PolicySections() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const scrolled = -el.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const raw = scrolled / vh;
      setActiveIndex(Math.max(0, Math.min(3, Math.round(raw))));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="w-full" style={{ height: "400vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {SECTIONS.map((section, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: i === activeIndex ? 1 : 0 }}
            aria-hidden={i !== activeIndex}
          >
            <picture>
              <source media="(min-width: 768px)" srcSet={section.img} />
              <img
                src={section.imgMo}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </picture>
            <div className="absolute inset-0 bg-black/50" />

            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px]">
              {section.content}
            </div>
          </div>
        ))}

        {/* Indicators (same on mobile and desktop) */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] z-10 pointer-events-none">
          <div className="absolute left-4 sm:left-8 lg:left-[60px] bottom-[60px] sm:bottom-[80px] flex flex-col gap-1">
            <p
              className="text-white text-[14px] sm:text-[16px] leading-[1.5]"
              style={{ fontFamily: "Pretendard, sans-serif" }}
            >
              {String(activeIndex + 1).padStart(2, "0")}
            </p>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 w-[40px] sm:w-[60px] rounded-full transition-colors duration-300 ${
                    i === activeIndex ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
