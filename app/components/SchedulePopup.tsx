"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Ref,
} from "react";
import { SCHEDULE, type ScheduleRow } from "../data/schedule";
import FinalDayImmersive, { FINAL_DAY_ISO } from "./FinalDayImmersive";

/**
 * 유세일정 팝업 — 홈 진입 시 1회 자동 노출되는 중앙 모달 (PC + 모바일 공통).
 * 디자인 핸드오프: design_handoff_schedule_popup (옐로 #FFD400 / 잉크 #1a1a1a).
 *
 * 동작
 * - 진입 즉시(다음 틱) 0.2s fade-in. open=false에서 시작 → SSR엔 아무것도 안 그려져 하이드레이션 안전.
 * - "오늘 하루 보지 않기": localStorage로 24시간 숨김.
 * - 캠페인 종료(2026-06-03 00:00 KST) 이후 자동 비표시.
 * - 오늘(KST) 일정이 있으면 그 행을 "● 오늘"로 하이라이트, 없으면 가장 가까운 미래 1개를 "● 다가오는 일정".
 * - 닫기: X · 배경 클릭 · ESC · 푸터 버튼.
 *
 * 스크롤 잠금 불변식 (중요 — EventBottomSheet 누수 버그 재발 방지):
 *   open=true가 되는 경로는 진입 게이트 effect 1곳뿐이고, open=true면 다이얼로그가 "항상" 렌더된다.
 *   (open=true인데 null을 렌더하는 분기를 절대 추가하지 말 것 → 잠금 해제 트리거가 사라짐.)
 *   잠금/해제는 open 의존 effect의 적용/cleanup으로 1:1 대응한다.
 */

const PRETENDARD =
  '"Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
const MOBILE_MQ = "(max-width: 767px)";
const HIDE_KEY = "deokhong_popup_hidden_until";
const CAMPAIGN_END_MS = Date.parse("2026-06-03T00:00:00+09:00");
// 모듈 로드(=페이지 로드) 시점 1회 평가. 종료 후엔 팝업도 FAB도 미표시.
const CAMPAIGN_OVER = Date.now() >= CAMPAIGN_END_MS;
// 진입 즉시 오픈(다음 틱). setTimeout으로 감싸는 건 set-state-in-effect 규칙 회피용이라
// 0이어도 effect 동기 호출이 아니라 안전. 부드러운 등장은 0.2s CSS 페이드인이 담당.
const OPEN_DELAY_MS = 0;
// 선거운동 막바지: 총력유세 D-2 ~ 당일(2026-05-31 ≤ today ≤ 2026-06-02)에는
// 일정 리스트 대신 풀블리드 "총력유세" 팝업(FinalDayImmersive)으로 분기한다.
// today는 KST "YYYY-MM-DD"라 문자열 비교가 곧 날짜 비교.
const FINAL_STRETCH_START_ISO = "2026-05-31";
const EXIT_MS = 150;
const DAY_MS = 24 * 60 * 60 * 1000;

// 기기 타임존과 무관하게 항상 KST 기준 "YYYY-MM-DD". en-CA 로케일이 ISO 포맷.
function kstTodayIso(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(
    new Date(),
  );
}

function dowColor(dow: string, dim: boolean): string {
  if (dim) return "#b0b0b0";
  if (dow === "토") return "#2E74D8";
  if (dow === "일") return "#E33C3C";
  return "#1a1a1a";
}

type RowStatus = "past" | "today" | "future";

