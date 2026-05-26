// 유세일정 데이터 — 캠페인 매니저가 직접 수정하는 단일 소스.
// 컴포넌트(SchedulePopup)는 이 배열만 읽으므로, 일정 변경 시 이 파일만 고치면 됩니다.
//
// date: "YYYY-MM-DD" (한국시간 기준 날짜) — 하이라이트/지난일정 판정에 쓰이므로 정확해야 함.
// label: 화면에 보이는 날짜 표기 (예: "5/22").
// dow: 요일 한 글자 ("월"~"일"). 토=파랑, 일=빨강으로 자동 표시.
// earlyVote: true면 "🗳 사전투표 독려" 칩 표시.
// items[].kind: "launch"면 일정명 앞에 "출정식" 라벨 표시.

export type ScheduleItem = {
  /** 일정명 (예: "북촌리") */
  text: string;
  /** 장소 부가설명 (예: "북촌포구"). 없으면 생략 */
  place?: string;
  /** 시각 (예: "19:00"). 없으면 생략 */
  time?: string;
  /** "launch"면 "출정식" 라벨 표시 */
  kind?: "launch";
};

export type ScheduleRow = {
  /** "YYYY-MM-DD" (KST 기준) — 날짜 비교 키 */
  date: string;
  /** 화면 표기 날짜 (예: "5/22") */
  label: string;
  /** 요일 한 글자 (예: "금") */
  dow: string;
  /** 사전투표 독려일 여부 */
  earlyVote?: boolean;
  items: ScheduleItem[];
};

export const SCHEDULE: ScheduleRow[] = [
  {
    date: "2026-05-21",
    label: "5/21",
    dow: "목",
    items: [
      { kind: "launch", text: "선거출정식", place: "조천만세동산", time: "19:00" },
    ],
  },
  {
    date: "2026-05-22",
    label: "5/22",
    dow: "금",
    items: [
      { text: "북촌리", place: "북촌포구", time: "18:00" },
      { text: "선흘1리", place: "리사무소 앞", time: "19:00" },
    ],
  },
  {
    date: "2026-05-23",
    label: "5/23",
    dow: "토",
    items: [
      { text: "교래리", place: "성미가든 앞", time: "18:00" },
      { text: "선흘2리", place: "리사무소 앞", time: "19:00" },
    ],
  },
  {
    date: "2026-05-24",
    label: "5/24",
    dow: "일",
    items: [
      { text: "신흥리", place: "리사무소 앞", time: "18:00" },
      { text: "함덕리", place: "리사무소 앞", time: "19:00" },
    ],
  },
  {
    date: "2026-05-25",
    label: "5/25",
    dow: "월",
    items: [
      { text: "와산리", place: "리사무소 앞", time: "18:00" },
      { text: "대흘1리", place: "리사무소 앞", time: "19:00" },
    ],
  },
  {
    date: "2026-05-26",
    label: "5/26",
    dow: "화",
    items: [
      { text: "대흘2리", place: "리사무소 앞", time: "18:00" },
      { text: "와흘리", place: "회전교차로", time: "19:00" },
    ],
  },
  {
    date: "2026-05-27",
    label: "5/27",
    dow: "수",
    items: [{ text: "신촌리", place: "신촌초 삼거리", time: "19:00" }],
  },
  {
    date: "2026-05-28",
    label: "5/28",
    dow: "목",
    items: [{ text: "각 리별(12개리) 순회 방문", place: "", time: "" }],
  },
  {
    date: "2026-05-29",
    label: "5/29",
    dow: "금",
    earlyVote: true,
    items: [{ text: "각 리별(12개리) 순회 방문", place: "", time: "" }],
  },
  {
    date: "2026-05-30",
    label: "5/30",
    dow: "토",
    earlyVote: true,
    items: [{ text: "각 리별(12개리) 순회 방문", place: "", time: "" }],
  },
  {
    date: "2026-05-31",
    label: "5/31",
    dow: "일",
    items: [{ text: "각 리별(12개리) 순회 방문", place: "", time: "" }],
  },
  {
    date: "2026-06-01",
    label: "6/1",
    dow: "월",
    items: [{ text: "각 리별(12개리) 순회 방문", place: "", time: "" }],
  },
  {
    date: "2026-06-02",
    label: "6/2",
    dow: "화",
    items: [
      { text: "함덕리 리사무소 사거리", place: "거리 감사인사", time: "19:00" },
    ],
  },
];
