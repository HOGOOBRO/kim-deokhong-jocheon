"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 진입 시 즉시 노출되는 모바일 바텀시트 — 조천읍민과 함께하는 출정식 안내.
 * Figma: Korail-schedule node 241:684 (Bottom sheet).
 *
 * - 진입하자마자 표시(SSR부터 open=true → 깜빡임 없음), slide-up 애니메이션.
 * - 닫기: 스크림 탭 / 드래그 핸들 / Esc / 시트 아래로 스와이프(모바일).
 *   열려 있는 동안 body 스크롤 잠금.
 * - PC(>=768px)에서는 시트·FAB 모두 미표시(스크롤 잠금 효과도 미적용).
 * - "공유하기": 시스템 공유(Web Share API), 미지원 시 링크 복사로 폴백.
 * - "링크 복사하기": https://deokhong.com/ 클립보드 복사.
 */

const SITE_URL = "https://deokhong.com/";
const SHARE_DATA = {
  title: "기호 5번 김덕홍",
  text: "조천읍민과 함께하는 출정식 — 5.21(목) 오후 7시, 조천 만세동산",
  url: SITE_URL,
};

const PRETENDARD = "Pretendard, sans-serif";

// 프로젝트 공통 모바일/데스크톱 경계 (Tailwind 기본 md). PC에선 기능 전체 비활성.
const DESKTOP_MQ = "(min-width: 768px)";

// 행사 종료 처리: 2026-05-22 00:00 KST부터 시트·FAB 자동 비표시
// (행사 당일 5.21까지 노출, 다음 날부터 사라짐). 절대시각 비교라 타임존 무관.
// 모듈 로드(=페이지 로드) 시점에 1회 평가 → 렌더는 순수 상수만 읽음.
const EVENT_CUTOFF_MS = Date.parse("2026-05-22T00:00:00+09:00");
const EVENT_OVER = Date.now() >= EVENT_CUTOFF_MS;