function Row({
  row,
  status,
  isUpcoming,
  compact,
  rowRef,
}: {
  row: ScheduleRow;
  status: RowStatus;
  isUpcoming: boolean;
  compact: boolean;
  rowRef?: Ref<HTMLDivElement>;
}) {
  const past = status === "past";
  const highlight = status === "today" || isUpcoming;
  const dateCol = compact ? 64 : 84;
  const padY = compact ? 12 : 14;
  const padX = compact ? 14 : 18;

  return (
    <div
      ref={rowRef}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: `${dateCol}px 1fr`,
        gap: compact ? 12 : 16,
        padding: `${padY}px ${padX}px`,
        background: highlight ? "#FFD400" : "#fff",
        borderRadius: highlight ? 14 : 0,
        borderBottom: highlight ? "none" : "1px solid #f0f0f0",
        boxShadow: highlight ? "0 6px 20px -8px rgba(255,180,0,0.55)" : "none",
        opacity: past ? 0.45 : 1,
      }}
    >
      {highlight && (
        <div
          style={{
            position: "absolute",
            top: -10,
            left: padX,
            background: "#1a1a1a",
            color: "#FFD400",
            fontSize: compact ? 10 : 11,
            fontWeight: 800,
            letterSpacing: "0.04em",
            padding: "4px 9px",
            borderRadius: 999,
            lineHeight: 1,
          }}
        >
          {status === "today" ? "● 오늘" : "● 다가오는 일정"}
        </div>
      )}

      {/* 날짜 열 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: compact ? 18 : 22,
            fontWeight: 800,
            color: past ? "#9a9a9a" : "#1a1a1a",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {row.label}
        </div>
        <div
          style={{
            fontSize: compact ? 11 : 12,
            fontWeight: 700,
            color: dowColor(row.dow, past),
            marginTop: 2,
          }}
        >
          ({row.dow})
        </div>
      </div>

      {/* 일정 열 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: compact ? 6 : 7,
          justifyContent: "center",
          minWidth: 0,
        }}
      >
        {row.earlyVote && (
          <div
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              alignItems: "center",
              gap: 4,
              fontSize: compact ? 10 : 11,
              fontWeight: 700,
              color: highlight ? "#1a1a1a" : "#c98800",
              background: highlight
                ? "rgba(26,26,26,0.08)"
                : "rgba(255,212,0,0.18)",
              padding: "3px 8px",
              borderRadius: 6,
              lineHeight: 1,
              marginBottom: 2,
            }}
          >
            🗳 사전투표 독려
          </div>
        )}
        {row.items.map((it, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: compact ? 8 : 10,
              flexWrap: "wrap",
            }}
          >
            {it.kind === "launch" && (
              <span
                style={{
                  fontSize: compact ? 10 : 11,
                  fontWeight: 800,
                  background: highlight ? "#fff" : "#1a1a1a",
                  color: highlight ? "#1a1a1a" : "#FFD400",
                  padding: "2px 7px",
                  borderRadius: 5,
                  lineHeight: 1.3,
                  letterSpacing: "0.02em",
                }}
              >
                출정식
              </span>
            )}
            <span
              style={{
                fontSize: compact ? 14 : 15,
                fontWeight: 700,
                color: "#1a1a1a",
                letterSpacing: "-0.01em",
              }}
            >
              {it.text}
            </span>
            {(it.place || it.time) && (
              <span
                style={{
                  fontSize: compact ? 12 : 13,
                  fontWeight: 500,
                  color: highlight ? "rgba(26,26,26,0.72)" : "#6a6a6a",
                }}
              >
                {it.time && <span style={{ fontWeight: 700 }}>{it.time}</span>}
                {it.time && it.place && (
                  <span style={{ margin: "0 6px", opacity: 0.5 }}>·</span>
                )}
                {it.place && <span>{it.place}</span>}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SchedulePopup() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [compact, setCompact] = useState(false);
  // 닫힌 뒤(또는 자동오픈이 숨김상태로 억제된 뒤) 다시 열 수 있는 FAB 노출 여부.
  const [showFab, setShowFab] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const closeTimer = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null); // 스크롤 영역
  const highlightRef = useRef<HTMLDivElement>(null); // 오늘/다가오는 일정 행

  // 오늘(KST) 날짜 — 마운트 시 1회 확정. SSR/CSR 모두 timeZone 고정이라 결정적.
  const today = useMemo(() => kstTodayIso(), []);
  // 막바지면 일정 리스트 대신 풀블리드 총력유세 팝업으로 분기.
  const finalStretch =
    today >= FINAL_STRETCH_START_ISO && today <= FINAL_DAY_ISO;
  const { todayHasEntry, upcomingDate } = useMemo(() => {
    const has = SCHEDULE.some((r) => r.date === today);
    let upcoming: string | null = null;
    for (const r of SCHEDULE) {
      if (r.date >= today) {
        upcoming = r.date;
        break;
      }
    }
    return { todayHasEntry: has, upcomingDate: upcoming };
  }, [today]);

  // 진입 게이트: 자동 오픈은 숨김기간/캠페인종료가 아닐 때만. (자동오픈 차단은 모두 setOpen 이전)
  // 단, "오늘 하루 보지 않기"로 숨김 상태여도 FAB는 띄워 수동 재열람을 보장.
  useEffect(() => {
    if (CAMPAIGN_OVER) return; // 종료 후엔 팝업도 FAB도 없음
    let hiddenUntil = 0;
    try {
      hiddenUntil = Number(localStorage.getItem(HIDE_KEY)) || 0;
    } catch {
      hiddenUntil = 0;
    }
    // 숨김 상태면 자동 오픈 대신 FAB만 노출, 아니면 자동 오픈.
    // 두 경우 모두 setState를 타이머 콜백 안에서 호출(동기 setState 금지 규칙 + 진입 후 페이드인).
    const hidden = Date.now() < hiddenUntil;
    const t = window.setTimeout(
      () => (hidden ? setShowFab(true) : setOpen(true)),
      OPEN_DELAY_MS,
    );
    return () => window.clearTimeout(t);
  }, []);

  // 뷰포트 PC/모바일 경계 추적.
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const finishClose = useCallback(() => {
    setClosing(false);
    setOpen(false);
    setShowFab(true); // 닫은 뒤엔 항상 FAB로 다시 열 수 있게
  }, []);

  const reopen = useCallback(() => {
    setClosing(false);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      finishClose();
      return;
    }
    setClosing(true);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(finishClose, EXIT_MS);
  }, [finishClose]);

  const hideForToday = useCallback(() => {
    try {
      localStorage.setItem(HIDE_KEY, String(Date.now() + DAY_MS));
    } catch {
      /* 프라이빗 모드 등 — 저장 실패해도 닫기는 진행 */
    }
    close();
  }, [close]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  // body 스크롤 잠금 + SnapScroll 비활성(modalOpen) + 스크롤바 폭 보정 + ESC + 포커스 트랩.
  // open=true일 때만 적용되고, 닫히거나 언마운트되면 cleanup이 반드시 원복한다.
  useEffect(() => {
    if (!open) return;
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
        close();
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
  }, [open, close]);

  // 열릴 때 스크롤 위치 보정: 오늘(또는 다가오는 일정)을 상단으로 끌어올려 가장 잘 보이게.
  // 단, 위에 peek 만큼 여백을 둬 지난 일정이 일부 보이게 → "위로 더 있다"는 어포던스.
  // (지난 일정은 삭제하지 않고 위로 스크롤되어 올라간 상태가 됨.)
  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    if (!list) return;
    const target = highlightRef.current;
    if (!target) {
      // 오늘/다가오는 일정이 없으면(모두 지난 경우) 가장 최근 일정이 보이게 맨 아래로.
      list.scrollTop = list.scrollHeight;
      return;
    }
    // 오늘 위로 지난 일정 약 2개가 보이도록(행 높이 편차와 무관하게 '행 수' 기준).
    // 그보다 더 위에 지난 일정이 있으면 살짝 더 걸쳐 "위로 더 있다"는 힌트.
    // offsetTop 기반(레이아웃값)이라 카드 fade/scale 트랜스폼 영향 안 받음.
    const PAST_VISIBLE = 2;
    const rows = Array.from(list.children) as HTMLElement[];
    const idx = rows.indexOf(target);
    const anchorIdx = Math.max(0, idx - PAST_VISIBLE);
    const anchor = rows[anchorIdx] ?? target;
    const hint = anchorIdx > 0 ? (compact ? 16 : 20) : 0;
    list.scrollTop = Math.max(0, anchor.offsetTop - hint);
  }, [open, compact, today]);

  if (CAMPAIGN_OVER) return null; // 캠페인 종료 후엔 아무것도 렌더 안 함

  // 닫혀 있을 때: 다시 열기 FAB (캠페인 기간 내내). "오늘 하루 보지 않기"와 무관하게 동작.
  if (!open) {
    if (!showFab) return null;
    return (
      <button
        type="button"
        onClick={reopen}
        aria-label="유세일정 다시 보기"
        className="fab-anim"
        style={{
          position: "fixed",
          right: 16,
          bottom: "max(16px, env(safe-area-inset-bottom))",
          zIndex: 90,
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          background: "#FFD400",
          color: "#1a1a1a",
          border: "2px solid #1a1a1a",
          borderRadius: 999,
          padding: compact ? "10px 14px" : "11px 16px",
          fontFamily: PRETENDARD,
          fontWeight: 800,
          fontSize: compact ? 13 : 14,
          letterSpacing: "-0.01em",
          cursor: "pointer",
          boxShadow:
            "0 12px 24px -8px rgba(0,0,0,0.35), 0 4px 8px -4px rgba(0,0,0,0.2)",
          transition: "transform .15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <span aria-hidden style={{ fontSize: compact ? 15 : 16, lineHeight: 1 }}>
          🗓
        </span>
        유세일정
      </button>
    );
  }

  return (
    <div
      // 배경(스크림) — 클릭 시 닫힘. 카드 클릭은 버블되어도 target≠배경이라 무시.
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className={closing ? undefined : "popup-scrim-anim"}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: compact ? "0 12px" : 24,
        // 단색 스크림만 사용. backdrop-filter:blur는 뒤 히어로의 무한 애니메이션
        // (ScrollHint)과 겹치면 매 프레임 전체 화면을 재블러해 GPU 부하가 큼 → 제외.
        background: "rgba(0,0,0,0.6)",
        opacity: closing ? 0 : undefined,
        transition: closing ? `opacity ${EXIT_MS}ms ease-in` : undefined,
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        {...(finalStretch
          ? { "aria-label": "총력유세 안내" }
          : { "aria-labelledby": "schedule-popup-title" })}
        className={closing ? undefined : "popup-card-anim"}
        style={
          finalStretch
            ? {
                // 풀블리드 카드는 자체 bg/radius/shadow/높이를 갖는다.
                // 래퍼는 위치/크기만 잡는 투명 컨테이너.
                width: compact ? "100%" : 960,
                maxWidth: "100%",
                fontFamily: PRETENDARD,
                opacity: closing ? 0 : undefined,
                transform: closing ? "scale(0.98)" : undefined,
                transition: closing
                  ? `opacity ${EXIT_MS}ms ease-in, transform ${EXIT_MS}ms ease-in`
                  : undefined,
              }
            : {
                width: compact ? "100%" : 480,
                maxWidth: "100%",
                maxHeight: compact ? "92vh" : "min(720px, calc(100vh - 48px))",
                background: "#fff",
                borderRadius: compact ? 18 : 22,
                overflow: "hidden",
                boxShadow:
                  "0 30px 80px -20px rgba(0,0,0,0.35), 0 8px 24px -8px rgba(0,0,0,0.18)",
                fontFamily: PRETENDARD,
                color: "#1a1a1a",
                display: "flex",
                flexDirection: "column",
                opacity: closing ? 0 : undefined,
                transform: closing ? "scale(0.98)" : undefined,
                transition: closing
                  ? `opacity ${EXIT_MS}ms ease-in, transform ${EXIT_MS}ms ease-in`
                  : undefined,
              }
        }
      >
        {finalStretch ? (
          <FinalDayImmersive
            compact={compact}
            today={today}
            onClose={close}
            onHideToday={hideForToday}
            closeBtnRef={closeBtnRef}
          />
        ) : (
          <>
        {/* 헤더 */}
        <div
          style={{
            position: "relative",
            background: "#FFD400",
            padding: compact ? "18px 18px 16px" : "22px 24px 20px",
            borderBottom: "3px solid #1a1a1a",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: compact ? 10 : 12,
            }}
          >
            <div
              style={{
                width: compact ? 40 : 46,
                height: compact ? 40 : 46,
                borderRadius: "50%",
                background: "#1a1a1a",
                color: "#FFD400",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: compact ? 22 : 26,
                letterSpacing: "-0.04em",
                flexShrink: 0,
              }}
            >
              5
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: compact ? 10 : 11,
                  fontWeight: 800,
                  color: "#1a1a1a",
                  letterSpacing: "0.12em",
                  opacity: 0.7,
                }}
              >
                JOCHEON · NO.5
              </div>
              <h2
                id="schedule-popup-title"
                style={{
                  margin: 0,
                  fontSize: compact ? 17 : 19,
                  fontWeight: 900,
                  color: "#1a1a1a",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.15,
                  marginTop: 2,
                }}
              >
                김덕홍 후보 선거운동 유세일정
              </h2>
            </div>
          </div>

          {/* 슬로건 줄 */}
          <div
            style={{
              marginTop: compact ? 12 : 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: compact ? 12 : 13,
              fontWeight: 700,
              color: "#1a1a1a",
            }}
          >
            <span
              style={{
                background: "#1a1a1a",
                color: "#FFD400",
                padding: "4px 9px",
                borderRadius: 4,
                letterSpacing: "0.02em",
              }}
            >
              말보다 실천
            </span>
            <span style={{ opacity: 0.75, fontWeight: 600 }}>
              조천읍 도의원 후보 · 5.21 ~ 6.2
            </span>
          </div>

          {/* 닫기 버튼 */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={close}
            aria-label="닫기"
            style={{
              position: "absolute",
              top: compact ? 12 : 14,
              right: compact ? 12 : 14,
              width: compact ? 32 : 34,
              height: compact ? 32 : 34,
              borderRadius: "50%",
              border: "none",
              background: "rgba(26,26,26,0.08)",
              color: "#1a1a1a",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              transition: "background .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(26,26,26,0.16)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(26,26,26,0.08)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 2L12 12M12 2L2 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* 일정 리스트 (스크롤 영역) */}
        <div
          ref={listRef}
          style={{
            position: "relative", // 행 offsetTop 기준이 이 컨테이너가 되도록
            flex: 1,
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            background: "#fafafa",
            padding: compact ? "14px 12px" : "18px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {SCHEDULE.map((row) => {
            const status: RowStatus =
              row.date < today
                ? "past"
                : row.date === today
                  ? "today"
                  : "future";
            const isUpcoming = !todayHasEntry && row.date === upcomingDate;
            const highlight = status === "today" || isUpcoming;
            return (
              <Row
                key={row.date}
                row={row}
                status={status}
                isUpcoming={isUpcoming}
                compact={compact}
                rowRef={highlight ? highlightRef : undefined}
              />
            );
          })}
        </div>

        {/* 푸터 */}
        <div
          style={{
            background: "#1a1a1a",
            color: "#fff",
            padding: compact ? "12px 16px" : "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: compact ? 11 : 12,
              fontWeight: 500,
              color: "rgba(255,255,255,0.65)",
            }}
          >
            일정은 현장 상황에 따라 변경될 수 있습니다.
          </div>
          <button
            type="button"
            onClick={hideForToday}
            style={{
              background: "#FFD400",
              color: "#1a1a1a",
              border: "none",
              padding: compact ? "8px 14px" : "9px 18px",
              borderRadius: 8,
              fontWeight: 800,
              fontSize: compact ? 12 : 13,
              cursor: "pointer",
              letterSpacing: "-0.01em",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            오늘 하루 보지 않기
          </button>
        </div>
          </>
        )}
      </div>
    </div>
  );
}
