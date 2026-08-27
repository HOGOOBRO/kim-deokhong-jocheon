#!/usr/bin/env bash
# 히어로 제목 전용 세리프 서브셋 생성기
#
# 홈 첫 화면(히어로 제목 + 키비주얼 캡션 이름)에 쓰이는 글자만 담은
# Noto Serif KR 600 서브셋을 만들어 app/hero-font.css에 data URI로 심는다.
#
# 왜 이렇게 하는가:
#  - 구글 폰트 CDN을 그대로 쓰면 CSS 70KB를 받아 해석한 뒤에야 제목에 필요한
#    폰트 조각 6개(약 207KB)를 다시 받는다. 그 사이 한글은 대체 고딕으로
#    그려지므로 가장 큰 글자인 제목이 고딕에서 세리프로 바뀌는 게 보인다.
#  - 별도 파일로 두고 preload만 걸면 264KB짜리 히어로 사진에 밀려 대기가
#    생긴다(라이브 실측 287ms 대기). CSS 안에 넣으면 CSS가 도착하는 순간
#    바로 쓸 수 있어 대기가 없다. 5KB라 CSS에 넣어도 부담이 없다.
#
# 제목 문구를 바꾸면 아래 HERO_TEXT를 고치고 이 스크립트를 다시 실행할 것.
# app/hero-font.css는 이 스크립트가 통째로 다시 쓰므로 직접 고치지 말 것.
#
# 폰트 라이선스: Noto Serif KR, SIL Open Font License 1.1 (자가 호스팅 허용)
set -euo pipefail

cd "$(dirname "$0")/.."

# app/page.tsx의 <h1 id="hero-title">와 .hero-keyvisual figcaption strong 내용
HERO_TEXT='현장에서 듣고, 의정으로 답합니다.김덕홍'
OUT='app/hero-font.css'
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'

TEXT_PARAM=$(HERO_TEXT="$HERO_TEXT" python3 -c "
import os, urllib.parse
chars = sorted(set(os.environ['HERO_TEXT']) - {' '})
print(urllib.parse.quote(''.join(chars)))
")

CSS=$(curl -fsS -A "$UA" "https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@600&text=${TEXT_PARAM}")
URL=$(printf '%s' "$CSS" | grep -o 'url([^)]*)' | sed 's/^url(//;s/)$//')
RANGE=$(printf '%s' "$CSS" | grep -o 'unicode-range: [^;]*' | sed 's/unicode-range: //')

TMP=$(mktemp -t hero-font)
curl -fsS -o "$TMP" "$URL"
RAW=$(wc -c < "$TMP" | tr -d ' ')
B64=$(base64 < "$TMP" | tr -d '\n')
rm -f "$TMP"

cat > "$OUT" <<CSSEOF
/* 첫 화면 제목 전용 세리프 서브셋 — scripts/build-hero-font.sh가 생성. 직접 고치지 말 것.
   담긴 글자: $HERO_TEXT
   CSS 안에 폰트를 심어 두면 CSS가 도착하는 순간 바로 쓸 수 있어,
   제목이 대체 고딕으로 그려졌다가 세리프로 바뀌는 구간이 없다.
   Noto Serif KR, SIL Open Font License 1.1 */
@font-face {
  font-family: "NotoSerifKR Hero";
  font-style: normal;
  font-weight: 600;
  font-display: block;
  unicode-range: $RANGE;
  src: url(data:font/woff2;base64,$B64) format("woff2");
}
CSSEOF

echo "생성: $OUT (원본 woff2 ${RAW} bytes → data URI 포함 $(wc -c < "$OUT" | tr -d ' ') bytes)"
echo "담긴 글자: $HERO_TEXT"