export default function EventBottomSheet() {
  // open=true부터 시작 → SSR HTML에 포함되어 첫 페인트에 바로 보임(깜빡임 방지).
  const [open, setOpen] = useState(true);
  const [closing, setClosing] = useState(false);
  const [enterDone, setEnterDone] = useState(false);
  const [dragY, setDragY] = useState<number | null>(null);
  const [snapBack, setSnapBack] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragYRef = useRef(0);
  const toastTimer = useRef<number | null>(null);

  const close = useCallback(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDragY(null);
      setOpen(false);
      return;
    }
    setDragY(null);
    setClosing(true);
    window.setTimeout(() => setOpen(false), 280);
  }, []);

  const reopen = useCallback(() => {
    setClosing(false);
    setEnterDone(false);
    setSnapBack(false);
    setDragY(null);
    dragYRef.current = 0;
    setOpen(true);
  }, []);

  // 뷰포트가 PC/모바일 경계를 넘으면 잠금/드래그 효과를 재평가하기 위한 트리거.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // body 스크롤 잠금 + SnapScroll 비활성 플래그 + Esc 닫기. (PC에선 미적용)
  useEffect(() => {
    if (!open) return;
    if (window.matchMedia(DESKTOP_MQ).matches) return;
    const root = document.documentElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.dataset.modalOpen = "1";
    sheetRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      delete root.dataset.modalOpen;
    };
  }, [open, close, isDesktop]);

  // 시트 아래로 스와이프 → 닫기 (모바일). 시트가 맨 위(스크롤 0)일 때만
  // 드래그로 전환, 그 외엔 내부 콘텐츠 스크롤을 방해하지 않음.
  useEffect(() => {
    if (!open) return;
    if (window.matchMedia(DESKTOP_MQ).matches) return;
    const el = sheetRef.current;
    if (!el) return;
    let startY = 0;
    let engaged = false;
    let canDrag = false;
    const SLOP = 8;

    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      startY = e.touches[0].clientY;
      canDrag = el.scrollTop <= 0;
      engaged = false;
    };
    const onMove = (e: TouchEvent) => {
      if (!canDrag) return;
      const dy = e.touches[0].clientY - startY;
      if (dy <= 0) {
        if (engaged) {
          engaged = false;
          dragYRef.current = 0;
          setDragY(null);
        }
        return;
      }
      if (!engaged) {
        if (dy < SLOP) return;
        engaged = true;
        setEnterDone(true); // 입장 애니메이션 중이면 인라인 제어로 전환
      }
      e.preventDefault(); // 시트 드래그 중 내부/페이지 스크롤 차단
      dragYRef.current = dy;
      setDragY(dy);
    };
    const onEnd = () => {
      if (!engaged) return;
      engaged = false;
      const h = el.offsetHeight || 600;
      const dy = dragYRef.current;
      dragYRef.current = 0;
      if (dy > Math.min(140, h * 0.28)) {
        close(); // 임계 초과 → 현재 위치에서 이어서 닫힘
      } else {
        setSnapBack(true); // 원위치 복귀
        setDragY(null);
        window.setTimeout(() => setSnapBack(false), 240);
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [open, close, isDesktop]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const flashToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2000);
  }, []);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL);
      flashToast("링크가 복사되었습니다");
    } catch {
      // 비보안 컨텍스트/구형 사파리 폴백
      try {
        const ta = document.createElement("textarea");
        ta.value = SITE_URL;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        flashToast("링크가 복사되었습니다");
      } catch {
        flashToast("링크 복사를 지원하지 않는 브라우저입니다");
      }
    }
  }, [flashToast]);

  const share = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(SHARE_DATA);
      } catch (e) {
        // 사용자가 공유 취소(AbortError) — 무시
        if ((e as Error)?.name !== "AbortError") {
          void copyLink();
        }
      }
      return;
    }
    // Web Share 미지원(데스크톱 등) → 링크 복사로 폴백
    await copyLink();
    flashToast("공유를 지원하지 않아 링크를 복사했습니다");
  }, [copyLink, flashToast]);

  // 행사 당일까지만 노출 — 마감 시점 이후엔 시트/FAB 모두 표시 안 함
  if (EVENT_OVER) return null;

  // 시트가 닫혀 있을 땐 재호출용 FAB 노출 — Figma 246:857 (출정식 초대장)
  if (!open) {
    return (
      <button
        type="button"
        aria-label="출정식 초대장 다시 보기"
        onClick={reopen}
        className="fab-anim fixed right-[16px] z-[90] flex size-[73px] flex-col items-center justify-center rounded-full bg-[#fcd100] transition-transform hover:scale-105 active:scale-95 md:hidden"
        style={{
          bottom: "max(24px, env(safe-area-inset-bottom))",
          boxShadow:
            "0px 18px 24px rgba(0,0,0,0.18), 0px 4px 6px rgba(0,0,0,0.08)",
        }}
      >
        <span
          className="text-center font-bold text-black"
          style={{
            fontFamily: PRETENDARD,
            fontSize: "16px",
            lineHeight: "20px",
            letterSpacing: "-0.48px",
          }}
        >
          출정식
          <br />
          초대장
        </span>
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="조천읍민과 함께하는 출정식 안내"
      className="fixed inset-0 z-[100] flex items-end justify-center md:hidden"
    >
      {/* Scrim — Figma 241:685 (black, opacity 32%) */}
      <button
        type="button"
        aria-label="닫기"
        onClick={close}
        className={`absolute inset-0 cursor-default bg-black/[0.32] ${
          closing ? "opacity-0 transition-opacity duration-300" : "scrim-anim"
        }`}
      />

      {/* Bottom Sheet — Figma 241:686 (358w, rounded-top 24px) */}
      <div
        ref={sheetRef}
        tabIndex={-1}
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget) setEnterDone(true);
        }}
        className={`relative z-[1] w-[min(358px,calc(100vw-32px))] max-h-[92vh] overflow-y-auto no-scrollbar rounded-t-[24px] bg-white outline-none ${
          !enterDone && !closing && dragY === null ? "sheet-anim" : ""
        }`}
        style={{
          paddingBottom: "max(8px, env(safe-area-inset-bottom))",
          transform: closing
            ? "translateY(100%)"
            : dragY !== null
              ? `translateY(${dragY}px)`
              : "translateY(0)",
          transition: closing
            ? "transform 280ms ease-in"
            : dragY !== null
              ? "none"
              : snapBack
                ? "transform 240ms cubic-bezier(0.22,1,0.36,1)"
                : "none",
        }}
      >
        {/* Header + Drag handle — Figma 241:690/241:691 (tap to close) */}
        <div className="flex items-center justify-center p-[14px]">
          <button
            type="button"
            aria-label="닫기"
            onClick={close}
            className="flex h-[20px] w-[64px] items-center justify-center"
          >
            <span className="block h-[4px] w-[28px] rounded-full bg-[#79747e]" />
          </button>
        </div>

        <div className="flex flex-col gap-[24px] px-[16px] pb-[20px]">
          {/* Event card — Figma 241:757 (flat composite render) */}
          <img
            src="/images/event-card.png"
            alt="조천읍민과 함께하는 출정식 · 5.21 목요일 오후 7시 · 조천 만세동산"
            width={326}
            height={300}
            className="w-full rounded-[22px] object-cover"
            style={{ aspectRatio: "326 / 300" }}
          />

          {/* Title row — Figma 242:809 */}
          <div className="flex items-center gap-[12px]">
            <img
              src="/icons/event-arrow.svg"
              alt=""
              aria-hidden
              className="block shrink-0"
              style={{
                width: "20px",
                height: "20px",
                transform: "rotate(180deg) scaleY(-1)",
              }}
            />
            <h2
              className="font-extrabold text-[#1c1c1c]"
              style={{
                fontFamily: PRETENDARD,
                fontSize: "25px",
                letterSpacing: "-0.75px",
                lineHeight: "normal",
              }}
            >
              조천읍민과 함께하는 출정식
            </h2>
          </div>

          {/* Body — Figma 250:896 (full width, left-aligned, 18px, 3 lines) */}
          <p
            className="w-full font-semibold text-[#1c1c1c]"
            style={{
              fontFamily: PRETENDARD,
              fontSize: "18px",
              letterSpacing: "-0.54px",
              lineHeight: "28px",
            }}
          >
            당의 이름이 아닌 조천읍의 이름으로 나섭니다.
            <br />
            저 김덕홍의 첫 걸음,
            <br />
            여러분의 발걸음으로 완성해 주십시오!
          </p>

          {/* Divider — Figma 242:810 */}
          <div className="h-px w-full bg-[#dddddd]" />

          {/* Actions — Figma 250:898 (share flex-1 | copy-link auto, row px-20) */}
          <div className="flex items-center gap-[16px] px-[20px]">
            <button
              type="button"
              onClick={share}
              className="flex flex-1 items-center gap-[12px] overflow-hidden rounded-[8px] px-[4px] py-[6px] transition-colors hover:bg-black/[0.04] active:bg-black/[0.06]"
            >
              <img
                src="/icons/share.svg"
                alt=""
                aria-hidden
                className="block h-[24px] w-[24px] shrink-0"
              />
              <span
                className="font-semibold text-[#666666]"
                style={{
                  fontFamily: PRETENDARD,
                  fontSize: "15px",
                  letterSpacing: "-0.45px",
                  lineHeight: "28px",
                }}
              >
                공유하기
              </span>
            </button>

            <button
              type="button"
              onClick={copyLink}
              className="flex shrink-0 items-center gap-[12px] overflow-hidden rounded-[8px] px-[4px] py-[6px] transition-colors hover:bg-black/[0.04] active:bg-black/[0.06]"
            >
              <img
                src="/icons/link.svg"
                alt=""
                aria-hidden
                className="block h-[24px] w-[24px] shrink-0"
              />
              <span
                className="whitespace-nowrap font-semibold text-[#666666]"
                style={{
                  fontFamily: PRETENDARD,
                  fontSize: "15px",
                  letterSpacing: "-0.45px",
                  lineHeight: "28px",
                }}
              >
                링크 복사하기
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 복사/공유 결과 토스트 */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[24px] z-[2] flex justify-center"
      >
        {toast && (
          <div
            className="rounded-full bg-black/80 px-4 py-2 text-white"
            style={{
              fontFamily: PRETENDARD,
              fontSize: "14px",
              letterSpacing: "-0.3px",
            }}
          >
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
