"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  POLICIES,
  THEMES,
  CLOSING_LINE,
  type Policy,
  type PolicyBullet,
} from "../data/policies";

/**
 * 정책 캐러셀 섹션 — 키비주얼 바로 아래에 삽입. 6개 정책을 가로 스크롤 카드로 노출,
 * 카드 클릭 시 정책 상세 모달 오픈. 디자인 핸드오프: design_handoff_policy_carousel.
 *
 * - 옐로/폰트는 사이트 공통값에 맞춤(YELLOW=#FFCD00, Pretendard, weight ≤700, tracking -0.02em).
 * - 반응형은 전부 Tailwind md: 클래스(=CSS)로 처리 → 항상 보이는 섹션이라 JS 사이징 시
 *   첫 페인트 깜빡임이 생기므로 matchMedia를 쓰지 않음(사이트의 다른 섹션과 동일 방식).
 * - 스크롤러는 풀블리드: 첫 카드는 1200 콘텐츠 좌측에 정렬, 우측은 마진 없이 화면 밖으로
 *   흐름(globals.css `.policy-scroller`). PC 화살표 / 모바일 스와이프.
 * - 카드/닫기 hover는 globals.css `@media (hover:hover)` (모바일 탭 hover 고착 방지).
 *
 * 모달 스크롤 잠금 불변식 (SchedulePopup과 동일한 규율 — 누수 방지):
 *   PolicyModal은 openPolicy !== null일 때만 마운트되고, 마운트=잠금 / 언마운트=해제로 1:1 대응.
 *   닫힘 애니메이션 동안에도 openPolicy를 유지(closing만 true)했다가 unmount → 해제.
 *   "모달이 떠 있는데 null을 렌더하는" 분기 금지.
 *
 * NOTE: 아래 모달의 스크롤락+포커스트랩은 SchedulePopup.tsx의 패턴을 복제한 것.
 *       세 번째 모달이 생기면 공용 훅(useModalLock)으로 추출 검토.
 */

const YELLOW = "#FFCD00"; // 사이트 공통 옐로(overview 등과 동일). 핸드오프의 #FFD400 대신 사용.
const FONT = '"Pretendard", sans-serif';
const EXIT_MS = 150;

// 테마 구분은 라벨 텍스트로만. 색은 모두 동일(아웃라인 칩).
function Chip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center text-[11px] md:text-[12px] px-[9px] py-[4px] md:px-[11px] md:py-[5px]"
      style={{
        background: "transparent",
        color: "#1a1a1a",
        border: "1px solid #1a1a1a",
        fontWeight: 700,
        borderRadius: 999,
        letterSpacing: "-0.02em",
        lineHeight: 1,
      }}
    >
      {label}
    </span>
  );
}

