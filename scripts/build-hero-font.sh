#!/usr/bin/env bash
# 히어로 제목 전용 세리프 서브셋 생성기
#
# 홈 첫 화면(히어로 제목 + 키비주얼 캡션 이름)에 쓰이는 글자만 담은
# Noto Serif KR 600 서브셋을 만들어 public/fonts/ 에 저장한다.
# 구글 폰트 CDN을 그대로 쓰면 CSS(70KB) → 폰트 조각 6개(약 207KB)를
# 차례로 받아야 해서 그 사이 제목이 고딕으로 그려졌다가 세리프로 바뀐다.
# 이 파일은 4~5KB라 preload로 미리 받아둘 수 있어 첫 화면부터 세리프로 그려진다.
#
# 제목 문구를 바꾸면 아래 HERO_TEXT를 고치고 이 스크립트를 다시 실행한 뒤,
# 출력된 unicode-range를 app/globals.css의 @font-face에 반영할 것.
#
# 폰트 라이선스: Noto Serif KR, SIL Open Font License 1.1 (자가 호스팅 허용)
set -euo pipefail

cd "$(dirname "$0")/.."

# app/page.tsx의 <h1 id="hero-title">와 .hero-keyvisual figcaption strong 내용
HERO_TEXT='현장에서 듣고, 의정으로 답합니다.김덕홍'
OUT='public/fonts/noto-serif-kr-hero-600.woff2'
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'

TEXT_PARAM=$(HERO_TEXT="$HERO_TEXT" python3 -c "
import os, urllib.parse
chars = sorted(set(os.environ['HERO_TEXT']) - {' '})
print(urllib.parse.quote(''.join(chars)))
")

CSS=$(curl -fsS -A "$UA" "https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@600&text=${TEXT_PARAM}")
URL=$(printf '%s' "$CSS" | grep -o 'url([^)]*)' | sed 's/^url(//;s/)$//')

curl -fsS -o "$OUT" "$URL"

echo "생성: $OUT ($(wc -c < "$OUT" | tr -d ' ') bytes)"
echo
echo "app/globals.css의 @font-face에 넣을 unicode-range:"
printf '%s\n' "$CSS" | grep 'unicode-range'
