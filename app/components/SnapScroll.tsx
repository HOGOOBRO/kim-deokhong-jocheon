"use client";
import { useEffect, useRef } from "react";

/**
 * 스냅 스크롤은 Hero(key-visual)와 Policies 영역 내부에서만 동작.
 * 그 외 섹션(overview, quote, posts, footer)은 일반 스크롤.
 *
 * - Hero zone: scrollY ∈ [0, heroBottom)
 *   스냅 포인트: [0, heroBottom]
 * - Policies zone: scrollY ∈ [policiesTop, policiesBottom)
 *   스냅 포인트: 4 policy 인덱스 + policiesBottom(다음 섹션으로 빠져나가는 출구)
 */
export default function SnapScroll() {
  const animatingRef = useRef(false);
  const touchYRef = useRef<number | null>(null);

  useEffect(() => {
    const COOLDOWN_MS = 850;
    const WHEEL_THRESHOLD = 12;
    const TOUCH_THRESHOLD = 40;

    type Zone = { points: number[]; in: boolean };

    const computeZone = (): Zone => {
      const hero = document.getElementById("hero");
      const policies = document.getElementById("policies");
      if (!hero || !policies) return { points: [], in: false };

      const y = window.scrollY;
      const vh = window.innerHeight;
      const heroTop = hero.getBoundingClientRect().top + y;
      const heroBottom = heroTop + hero.offsetHeight;
      const policiesTop = policies.getBoundingClientRect().top + y;
      const policiesBottom = policiesTop + policies.offsetHeight;

      if (y < heroBottom) {
        return { points: [heroTop, heroBottom], in: true };
      }
      if (y >= policiesTop && y < policiesBottom) {
        const points = [
          policiesTop,
          policiesTop + vh,
          policiesTop + vh * 2,
          policiesTop + vh * 3,
          policiesBottom,
        ];
        return { points, in: true };
      }
      return { points: [], in: false };
    };

    const findIndex = (points: number[], y: number) => {
      const tol = 5;
      for (let i = points.length - 1; i >= 0; i--) {
        if (points[i] <= y + tol) return i;
      }
      return 0;
    };

    const snapTo = (y: number) => {
      animatingRef.current = true;
      window.scrollTo({ top: y, behavior: "smooth" });
      window.setTimeout(() => {
        animatingRef.current = false;
      }, COOLDOWN_MS);
    };

    const planSnap = (deltaSign: 1 | -1): number | null => {
      const zone = computeZone();
      if (!zone.in || zone.points.length === 0) return null;
      const y = window.scrollY;
      const idx = findIndex(zone.points, y);
      let nextIdx = idx;
      if (deltaSign > 0 && idx < zone.points.length - 1) nextIdx = idx + 1;
      else if (deltaSign < 0 && idx > 0) nextIdx = idx - 1;
      if (nextIdx === idx) return null;
      return zone.points[nextIdx];
    };

    const onWheel = (e: WheelEvent) => {
      if (animatingRef.current) {
        e.preventDefault();
        return;
      }
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      const target = planSnap(e.deltaY > 0 ? 1 : -1);
      if (target == null) return; // outside snap zones → let normal scroll happen
      e.preventDefault();
      snapTo(target);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchYRef.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (animatingRef.current) {
        e.preventDefault();
        return;
      }
      const start = touchYRef.current;
      const cur = e.touches[0]?.clientY;
      if (start == null || cur == null) return;
      const dy = start - cur;
      if (Math.abs(dy) < TOUCH_THRESHOLD) return;
      const target = planSnap(dy > 0 ? 1 : -1);
      if (target == null) return;
      e.preventDefault();
      snapTo(target);
      touchYRef.current = null;
    };

    const onKey = (e: KeyboardEvent) => {
      if (animatingRef.current) return;
      const isDown = e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ";
      const isUp = e.key === "ArrowUp" || e.key === "PageUp";
      if (!isDown && !isUp) return;
      const target = planSnap(isDown ? 1 : -1);
      if (target == null) return;
      e.preventDefault();
      snapTo(target);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}