const ArrowIcon = ({ dir }: { dir: "left" | "right" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path
      d={dir === "left" ? "M11 3l-6 6 6 6" : "M7 3l6 6-6 6"}
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

function PolicyCardView({
  policy,
  onOpen,
}: {
  policy: Policy;
  onOpen: () => void;
}) {
  const numStr = String(policy.n).padStart(2, "0");

  return (
    <div
      role="button"
      tabIndex={0}
      data-policy-card
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="policy-card shrink-0 snap-start cursor-pointer relative overflow-hidden flex flex-col w-[264px] h-[360px] md:w-[304px] md:h-[400px] p-[22px_22px_20px] md:p-[26px_26px_24px]"
      style={{
        boxSizing: "border-box",
        background: "#fff",
        border: "1.5px solid #1a1a1a",
        borderRadius: 18,
      }}
    >
      {/* 상단: 테마칩 + 번호 */}
      <div className="flex items-start justify-between">
        <Chip label={THEMES[policy.theme].label} />
        <div className="flex flex-col items-end leading-none">
          <span
            className="text-[9px] md:text-[10px]"
            style={{
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#9a9a9a",
              marginBottom: 2,
            }}
          >
            정책
          </span>
          <span
            className="text-[32px] md:text-[38px]"
            style={{
              fontWeight: 700,
              color: "#1a1a1a",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {numStr}
          </span>
        </div>
      </div>

      {/* 옐로 액센트 바 (3px × 36) */}
      <div
        className="mt-[22px] md:mt-[28px]"
        style={{ height: 3, width: 36, background: YELLOW, borderRadius: 2 }}
      />

      {/* 제목 */}
      <div
        className="mt-[12px] md:mt-[14px] text-[20px] md:text-[23px] text-balance"
        style={{
          fontWeight: 700,
          color: "#1a1a1a",
          letterSpacing: "-0.02em",
          lineHeight: 1.25,
        }}
      >
        {policy.title}
      </div>

      {/* 요약 */}
      <div
        className="mt-[10px] md:mt-[12px] text-[13px] md:text-[14px]"
        style={{
          fontWeight: 600,
          color: "#5a5a5a",
          lineHeight: 1.55,
          letterSpacing: "-0.02em",
        }}
      >
        {policy.summary}
      </div>

      <div className="flex-1" />

      {/* CTA */}
      <div
        className="flex items-center justify-between gap-[10px] pt-[14px] md:pt-[16px]"
        style={{ borderTop: "1px dashed #d8d8d8" }}
      >
        <span
          className="text-[12px] md:text-[13px]"
          style={{ fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.02em" }}
        >
          자세히 보기
        </span>
        <span
          className="flex items-center justify-center w-[28px] h-[28px] md:w-[32px] md:h-[32px]"
          style={{ borderRadius: "50%", background: YELLOW, color: "#1a1a1a" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6h8M7 2l4 4-4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}

function BulletRow({ bullet, index }: { bullet: PolicyBullet; index: number }) {
  const isObj = typeof bullet === "object";
  const head = isObj ? bullet.head : bullet;
  const subs = isObj ? bullet.sub : null;

  return (
    <li className="grid grid-cols-[24px_1fr] md:grid-cols-[28px_1fr] gap-[12px] md:gap-[14px]">
      <span
        className="flex items-center justify-center shrink-0 w-[22px] h-[22px] md:w-[26px] md:h-[26px] text-[12px] md:text-[13px]"
        style={{
          marginTop: 1,
          borderRadius: "50%",
          background: "#1a1a1a",
          color: "#fff",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {index}
      </span>
      <div className="min-w-0">
        <div
          className="text-[15px] md:text-[16px]"
          style={{
            fontWeight: 700,
            color: "#1a1a1a",
            lineHeight: 1.45,
            letterSpacing: "-0.02em",
          }}
        >
          {head}
        </div>
        {subs && (
          <ul
            className="mt-[10px] md:mt-[12px] pl-[12px] md:pl-[14px] gap-[6px] md:gap-[7px] flex flex-col"
            style={{ listStyle: "none", borderLeft: "1px solid #eaeaea" }}
          >
            {subs.map((s, i) => (
              <li
                key={i}
                className="grid grid-cols-[8px_1fr] gap-[8px] text-[13px] md:text-[14px]"
                style={{
                  fontWeight: 500,
                  color: "#5a5a5a",
                  lineHeight: 1.55,
                  letterSpacing: "-0.02em",
                }}
              >
                <span
                  style={{
                    color: "#bdbdbd",
                    fontWeight: 700,
                    marginTop: -1,
                    lineHeight: 1.55,
                  }}
                >
                  –
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

function PolicyModal({
  policy,
  closing,
  onClose,
}: {
  policy: Policy;
  closing: boolean;
  onClose: () => void;
}) {
  const numStr = String(policy.n).padStart(2, "0");
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  // 마운트=잠금 / 언마운트=해제. body overflow + dataset.modalOpen(SnapScroll 비활성)
  // + 스크롤바 폭 보정 + 포커스 트랩 + ESC. (SchedulePopup 패턴 복제)
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarW = window.innerWidth - root.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbarW > 0) body.style.paddingRight = `${scrollbarW}px`;
    root.dataset.modalOpen = "1";

    prevFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const container = dialogRef.current;
      if (!container) return;
      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !container.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !container.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey, true);

    return () => {
      window.removeEventListener("keydown", onKey, true);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
      delete root.dataset.modalOpen;
      prevFocusRef.current?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={`fixed inset-0 flex items-center justify-center p-[12px] md:p-[32px] ${
        closing ? "" : "popup-scrim-anim"
      }`}
      style={{
        zIndex: 200,
        background: "rgba(0,0,0,0.6)",
        fontFamily: FONT,
        opacity: closing ? 0 : undefined,
        transition: closing ? `opacity ${EXIT_MS}ms ease-in` : undefined,
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`policy-${policy.n}-title`}
        className={`flex flex-col overflow-hidden w-full md:w-[560px] max-w-full max-h-[92vh] md:max-h-[88vh] rounded-[18px] md:rounded-[22px] ${
          closing ? "" : "popup-card-anim"
        }`}
        style={{
          background: "#fff",
          boxShadow:
            "0 30px 80px -20px rgba(0,0,0,0.4), 0 8px 24px -8px rgba(0,0,0,0.2)",
          wordBreak: "keep-all",
          overflowWrap: "break-word",
          opacity: closing ? 0 : undefined,
          transform: closing ? "scale(0.98)" : undefined,
          transition: closing
            ? `opacity ${EXIT_MS}ms ease-in, transform ${EXIT_MS}ms ease-in`
            : undefined,
        }}
      >
        {/* 헤더 */}
        <div
          className="relative p-[20px_20px_18px] md:p-[26px_28px_22px]"
          style={{ background: "#fff", borderBottom: "1px solid #eaeaea" }}
        >
          <div className="flex items-center justify-between gap-[12px]">
            <Chip label={THEMES[policy.theme].label} />
            <div className="flex items-center gap-[8px]">
              <span
                className="text-[11px] md:text-[12px]"
                style={{
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#9a9a9a",
                }}
              >
                정책 {numStr}
              </span>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="policy-modal-x flex items-center justify-center w-[32px] h-[32px] md:w-[34px] md:h-[34px]"
                style={{
                  borderRadius: "50%",
                  border: "none",
                  color: "#1a1a1a",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <path
                    d="M2 2L12 12M12 2L2 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </button>
            </div>
          </div>

          <h3
            id={`policy-${policy.n}-title`}
            className="mt-[14px] mb-[6px] md:mt-[18px] md:mb-[8px] text-[22px] md:text-[28px] text-balance"
            style={{
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              color: "#1a1a1a",
            }}
          >
            {policy.title}
          </h3>
          <p
            className="text-[13px] md:text-[15px]"
            style={{
              margin: 0,
              fontWeight: 600,
              color: "#5a5a5a",
              letterSpacing: "-0.02em",
            }}
          >
            {policy.summary}
          </p>

          {/* 옐로 액센트 바 (3px × 40) */}
          <div
            className="mt-[14px] md:mt-[18px]"
            style={{ height: 3, width: 40, background: YELLOW, borderRadius: 2 }}
          />
        </div>

        {/* 본문 (스크롤 영역 — 추진 과제 리스트만 스크롤) */}
        <div
          className="flex-1 overflow-y-auto p-[22px_22px_18px] md:p-[28px_32px_24px]"
          style={{ background: "#fff", WebkitOverflowScrolling: "touch" }}
        >
          <div
            className="text-[11px] md:text-[12px] mb-[12px] md:mb-[14px]"
            style={{ fontWeight: 700, letterSpacing: "0.08em", color: "#9a9a9a" }}
          >
            추진 과제
          </div>

          <ul
            className="flex flex-col gap-[14px] md:gap-[16px]"
            style={{ listStyle: "none", margin: 0, padding: 0 }}
          >
            {policy.bullets.map((b, i) => (
              <BulletRow key={i} bullet={b} index={i + 1} />
            ))}
          </ul>
        </div>

        {/* 김덕홍의 약속 — 본문 스크롤과 무관하게 고정(헤더/푸터와 함께) */}
        <div
          className="shrink-0 px-[22px] md:px-[32px] pt-[16px] md:pt-[20px] pb-[20px] md:pb-[24px]"
          style={{ background: "#fff" }}
        >
          <div
            className="p-[20px_20px_22px] md:p-[24px_24px_26px]"
            style={{ background: YELLOW, borderRadius: 14 }}
          >
            <div
              className="text-[10px] md:text-[11px] mb-[10px] md:mb-[12px]"
              style={{
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "#1a1a1a",
                opacity: 0.7,
              }}
            >
              김덕홍의 약속
            </div>
            <div
              className="text-[15px] md:text-[18px] text-balance"
              style={{
                fontWeight: 700,
                color: "#1a1a1a",
                lineHeight: 1.5,
                letterSpacing: "-0.02em",
              }}
            >
              {policy.closing}
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div
          className="flex items-center justify-between gap-[12px] p-[12px_18px] md:p-[14px_22px]"
          style={{ background: "#fff", borderTop: "1px solid #eaeaea" }}
        >
          <div
            className="text-[12px] md:text-[13px]"
            style={{ fontWeight: 600, color: "#5a5a5a", letterSpacing: "-0.02em" }}
          >
            조천읍 도의원 김덕홍 · 무소속
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[12px] md:text-[13px] p-[8px_16px] md:p-[9px_20px]"
            style={{
              background: "#1a1a1a",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "-0.02em",
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PolicyCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [openPolicy, setOpenPolicy] = useState<Policy | null>(null);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number | null>(null);

  // 진행률(0..1). 초기값은 rAF로 1회 계산(effect 본문 동기 setState 금지 규칙 회피).
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? Math.max(0, Math.min(1, el.scrollLeft / max)) : 1);
    };
    const raf = requestAnimationFrame(onScroll);
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(onScroll);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-policy-card]");
    let step = 326; // 폴백(PC 카드폭 304 + gap 22)
    if (cards.length >= 2) step = cards[1].offsetLeft - cards[0].offsetLeft;
    else if (cards.length === 1)
      step = cards[0].getBoundingClientRect().width + 22;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  const close = useCallback(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setClosing(false);
      setOpenPolicy(null);
      return;
    }
    setClosing(true);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setClosing(false);
      setOpenPolicy(null);
    }, EXIT_MS);
  }, []);

  const open = useCallback((p: Policy) => {
    setClosing(false);
    setOpenPolicy(p);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const atStart = progress <= 0.001;
  const atEnd = progress >= 0.999;

  return (
    <section
      className="relative w-full pt-[36px] pb-[28px] md:pt-[72px] md:pb-[40px]"
      style={{
        background: YELLOW,
        color: "#1a1a1a",
        fontFamily: FONT,
        wordBreak: "keep-all",
        overflowWrap: "break-word",
      }}
    >
      {/* 섹션 헤더 */}
      <div className="mx-auto max-w-[1200px] px-[20px] md:px-[32px] flex items-end justify-between gap-[16px] flex-wrap">
        <div>
          <div
            className="inline-flex items-center gap-[8px] text-[11px] md:text-[12px]"
            style={{
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#1a1a1a",
              background: "rgba(26,26,26,0.08)",
              padding: "6px 10px",
              borderRadius: 999,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#1a1a1a",
              }}
            />
            정책 공약
          </div>
          <h2
            className="mt-[12px] mb-[6px] md:mt-[14px] md:mb-[8px] text-[28px] md:text-[44px] text-balance"
            style={{ fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 }}
          >
            김덕홍이
            <br />
            약속하는 6대 정책
          </h2>
          <p
            className="text-[13px] md:text-[15px]"
            style={{
              margin: 0,
              fontWeight: 600,
              color: "rgba(26,26,26,0.78)",
              letterSpacing: "-0.02em",
            }}
          >
            미래는 탄탄하게 · 생활은 편리하게 · 삶은 든든하게
          </p>
        </div>

        {/* PC 화살표 (모바일은 스와이프) */}
        <div className="hidden md:flex gap-[10px]">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="이전"
            disabled={atStart}
            className="flex items-center justify-center w-[44px] h-[44px]"
            style={{
              borderRadius: "50%",
              border: "none",
              background: atStart ? "rgba(26,26,26,0.08)" : "#1a1a1a",
              color: atStart ? "rgba(26,26,26,0.35)" : YELLOW,
              cursor: atStart ? "default" : "pointer",
              transition: "all .15s",
            }}
          >
            <ArrowIcon dir="left" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="다음"
            disabled={atEnd}
            className="flex items-center justify-center w-[44px] h-[44px]"
            style={{
              borderRadius: "50%",
              border: "none",
              background: atEnd ? "rgba(26,26,26,0.08)" : "#1a1a1a",
              color: atEnd ? "rgba(26,26,26,0.35)" : YELLOW,
              cursor: atEnd ? "default" : "pointer",
              transition: "all .15s",
            }}
          >
            <ArrowIcon dir="right" />
          </button>
        </div>
      </div>

      {/* 스크롤러 (풀블리드: 좌측은 1200 콘텐츠 정렬, 우측은 화면 밖으로 흐름) */}
      <div
        ref={scrollerRef}
        className="policy-scroller no-scrollbar flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain mt-[24px] md:mt-[36px] gap-[14px] md:gap-[22px]"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {POLICIES.map((p) => (
          <PolicyCardView key={p.n} policy={p} onOpen={() => open(p)} />
        ))}
      </div>

      {/* 진행률 바 */}
      <div className="mx-auto max-w-[1200px] mt-[14px] md:mt-[18px] px-[20px] md:px-[32px]">
        <div
          style={{
            height: 3,
            background: "rgba(26,26,26,0.15)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.max(8, progress * 100)}%`,
              background: "#1a1a1a",
              borderRadius: 2,
              transition: "width .15s ease-out",
            }}
          />
        </div>
      </div>

      {/* 마무리 문구 */}
      <div
        className="mx-auto max-w-[1200px] mt-[28px] md:mt-[44px] px-[20px] md:px-[32px] text-center text-[14px] md:text-[17px] text-balance"
        style={{
          fontWeight: 700,
          color: "#1a1a1a",
          letterSpacing: "-0.02em",
          lineHeight: 1.5,
        }}
      >
        {CLOSING_LINE}
      </div>

      {openPolicy && (
        <PolicyModal policy={openPolicy} closing={closing} onClose={close} />
      )}
    </section>
  );
}
