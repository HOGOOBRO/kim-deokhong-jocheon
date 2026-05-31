"use client";

import { useEffect, useState, type Ref } from "react";

/**
 * 총력유세 풀블리드 팝업 — 선거운동 막바지(총력유세 D-2 ~ 당일)에 일정 리스트 대신 노출.
 * 디자인 핸드오프: design_handoff_final_rally_popup (hifi).
 *
 * 이 컴포넌트는 카드(시각)만 그린다. 노출 분기/스크롤락/포커스트랩/FAB 등
 * 모달 인프라는 SchedulePopup이 그대로 소유하고, 막바지 기간에만 이 카드를 끼워 넣는다.
 *  - X 버튼 → onClose (세션 한정 닫기)
 *  - "오늘 하루 보지 않기" → onHideToday (영속 숨김)
 *  - closeBtnRef → X 버튼에 부착해 SchedulePopup의 초기 포커스/포커스트랩과 1:1 유지.
 */

const PRETENDARD =
  '"Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
const MONO = 'var(--font-jetbrains-mono), "SFMono-Regular", ui-monospace, "Menlo", monospace';

// 총력유세(선거운동 마지막 날) 및 카운트다운 타깃.
export const FINAL_DAY_ISO = "2026-06-02";
const RALLY_TS = Date.parse("2026-06-02T19:00:00+09:00"); // 총력유세 시작 (카운트다운 타깃)

// today/target("YYYY-MM-DD", KST)로 남은 일수 산출. 5/31→2, 6/1→1, 6/2→0.
export function dDayTo(today: string, target: string): number {
  const a = Date.parse(`${today}T00:00:00+09:00`);
  const b = Date.parse(`${target}T00:00:00+09:00`);
  return Math.max(0, Math.round((b - a) / 86400000));
}

// 1초 틱 카운트다운. open=true 이후에만 마운트되므로 SSR/하이드레이션 영향 없음.
function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  let diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  diff -= d * 86400000;
  const h = Math.floor(diff / 3600000);
  diff -= h * 3600000;
  const m = Math.floor(diff / 60000);
  diff -= m * 60000;
  const s = Math.floor(diff / 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return { d, h: p(h), m: p(m), s: p(s) };
}

// 형식: 시간 : 분 : 초 (일은 시간으로 합산 → 총시간 = d*24 + h, 2자리 0패딩)
function ImmersiveCountdown({ compact }: { compact: boolean }) {
  const { d, h, m, s } = useCountdown(RALLY_TS);
  const totalH = String(d * 24 + parseInt(h, 10)).padStart(2, "0");
  const numFs = compact ? 38 : 52;
  const cell = (val: string, label: string) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span
        style={{
          fontFamily: MONO,
          fontSize: numFs,
          fontWeight: 700,
          color: "#fff",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          textShadow: "0 2px 12px rgba(0,0,0,0.5)",
        }}
      >
        {val}
      </span>
      <span
        style={{
          fontFamily: PRETENDARD,
          fontSize: compact ? 10.5 : 12,
          fontWeight: 500,
          color: "rgba(255,255,255,0.55)",
          marginTop: compact ? -1 : -2,
        }}
      >
        {label}
      </span>
    </div>
  );
  const sep = (
    <span
      style={{
        fontFamily: MONO,
        fontSize: numFs * 0.7,
        fontWeight: 600,
        color: "rgba(255,212,0,0.85)",
        alignSelf: "flex-start",
        lineHeight: 1.1,
      }}
    >
      :
    </span>
  );
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: compact ? 9 : 13 }}>
      {cell(totalH, "시간")}
      {sep}
      {cell(m, "분")}
      {sep}
      {cell(s, "초")}
    </div>
  );
}

// 이미지가 일시적으로 로드 실패(캐시된 404 등)하면 캐시버스트로 한 번 재시도.
function retryImg(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.dataset.retried) return;
  img.dataset.retried = "1";
  const base = img.src.split("?")[0];
  img.src = `${base}?r=${Date.now()}`;
}

