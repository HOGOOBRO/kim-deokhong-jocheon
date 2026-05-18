"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 진입 시 즉시 노출되는 모바일 바텀시트 — 조천읍민과 함께하는 출정식 안내.
 * Figma: Korail-schedule node 241:684 (Bottom sheet).
 *
 * - 진입하자마자 표시(SSR부터 open=true → 깜빡임 없음), slide-up 애니메이션.
 * - 닫기: 스크림 탭 / 드래그 핸들 / Esc. 열려 있는 동안 body 스크롤 잠금.
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

export default function EventBottomSheet() {
  // open=true부터 시작 → SSR HTML에 포함되어 첫 페인트에 바로 보임(깜빡임 방지).
  const [open, setOpen] = useState(true);
  const [closing, setClosing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<number | null>(null);

  const close = useCallback(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setOpen(false);
      return;
    }
    setClosing(true);
    window.setTimeout(() => setOpen(false), 280);
  }, []);

  // body 스크롤 잠금 + SnapScroll 비활성 플래그 + Esc 닫기.
  useEffect(() => {
    if (!open) return;
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
  }, [open, close]);

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

  // 시트가 닫혀 있을 땐 재호출용 FAB 노출 — Figma 246:857 (출정식 초대장)
  if (!open) {
    return (
      <button
        type="button"
        aria-label="출정식 초대장 다시 보기"
        onClick={() => {
          setClosing(false);
          setOpen(true);
        }}
        className="fab-anim fixed right-[16px] z-[90] flex size-[73px] flex-col items-center justify-center rounded-full bg-[#fcd100] transition-transform hover:scale-105 active:scale-95"
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
      className="fixed inset-0 z-[100] flex items-end justify-center"
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
        className={`relative z-[1] w-[min(358px,calc(100vw-32px))] max-h-[92vh] overflow-y-auto no-scrollbar rounded-t-[24px] bg-white outline-none ${
          closing
            ? "translate-y-full transition-transform duration-300 ease-in"
            : "sheet-anim"
        }`}
        style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}
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

          {/* Body — Figma 241:714 / 242:808 justify-end: 240px block, right-aligned */}
          <p
            className="w-[240px] self-end font-semibold text-[#1c1c1c]"
            style={{
              fontFamily: PRETENDARD,
              fontSize: "15px",
              letterSpacing: "-0.45px",
              lineHeight: "28px",
            }}
          >
            당의 이름이 아닌 조천읍의 이름으로 나섭니다. 저 김덕홍의 첫 걸음,
            여러분의 발걸음으로 완성해 주십시오!
          </p>

          {/* Divider — Figma 242:810 */}
          <div className="h-px w-full bg-[#dddddd]" />

          {/* Actions — Figma 242:826 (share | copy-link) */}
          <div className="flex items-stretch gap-[16px]">
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
              className="flex flex-1 items-center gap-[12px] overflow-hidden rounded-[8px] px-[4px] py-[6px] transition-colors hover:bg-black/[0.04] active:bg-black/[0.06]"
            >
              <img
                src="/icons/link.svg"
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
