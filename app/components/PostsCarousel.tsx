"use client";
import { useEffect, useRef, useState } from "react";

export interface Post {
  img: string;
  imgH: number;
  category: string;
  title: string;
  tags: string[];
  url: string;
}

const INSTAGRAM_CHANNEL_URL =
  "https://www.instagram.com/dukhong4jocheon?igsh=bm1lanYyeXd2OXJs";

export default function PostsCarousel({ posts }: { posts: Post[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [visibleRatio, setVisibleRatio] = useState(0.36);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      if (track.scrollWidth > 0) {
        setVisibleRatio(track.clientWidth / track.scrollWidth);
      }
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.max(0, Math.min(1, track.scrollLeft / max)));
    };

    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Progress bar fill width — shows scrolled portion (Figma: 480/1320 ≈ 36% at start)
  const fillWidth = visibleRatio + (1 - visibleRatio) * progress;

  return (
    <section className="bg-white w-full">
      {/* Header (1440 max-width centered) — Figma: pt:120, pb:60 (cards start at y=245) */}
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-start justify-between gap-4 px-4 sm:px-8 lg:px-[60px] pt-[80px] lg:pt-[120px] pb-[40px] lg:pb-[60px]">
          <h2
            className="font-bold text-[#1c1c1c] text-[28px] sm:text-[40px] lg:text-[52px] leading-[1.25]"
            style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.02em" }}
          >
            듣고, 기록하고, 약속합니다
          </h2>
          <a
            href={INSTAGRAM_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block bg-black text-white text-[14px] lg:text-[18px] px-5 lg:px-6 py-2.5 lg:py-3 rounded-full whitespace-nowrap hover:bg-[#333] transition-colors shrink-0"
            style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.01em" }}
          >
            포스팅 전체보기
          </a>
        </div>
      </div>

      {/* Scrollable card track (aligned to 1440 content area) */}
      <div
        ref={trackRef}
        className="max-w-[1440px] mx-auto flex gap-4 sm:gap-6 overflow-x-auto pl-4 sm:pl-8 lg:pl-[60px] pr-4 sm:pr-8 lg:pr-[60px] no-scrollbar"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {posts.map((post, i) => (
          <div
            key={i}
            data-card
            className="flex flex-col gap-6 lg:gap-10 shrink-0 group"
            style={{
              width: "clamp(280px, 78vw, 424px)",
              scrollSnapAlign: "start",
            }}
          >
            {/* Image — linked. object-bottom anchors taller source images (Figma image 5286/5288: y=-106 within square frame) */}
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={post.title.replace(/\n/g, " ")}
              className="bg-[#242424] overflow-hidden relative w-full block"
              style={{
                height: `clamp(${Math.round(post.imgH * 0.55)}px, ${(post.imgH / 1440) * 100}vw, ${post.imgH}px)`,
              }}
            >
              <img
                src={post.img}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover object-bottom group-hover:scale-105 transition-transform duration-500"
              />
            </a>
            <div className="flex flex-col gap-2 text-black">
              <div className="flex flex-col gap-2 lg:gap-3">
                <p
                  className="text-[15px] lg:text-[18px] leading-[1.5]"
                  style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.01em" }}
                >
                  {post.category}
                </p>
                {/* Title — linked */}
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[22px] lg:text-[28px] leading-[1.25] whitespace-pre-line hover:underline underline-offset-4 decoration-2"
                  style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.02em" }}
                >
                  {post.title}
                </a>
              </div>
              <div className="flex gap-[8px] lg:gap-[10px] items-center flex-wrap">
                {post.tags.map((tag) => (
                  <p
                    key={tag}
                    className="text-[14px] lg:text-[18px] leading-[1.5] whitespace-nowrap"
                    style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.01em" }}
                  >
                    {tag}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile "전체보기" button */}
      <div className="flex justify-center mt-8 sm:hidden px-4">
        <a
          href={INSTAGRAM_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white text-[16px] px-6 py-3 rounded-full w-full text-center hover:bg-[#333] transition-colors"
          style={{ fontFamily: "Pretendard, sans-serif" }}
        >
          포스팅 전체보기
        </a>
      </div>

      {/* Single progress bar (1440 max-width centered, Figma style) */}
      <div className="max-w-[1440px] mx-auto">
        <div className="px-4 sm:px-8 lg:px-[60px] pt-12 lg:pt-[120px] pb-[60px] lg:pb-[120px]">
          <div className="relative w-full h-1 bg-[#ddd] rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-1 bg-black rounded-full transition-[width] duration-150"
              style={{ width: `${fillWidth * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
