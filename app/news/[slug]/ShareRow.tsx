"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// 카카오 JavaScript 키 (공개용 클라이언트 키 — 카카오 콘솔의 도메인 등록으로 사용처가 잠김).
// GA 측정ID와 동일하게 코드 상수로 관리.
const KAKAO_JS_KEY = "1d46eefd4b3f20265768adfd032ee366";
const KAKAO_SDK_SRC = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    Kakao?: any;
  }
}

type ShareRowProps = {
  url: string; // 절대 URL (https://deokhong.com/news/...)
  title: string;
  description: string;
  image?: string; // 절대 URL
};

function IconBadge({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-[5px] shrink-0"
      style={{ background: bg }}
    >
      {children}
    </span>
  );
}

const KakaoIcon = () => (
  <IconBadge bg="#FEE500">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#3C1E1E" aria-hidden>
      <path d="M12 3.5C6.75 3.5 2.5 6.86 2.5 11c0 2.64 1.74 4.96 4.36 6.29-.19.69-.69 2.5-.79 2.89-.12.48.18.47.37.34.15-.1 2.39-1.62 3.36-2.28.59.09 1.2.13 1.8.13 5.25 0 9.5-3.36 9.5-7.5S17.25 3.5 12 3.5z" />
    </svg>
  </IconBadge>
);

const FacebookIcon = () => (
  <IconBadge bg="#1877F2">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff" aria-hidden>
      <path d="M13.4 21v-7.05h2.37l.355-2.75H13.4V9.44c0-.8.22-1.34 1.37-1.34h1.46V5.64c-.25-.03-1.12-.11-2.13-.11-2.1 0-3.55 1.29-3.55 3.65v2.02H8.18v2.75h2.37V21h2.85z" />
    </svg>
  </IconBadge>
);

const XIcon = () => (
  <IconBadge bg="#000000">
    <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff" aria-hidden>
      <path d="M17.53 3h2.74l-5.99 6.84L21.5 21h-5.5l-4.3-5.62L6.78 21H4.04l6.4-7.32L3 3h5.64l3.89 5.14L17.53 3zm-.96 16.2h1.52L7.5 4.7H5.87L16.57 19.2z" />
    </svg>
  </IconBadge>
);

const LinkIcon = () => (
  <IconBadge bg="#1a1a1a">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff" aria-hidden>
      <path d="M17 7H13V9H17C18.65 9 20 10.35 20 12C20 13.65 18.65 15 17 15H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7ZM11 15H7C5.35 15 4 13.65 4 12C4 10.35 5.35 9 7 9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15ZM8 11H16V13H8V11Z" />
    </svg>
  </IconBadge>
);

export default function ShareRow({ url, title, description, image }: ShareRowProps) {
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 카카오 SDK 1회 로드 + init (effect 본문에서 setState 호출 안 함)
  useEffect(() => {
    const init = () => {
      try {
        if (window.Kakao && !window.Kakao.isInitialized()) {
          window.Kakao.init(KAKAO_JS_KEY);
        }
      } catch {
        /* 폴백으로 처리 */
      }
    };
    if (window.Kakao) {
      init();
      return;
    }
    const existing = document.getElementById("kakao-sdk") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", init);
      return () => existing.removeEventListener("load", init);
    }
    const s = document.createElement("script");
    s.id = "kakao-sdk";
    s.src = KAKAO_SDK_SRC;
    s.async = true;
    s.crossOrigin = "anonymous";
    s.addEventListener("load", init);
    document.head.appendChild(s);
    return () => s.removeEventListener("load", init);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 1800);
  }, []);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      showToast("링크가 복사되었습니다");
    } catch {
      showToast("복사에 실패했습니다");
    }
  }, [url, showToast]);

  const nativeOrCopy = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: description, url });
        return;
      } catch {
        return; // 사용자가 취소 → 무시
      }
    }
    await copyLink();
  }, [title, description, url, copyLink]);

  const shareKakao = useCallback(() => {
    const K = window.Kakao;
    if (K && K.isInitialized?.() && K.Share) {
      try {
        K.Share.sendDefault({
          objectType: "feed",
          content: {
            title,
            description,
            imageUrl: image ?? "",
            link: { mobileWebUrl: url, webUrl: url },
          },
          buttons: [
            { title: "자세히 보기", link: { mobileWebUrl: url, webUrl: url } },
          ],
        });
        return;
      } catch {
        /* 도메인 미등록 등 → 폴백 */
      }
    }
    void nativeOrCopy();
  }, [title, description, image, url, nativeOrCopy]);

  const openPopup = useCallback((href: string) => {
    window.open(href, "_blank", "noopener,noreferrer,width=600,height=600");
  }, []);

  const shareFacebook = useCallback(() => {
    openPopup(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
  }, [url, openPopup]);

  const shareX = useCallback(() => {
    openPopup(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    );
  }, [title, url, openPopup]);

  const btnClass =
    "inline-flex items-center gap-1.5 pl-2 pr-3 py-1.5 md:py-2 border border-[#eaeaea] bg-white rounded-full text-[12px] md:text-[13px] font-bold text-[#1a1a1a] tracking-[-0.01em] cursor-pointer transition-colors [@media(hover:hover)]:hover:bg-[#f6f6f6]";

  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      <span className="text-[11px] md:text-[12px] font-bold tracking-[0.14em] text-[#9a9a9a] mr-1">
        공유
      </span>
      <button type="button" onClick={shareKakao} aria-label="카카오톡으로 공유" className={btnClass}>
        <KakaoIcon />
        카카오톡
      </button>
      <button type="button" onClick={shareFacebook} aria-label="페이스북으로 공유" className={btnClass}>
        <FacebookIcon />
        페이스북
      </button>
      <button type="button" onClick={shareX} aria-label="X(트위터)로 공유" className={btnClass}>
        <XIcon />X
      </button>
      <button type="button" onClick={copyLink} aria-label="링크 복사" className={btnClass}>
        <LinkIcon />
        링크 복사
      </button>

      {toast ? (
        <div
          role="status"
          className="fixed left-1/2 bottom-7 -translate-x-1/2 z-[300] bg-[#1a1a1a] text-white text-[13px] font-bold tracking-[-0.01em] px-4 py-2.5 rounded-full shadow-lg"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
