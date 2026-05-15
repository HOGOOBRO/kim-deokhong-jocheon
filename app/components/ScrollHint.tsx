"use client";
import { useCallback } from "react";

export default function ScrollHint() {
  const handleClick = useCallback(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    window.scrollTo({ top: heroBottom, behavior: "smooth" });
  }, []);

  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-[8px] md:bottom-[10px] flex flex-col items-center gap-0 md:gap-[4px] pointer-events-none">
      {/* Arrow icon — clickable (mobile 24, tablet 48, desktop 60) */}
      <button
        type="button"
        onClick={handleClick}
        aria-label="다음 섹션으로 스크롤"
        className="w-[24px] h-[24px] md:w-[48px] md:h-[48px] lg:w-[60px] lg:h-[60px] cursor-pointer motion-safe:animate-bounce-soft hover:opacity-80 transition-opacity focus:outline-none pointer-events-auto block"
      >
        <img
          src="/icons/scroll-down-arrow.svg"
          alt=""
          aria-hidden
          className="w-full h-full block"
        />
      </button>
      {/* "아래로 내려주세요" label — directly below the arrow, centered */}
      <p
        className="text-center text-[#aaa] text-[12px] md:text-[14px] lg:text-[16px] font-bold leading-[1.25] whitespace-nowrap"
        style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.02em" }}
      >
        아래로 내려주세요
      </p>
    </div>
  );
}
