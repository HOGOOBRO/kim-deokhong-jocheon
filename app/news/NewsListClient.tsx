"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { articlePath, type Article } from "@/app/data/news";

const PC_PAGE = 16;
const MO_PAGE = 8;

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${y.slice(2)}.${m}.${d}`;
}

function Thumb({ article, heightClass }: { article: Article; heightClass: string }) {
  if (article.hasHero && article.heroPc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={article.heroPc}
        alt={article.heroAlt}
        loading="lazy"
        className={`w-full ${heightClass} object-cover object-top`}
      />
    );
  }
  return (
    <div
      className={`relative w-full ${heightClass} bg-[#1a1a1a] text-[#FFD400] flex flex-col justify-end p-3.5 md:p-[18px]`}
    >
      <span className="absolute top-3.5 left-3.5 md:top-[18px] md:left-[18px] text-[10px] md:text-[11px] font-bold tracking-[0.05em] opacity-60">
        소식 · {String(article.id).padStart(2, "0")}
      </span>
      <span className="text-[14px] md:text-[16px] font-bold tracking-[-0.02em]">
        {article.category}
      </span>
    </div>
  );
}

function visiblePages(current: number, total: number): (number | "...")[] {
  const pages: (number | "...")[] = [];
  for (let n = 1; n <= total; n++) {
    if (n === 1 || n === total || Math.abs(n - current) <= 1) {
      pages.push(n);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }
  return pages;
}

export default function NewsListClient({
  articles,
  initialPage,
}: {
  articles: Article[];
  initialPage: number;
}) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(PC_PAGE); // SSR/첫 페인트 = PC
  const topRef = useRef<HTMLDivElement | null>(null);

  // 반응형 페이지 크기 (effect 본문 동기 setState 금지 → rAF/리스너에서)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setPageSize(mq.matches ? MO_PAGE : PC_PAGE);
    const raf = requestAnimationFrame(apply);
    mq.addEventListener("change", apply);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", apply);
    };
  }, []);

  const featured = articles[0];
  const rest = articles.slice(1);
  const totalPages = Math.max(1, Math.ceil(rest.length / pageSize));
  const current = Math.min(page, totalPages);
  const isPage1 = current === 1;
  const gridItems = rest.slice((current - 1) * pageSize, current * pageSize);

  const changePage = useCallback(
    (n: number) => {
      if (n < 1 || n > totalPages || n === current) return;
      setPage(n);
      const url = new URL(window.location.href);
      if (n === 1) url.searchParams.delete("page");
      else url.searchParams.set("page", String(n));
      history.pushState({}, "", url);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [totalPages, current],
  );

  // 브라우저 뒤로/앞으로 → ?page 동기화
  useEffect(() => {
    const onPop = () => {
      const p = Number(new URLSearchParams(window.location.search).get("page")) || 1;
      setPage(p);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const pages = visiblePages(current, totalPages);

  return (
    <main ref={topRef} className="max-w-[1600px] mx-auto px-5 md:px-[60px] scroll-mt-4">
      {/* 페이지 1 한정: 피처드 카드 */}
      {isPage1 ? (
        <Link
          href={articlePath(featured)}
          className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-4 md:gap-10 no-underline text-[#1a1a1a] group"
        >
          <div className="rounded-[14px] overflow-hidden">
            <Thumb article={featured} heightClass="h-[220px] md:h-[420px]" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="self-start bg-[#FFD400] text-[#1a1a1a] rounded-[4px] px-2.5 py-[5px] text-[11px] md:text-[12px] font-bold tracking-[-0.01em] mb-3 md:mb-4">
              최신
            </span>
            <h2 className="m-0 text-[22px] md:text-[36px] font-bold leading-[1.2] tracking-[-0.03em] text-balance break-keep [@media(hover:hover)]:group-hover:opacity-70">
              {featured.title}
            </h2>
            <p className="mt-3 md:mt-4 mb-0 text-[14px] md:text-[17px] font-medium text-[#5a5a5a] leading-[1.6] tracking-[-0.01em] line-clamp-3 break-keep">
              {featured.lead}
            </p>
            <div className="mt-3 md:mt-5 text-[12px] md:text-[13px] font-bold text-[#9a9a9a] tracking-[0.02em]">
              {formatDate(featured.date)} · {featured.source}
            </div>
          </div>
        </Link>
      ) : null}

      {/* 섹션 디바이더 */}
      <div
        className={`${isPage1 ? "mt-9 md:mt-20" : "mt-0"} pb-3.5 md:pb-4 mb-7 md:mb-9 border-b-2 border-[#1a1a1a] flex items-end justify-between`}
      >
        <h3 className="m-0 text-[16px] md:text-[18px] font-bold tracking-[-0.02em]">
          {isPage1 ? "이전 보도자료" : "전체 보도자료"}
        </h3>
        <span className="text-[11px] md:text-[12px] font-bold text-[#9a9a9a]">
          {current} / {totalPages}
        </span>
      </div>

      {/* 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-5 md:gap-x-7 md:gap-y-11">
        {gridItems.map((a) => (
          <Link
            key={a.id}
            href={articlePath(a)}
            className="block no-underline text-[#1a1a1a] group"
          >
            <div className="rounded-[10px] overflow-hidden mb-3">
              <Thumb article={a} heightClass="h-[180px] md:h-[220px]" />
            </div>
            <div className="text-[11px] md:text-[12px] font-bold text-[#9a9a9a] tracking-[0.02em] mb-1.5">
              {formatDate(a.date)} · {a.source}
            </div>
            <div className="text-[14px] md:text-[18px] font-bold leading-[1.4] tracking-[-0.02em] line-clamp-3 break-keep [@media(hover:hover)]:group-hover:opacity-70">
              {a.title}
            </div>
          </Link>
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 ? (
        <nav
          aria-label="페이지 네비게이션"
          className="flex items-center justify-center gap-[5px] md:gap-2 mt-9 md:mt-[72px]"
        >
          <PageBtn
            ariaLabel="이전 페이지"
            disabled={current === 1}
            onClick={() => changePage(current - 1)}
          >
            ‹
          </PageBtn>
          {pages.map((p, i) =>
            p === "..." ? (
              <span
                key={`e${i}`}
                className="w-9 h-9 md:w-[42px] md:h-[42px] flex items-center justify-center text-[#9a9a9a] font-bold"
              >
                ···
              </span>
            ) : (
              <button
                key={p}
                type="button"
                aria-current={p === current ? "page" : undefined}
                onClick={() => changePage(p)}
                className={`w-9 h-9 md:w-[42px] md:h-[42px] rounded-full text-[13px] md:text-[14px] font-bold transition-colors ${
                  p === current
                    ? "bg-[#1a1a1a] text-white border border-[#1a1a1a]"
                    : "bg-white text-[#1a1a1a] border border-[#eaeaea] [@media(hover:hover)]:hover:bg-[#f6f6f6]"
                }`}
              >
                {p}
              </button>
            ),
          )}
          <PageBtn
            ariaLabel="다음 페이지"
            disabled={current === totalPages}
            onClick={() => changePage(current + 1)}
          >
            ›
          </PageBtn>
        </nav>
      ) : null}
    </main>
  );
}

function PageBtn({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={`w-9 h-9 md:w-[42px] md:h-[42px] rounded-full border border-[#eaeaea] bg-white text-[#1a1a1a] text-[15px] flex items-center justify-center ${
        disabled
          ? "opacity-30 cursor-default"
          : "[@media(hover:hover)]:hover:bg-[#f6f6f6] cursor-pointer"
      }`}
    >
      {children}
    </button>
  );
}
