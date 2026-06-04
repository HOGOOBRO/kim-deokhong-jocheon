import Link from "next/link";

// 뉴스 영역 공통 헤더/푸터 (목록 + 상세 공용)

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-[#eaeaea]">
      <div className="max-w-[1200px] mx-auto px-5 py-3 md:px-8 md:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <span className="w-7 h-7 md:w-8 md:h-8 bg-[#FFD400] text-[#1a1a1a] rounded-full flex items-center justify-center font-bold text-[14px] md:text-[16px]">
            5
          </span>
          <span className="font-bold text-[15px] md:text-[17px] text-[#1a1a1a] tracking-[-0.025em]">
            김덕홍
          </span>
        </Link>
        <Link
          href="/"
          className="text-[13px] md:text-[14px] font-bold text-[#1a1a1a] tracking-[-0.01em] no-underline [@media(hover:hover)]:hover:opacity-70"
        >
          홈으로 →
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 md:mt-[90px] bg-[#1a1a1a] text-white px-5 pt-10 pb-7 md:px-8 md:pt-[52px] md:pb-9">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center gap-2.5 mb-3.5">
          <span className="w-7 h-7 bg-[#FFD400] text-[#1a1a1a] rounded-full flex items-center justify-center font-bold text-[10px] tracking-[-0.04em] leading-none">
            조천
          </span>
          <span className="font-bold text-[15px] tracking-[-0.02em]">
            김덕홍 · 조천읍 도의원 당선인
          </span>
        </div>
        <div className="text-[12px] md:text-[13px] leading-[1.65] text-white/55">
          제주시 조천읍 · 캠페인 사무실
          <br />© 2026 김덕홍 캠페인.
        </div>
      </div>
    </footer>
  );
}