export default function FinalDayImmersive({
  compact = false,
  today,
  onClose,
  onHideToday,
  closeBtnRef,
}: {
  compact?: boolean;
  today: string;
  onClose: () => void;
  onHideToday: () => void;
  closeBtnRef?: Ref<HTMLButtonElement>;
}) {
  const W = compact ? "100%" : 960;
  const H = compact ? 660 : 540;
  const dday = dDayTo(today, FINAL_DAY_ISO);
  const ddayLabel = dday <= 0 ? "D-DAY" : `D-${dday}`;
  return (
    <div
      style={{
        width: W,
        maxWidth: "100%",
        height: H,
        position: "relative",
        overflow: "hidden",
        borderRadius: compact ? 20 : 22,
        background: "#000",
        fontFamily: PRETENDARD,
        color: "#fff",
        boxShadow: "0 40px 100px -24px rgba(0,0,0,0.7)",
      }}
    >
      {/* 풀블리드 현장 사진 */}
      <img
        src="/images/rally_fist.png"
        alt="김덕홍 총력유세 현장"
        onError={retryImg}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: compact ? "center 22%" : "center 26%",
        }}
      />
      {/* 가독성 스크림 — 하단 집중, 부드럽게 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: compact
            ? "linear-gradient(to top, rgba(10,10,12,0.82) 0%, rgba(10,10,12,0.6) 28%, rgba(10,10,12,0.25) 50%, rgba(10,10,12,0) 70%)"
            : "linear-gradient(to top, rgba(10,10,12,0.8) 0%, rgba(10,10,12,0.5) 26%, rgba(10,10,12,0.15) 46%, rgba(10,10,12,0) 64%), linear-gradient(to right, rgba(10,10,12,0.45) 0%, transparent 38%)",
        }}
      />
      {/* 텍스트 직하단 한정 추가 보강 (사진이 밝아도 글씨 보장) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          height: compact ? "42%" : "40%",
          background: "linear-gradient(to top, rgba(10,10,12,0.55), transparent)",
        }}
      />

      {/* 닫기 (X) — 세션 한정 */}
      <button
        ref={closeBtnRef}
        type="button"
        onClick={onClose}
        aria-label="닫기"
        style={{
          position: "absolute",
          top: compact ? 13 : 16,
          right: compact ? 13 : 16,
          zIndex: 6,
          width: compact ? 30 : 32,
          height: compact ? 30 : 32,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.18)",
          background: "rgba(0,0,0,0.32)",
          color: "rgba(255,255,255,0.75)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          backdropFilter: "blur(4px)",
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

      {/* 콘텐츠 — 하단 정렬 (PC: 텍스트는 좌측 62%, 푸터는 풀폭) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 4,
          padding: compact ? "0 24px 22px" : "0 48px 30px 48px",
          display: "flex",
          flexDirection: "column",
          gap: compact ? 14 : 18,
        }}
      >
        {/* 텍스트 블록 — 좌측 컬럼 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: compact ? 14 : 18,
            maxWidth: compact ? "100%" : "62%",
          }}
        >
          {/* eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span
              style={{
                background: "#FFD400",
                color: "#1a1a1a",
                fontWeight: 900,
                fontSize: compact ? 11.5 : 13,
                letterSpacing: "-0.01em",
                padding: compact ? "4px 10px" : "5px 12px",
                borderRadius: 999,
              }}
            >
              마지막 총력유세
            </span>
            <span
              style={{
                fontSize: compact ? 11.5 : 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              <span style={{ fontFamily: MONO, fontWeight: 700 }}>{ddayLabel}</span>
            </span>
          </div>

          {/* 헤드라인 — 옐로 총력유세 단일 포커스 */}
          <div>
            <div
              style={{
                fontSize: compact ? 54 : 78,
                fontWeight: 900,
                color: "#FFD400",
                letterSpacing: "0.02em",
                lineHeight: 0.96,
                textShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              총력유세
            </div>
            <div
              style={{
                fontSize: compact ? 19 : 25,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginTop: compact ? 8 : 10,
                lineHeight: 1.25,
                textShadow: "0 2px 12px rgba(0,0,0,0.55)",
              }}
            >
              끝까지 함께 뛰겠습니다
            </div>
          </div>

          {/* date · place */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: compact ? 9 : 12,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: compact ? 14 : 16,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.01em",
                textShadow: "0 1px 8px rgba(0,0,0,0.6)",
              }}
            >
              <span style={{ fontFamily: MONO, fontWeight: 700 }}>6.2</span>
              <span style={{ fontWeight: 600, opacity: 0.8, margin: "0 4px" }}>(화)</span>
              <span style={{ fontFamily: MONO, fontWeight: 700 }}>19:00</span>
            </span>
            <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.28)" }} />
            <span
              style={{
                fontSize: compact ? 13.5 : 15,
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "-0.01em",
                textShadow: "0 1px 8px rgba(0,0,0,0.6)",
              }}
            >
              함덕리 리사무소 사거리
            </span>
          </div>

          {/* 카운트다운 */}
          <ImmersiveCountdown compact={compact} />
        </div>

        {/* 푸터 — 기호5 + 닫기 (풀폭: 닫기는 우측 끝) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: compact ? 2 : 4,
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
            <span
              style={{
                width: compact ? 20 : 22,
                height: compact ? 20 : 22,
                borderRadius: "50%",
                background: "#FFD400",
                color: "#1a1a1a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: compact ? 12 : 13,
                letterSpacing: "-0.04em",
              }}
            >
              5
            </span>
            <span
              style={{
                fontSize: compact ? 13 : 14,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.01em",
              }}
            >
              무소속, 기호 5번 김덕홍
            </span>
          </span>
          <button
            type="button"
            onClick={onHideToday}
            style={{
              marginLeft: "auto",
              background: "transparent",
              color: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(255,255,255,0.22)",
              padding: compact ? "7px 13px" : "8px 16px",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: compact ? 11 : 12,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            오늘 하루 보지 않기
          </button>
        </div>
      </div>
    </div>
  );
}
