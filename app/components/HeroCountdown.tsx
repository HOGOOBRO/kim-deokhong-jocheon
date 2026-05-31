"use client";

import { useEffect, useState } from "react";

/**
 * 키비주얼 카운트다운 — 전국동시지방선거 투표 마감(2026-06-03 18:00 KST)까지
 * 남은 시간(시간:분:초)을 매초 갱신해 보여준다.
 *
 * - 디자인: Figma 338:242 / 338:366 (JetBrains Mono, 시간:분:초 + 라벨).
 * - 크기는 부모 포스터의 컨테이너 쿼리(cqw)에 맞춰 prop으로 주입 → PC/모바일 동일 컴포넌트 재사용.
 * - 남은 시간은 절대시각(ms) − Date.now() 라 기기 타임존과 무관. 마감 후엔 00:00:00로 고정.
 * - 하이드레이션: SSR/최초 클라이언트 렌더는 동일한 "00" 플레이스홀더 → 불일치 없음.
 *   setState는 effect 본문이 아니라 rAF/interval 콜백에서만 호출(this Next의 set-state-in-effect 빌드에러 회피).
 */

const TARGET_MS = Date.parse("2026-06-03T18:00:00+09:00");

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function Unit({
  value,
  label,
  digitStyle,
  labelStyle,
}: {
  value: string;
  label: string;
  digitStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
}) {
  return (
    <span className="flex flex-col items-center leading-none">
      <span style={digitStyle}>{value}</span>
      <span style={labelStyle}>{label}</span>
    </span>
  );
}

type Props = {
  /** 숫자 글자 크기 (cqw 등 CSS length) */
  digitSize: string;
  /** 콜론(:) 글자 크기 */
  colonSize: string;
  /** 라벨(시간/분/초) 글자 크기 */
  labelSize: string;
  /** 칸 사이 간격 */
  gap: string;
  /** 라벨과 숫자 사이 간격 */
  labelGap: string;
  className?: string;
};

export default function HeroCountdown({
  digitSize,
  colonSize,
  labelSize,
  gap,
  labelGap,
  className,
}: Props) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, TARGET_MS - Date.now()));
    // 최초 1회는 rAF로(직접 setState 회피), 이후 매초 interval.
    const raf = requestAnimationFrame(tick);
    const id = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  const total = remaining == null ? null : Math.floor(remaining / 1000);
  const hh = total == null ? "00" : pad2(Math.floor(total / 3600));
  const mm = total == null ? "00" : pad2(Math.floor(total / 60) % 60);
  const ss = total == null ? "00" : pad2(total % 60);

  const digitStyle: React.CSSProperties = {
    fontFamily: "var(--font-jetbrains-mono), monospace",
    fontSize: digitSize,
    lineHeight: 1,
    letterSpacing: "-0.03em",
    color: "#ffffff",
    fontVariantNumeric: "tabular-nums",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "Pretendard, sans-serif",
    fontSize: labelSize,
    fontWeight: 700,
    letterSpacing: "-0.03em",
    color: "#aaaaaa",
    marginTop: labelGap,
  };
  // 콜론은 숫자 높이(=digitSize, line-height 1)의 세로 중앙에 정렬
  const colonStyle: React.CSSProperties = {
    fontFamily: "var(--font-jetbrains-mono), monospace",
    fontSize: colonSize,
    lineHeight: 1,
    color: "#ffffff",
    height: digitSize,
    display: "flex",
    alignItems: "center",
  };

  return (
    <div
      className={className}
      style={{ display: "flex", gap, alignItems: "flex-start" }}
      aria-label="투표 마감까지 남은 시간"
    >
      <Unit value={hh} label="시간" digitStyle={digitStyle} labelStyle={labelStyle} />
      <span style={colonStyle}>:</span>
      <Unit value={mm} label="분" digitStyle={digitStyle} labelStyle={labelStyle} />
      <span style={colonStyle}>:</span>
      <Unit value={ss} label="초" digitStyle={digitStyle} labelStyle={labelStyle} />
    </div>
  );
}
