// 보도자료/소식 데이터 — 운영팀 편집용.
// 새 자료 추가: NEWS 배열에 Article 1개 + (이미지 있으면) public/images/news/{id}-pc.jpg,-mo.jpg.
// id 가 카논키(URL /news/{id}-{slug}). slug 는 나중에 바꿔도 자동 308 redirect.
// category: "보도자료"(캠페인 자체 발표·전문) / "언론보도"(언론사 기사 요약+원문링크).
// 표시 순서는 항상 발행일 역순(getAllArticles). 이미지 있는 최신글이 featured.

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; cite: string }
  | { type: "list"; items: string[] };

export interface Article {
  id: number; // URL 키 (카논키)
  slug: string; // 영문 kebab-case
  category: "보도자료" | "언론보도";
  title: string;
  lead: string; // 카드 리드 = meta description = OG description (100~150자)
  date: string; // ISO 'YYYY-MM-DD'
  source: string; // 언론사명 또는 '김덕홍 캠페인'
  sourceUrl?: string; // 외부 원문 링크 (있을 때만 "원문 보기")
  heroPc?: string; // 데스크톱 키비주얼 (서빙 경로)
  heroMo?: string; // 모바일 키비주얼
  heroAlt: string; // 대체 텍스트 + placeholder 라벨
  hasHero: boolean;
  body: ArticleBlock[];
}

export const NEWS: Article[] = [
  // ── 사랑방 포럼·참여정치 (헤드라인제주 보도) — featured, 키비주얼 적용 ──
  {
    id: 16,
    slug: "resident-participation-forum",
    category: "언론보도",
    title: '김덕홍 후보 "주민참여 사랑방 포럼 운영 활성화" 공약',
    lead:
      "김덕홍 후보(기호 5번·무소속)가 5월 25일 주민이 직접 지역 현안을 논의하는 '조천읍 주민참여 사랑방 포럼' 운영 활성화 공약을 발표했다. 다양한 계층이 참여하는 열린 소통 플랫폼으로 주민 중심의 참여정치를 실현하겠다는 구상이다.",
    date: "2026-05-25",
    source: "헤드라인 제주",
    sourceUrl:
      "https://www.headlinejeju.co.kr/news/articleView.html?idxno=593303",
    heroPc: "/images/news/16-pc.jpg",
    heroMo: "/images/news/16-mo.jpg",
    heroAlt: "주민참여 사랑방 포럼 공약을 발표하는 김덕홍 후보",
    hasHero: true,
    body: [
      {
        type: "p",
        text: "김덕홍 후보(기호 5번·무소속)가 5월 25일 주민이 직접 지역 현안 논의에 참여하는 '조천읍 주민참여 사랑방 포럼' 운영 활성화 공약을 발표했다. 2022년 조천읍장 임기를 마친 뒤에도 4년간 조천읍 12개 리를 돌며 쌓은 주민 청취 기록을 정책으로 전환한 구상이다.",
      },
      {
        type: "quote",
        text: "주민이 직접 참여하는 생활밀착형 소통 구조를 통해 마을 현안을 논의하고 정책으로 연결하는 주민 중심의 참여정치를 실현하겠다",
        cite: "김덕홍 후보",
      },
      {
        type: "list",
        items: [
          "주민·청년·어르신·농어업인·소상공인·이주민 등 다양한 계층 참여 플랫폼 구축",
          "제주도·행정시·관계기관과의 협력 체계 구축",
          "포럼 논의의 정책 반영 및 사업 추진 연계",
        ],
      },
      {
        type: "quote",
        text: "사랑방 포럼은 주민·청년·어르신·농어업인·소상공인·이주민 등 다양한 계층이 함께 참여해 지역 문제를 공유하고 해결 방안을 모색하는 열린 소통 플랫폼으로 운영하겠다",
        cite: "김덕홍 후보",
      },
    ],
  },

  // ── 중산간 생활인프라 (헤드라인제주 보도) — 키비주얼 적용 ──
  {
    id: 1,
    slug: "jocheon-jungsangan-infra",
    category: "언론보도",
    title: '김덕홍 후보 "조천읍 중산간 생활인프라 강화…더 안전하고 편리하게"',
    lead:
      "김덕홍 후보(기호 5번·무소속)가 5월 23일 조천읍 중산간 지역의 생활 인프라 강화 정책을 발표했다. 도로·상하수도 등 기반시설을 확충해 주민들이 더 안전하고 편리하게 생활할 수 있도록 하겠다는 구상이다.",
    date: "2026-05-23",
    source: "헤드라인 제주",
    sourceUrl:
      "https://www.headlinejeju.co.kr/news/articleView.html?idxno=593244",
    heroPc: "/images/news/01-pc.jpg",
    heroMo: "/images/news/01-mo.jpg",
    heroAlt: "조천읍 중산간 마을 밭에서 농민들과 인사하는 김덕홍 후보",
    hasHero: true,
    body: [
      {
        type: "p",
        text: "김덕홍 후보(기호 5번·무소속)는 5월 23일 조천읍 중산간 지역의 생활 인프라를 강화하는 정책을 발표했다. 도로와 상·하수도 등 기반시설이 상대적으로 부족한 중산간 마을의 생활 여건을 개선하는 데 행정력을 집중하겠다는 것이다.",
      },
      {
        type: "quote",
        text: "중산간 지역은 도로와 상·하수도 등 생활 인프라가 상대적으로 부족해 주민 불편이 지속되고 있다",
        cite: "김덕홍 후보",
      },
      {
        type: "h2",
        text: "도로·상하수도부터 마을버스까지, 생활 기반시설 확충",
      },
      {
        type: "p",
        text: "김 후보가 제시한 과제는 ▲중산간 비포장 도로·농로 포장 확대 ▲배수시설 정비를 통한 침수 예방 ▲안정적인 상수도 공급망 확충 ▲노후 하수처리시설 현대화 ▲마을 환경 정비 ▲지능형 교통안전시설 확충 ▲수요맞춤형 마을버스 도입 등이다.",
      },
      {
        type: "quote",
        text: "주민들이 더욱 안전하고 편리하게 생활할 수 있도록 기반시설 개선에 행정력을 집중하겠다",
        cite: "김덕홍 후보",
      },
      {
        type: "p",
        text: '김 후보는 중산간 마을을 "조천읍의 소중한 삶의 터전이자 농업과 자연환경을 지키는 중요한 지역"이라고 강조했다.',
      },
    ],
  },

  // ── 중산간 (제주의소리 보도) ──
  {
    id: 2,
    slug: "jungsangan-living-infrastructure",
    category: "언론보도",
    title: '조천 김덕홍, 중산간 생활기반시설 확충 약속',
    lead:
      "김덕홍 후보(기호 5번·무소속)가 중산간 지역의 생활 인프라 부족 문제 해결을 공약으로 제시했다. 비포장 도로 포장, 배수시설 정비, 상수도 공급망 확충 등 지역 맞춤형 정책을 강조했다.",
    date: "2026-05-23",
    source: "제주의소리",
    sourceUrl: "https://www.jejusori.net/news/articleView.html?idxno=503195",
    heroPc: "/images/news/02-pc.jpg",
    heroMo: "/images/news/02-mo.jpg",
    heroAlt: "중산간 생활기반시설 확충 공약을 발표하는 김덕홍 후보",
    hasHero: true,
    body: [
      {
        type: "p",
        text: "김덕홍 후보(기호 5번·무소속)가 상대적으로 생활 인프라가 부족한 중산간 지역을 중심으로 기반시설을 개선하겠다는 생활기반시설 확충 공약을 발표했다.",
      },
      {
        type: "list",
        items: [
          "중산간 비포장 도로·농로 포장 확대",
          "배수시설 정비를 통한 침수 예방",
          "상수도 공급망 확충",
          "노후 하수처리시설 현대화",
        ],
      },
      {
        type: "quote",
        text: "지역 특성에 맞는 맞춤형 생활 인프라 정책으로 주민 삶의 질을 높이겠다",
        cite: "김덕홍 후보",
      },
    ],
  },

  // ── 중산간 생활기반시설 확충 (보도자료 전문, 공약7) ──
  {
    id: 3,
    slug: "jungsangan-living-infra-pledge",
    category: "보도자료",
    title: "[공약7] 중산간 생활기반시설 확충 — 더 안전하고 편리한 조천",
    lead:
      "무소속 기호 5번 김덕홍 후보가 중산간 마을 주민들의 생활 불편 해소를 위한 생활기반시설 확충 공약을 발표했다. 도로·상하수도부터 마을버스까지 지역 특성에 맞춘 정책을 담았다.",
    date: "2026-05-23",
    source: "김덕홍 캠페인",
    heroPc: "/images/news/15-pc.jpg",
    heroMo: "/images/news/15-mo.jpg",
    heroAlt: "중산간 생활기반시설 확충 공약",
    hasHero: true,
    body: [
      {
        type: "p",
        text: "무소속 기호 5번 김덕홍 제주도의원 후보(제주시 조천읍 선거구)가 중산간 마을 주민들의 생활 불편 해소를 위한 생활기반시설 확충 공약을 발표했다.",
      },
      {
        type: "quote",
        text: "중산간 지역은 도로와 상·하수도 등 생활 인프라가 상대적으로 부족해 주민 불편이 지속되고 있다. 주민들이 안전하고 편리하게 생활할 수 있도록 기반시설 개선에 행정력을 집중하겠다",
        cite: "김덕홍 후보",
      },
      {
        type: "h2",
        text: "주요 공약",
      },
      {
        type: "list",
        items: [
          "중산간 비포장 도로 및 농로 포장 확대",
          "배수시설 정비를 통한 침수 예방",
          "안정적인 상수도 공급망 확충",
          "노후 하수처리시설 현대화",
          "농업 현장 접근성을 높이는 농로 개선 및 마을 환경 정비",
          "교통사고 예방을 위한 지능형 교통안전시설 확충",
          "주민 이동권 보장을 위한 수요맞춤형 마을버스 도입",
        ],
      },
      {
        type: "quote",
        text: "중산간 마을은 조천읍의 소중한 삶의 터전이자 농업과 자연환경을 지키는 중요한 지역이다. 지역 특성에 맞는 맞춤형 생활 인프라 정책으로 주민 삶의 질을 높이고, 균형 있는 조천 발전을 반드시 이뤄내겠다",
        cite: "김덕홍 후보",
      },
    ],
  },

  // ── 출정식 (헤드라인제주 보도) ──
  {
    id: 4,
    slug: "campaign-kickoff-village-tour",
    category: "언론보도",
    title: "김덕홍 조천읍 후보 출정식 개최…12개 리 순회 유세 돌입",
    lead:
      "김덕홍 후보(기호 5번·무소속)가 5월 21일 만세동산 광장에서 출정식을 열고 본격 선거운동에 돌입했다. 22일부터 조천읍 12개 리를 순회하는 마을별 유세를 이어간다.",
    date: "2026-05-22",
    source: "헤드라인 제주",
    sourceUrl: "https://www.headlinejeju.co.kr/news/articleView.html?idxno=593169",
    heroPc: "/images/news/04-pc.jpg",
    heroMo: "/images/news/04-mo.jpg",
    heroAlt: "조천만세동산 출정식 현장의 김덕홍 후보",
    hasHero: true,
    body: [
      {
        type: "p",
        text: "김덕홍 후보(기호 5번·무소속)가 5월 21일 조천만세동산 광장에서 출정식을 열고 본격 선거운동에 돌입했다. 이후 22일부터 27일까지 조천읍 12개 리를 순회하며 마을별 유세를 진행하고, 6월 2일 함덕리사무소 사거리에서 최종 집중유세를 펼칠 예정이다.",
      },
      {
        type: "quote",
        text: "말보다 실천으로 보여주는 준비된 일꾼이 되겠다. 다니멍, 들으멍, 챙기멍 주민 곁에서 끝까지 함께하겠다",
        cite: "김덕홍 후보",
      },
    ],
  },

  // ── 복지 (보도자료 전문, 공약5) ──
  {
    id: 5,
    slug: "welfare-all-generations-pledge",
    category: "보도자료",
    title: "[공약5] 어르신·청년·이주민·반려가족까지 — 따뜻한 공동체 조천",
    lead:
      "김덕홍 후보(기호 5번·무소속)가 조천읍 특성에 맞춘 생활밀착형 보건·복지 정책과 청년·이주민·반려동물 지원 공약을 발표하며 세대와 계층을 아우르는 따뜻한 공동체를 약속했다.",
    date: "2026-05-13",
    source: "김덕홍 캠페인",
    heroPc: "/images/news/14-pc.jpg",
    heroMo: "/images/news/14-mo.jpg",
    heroAlt: "맞춤형 보건·복지 공약",
    hasHero: true,
    body: [
      {
        type: "p",
        text: '무소속 김덕홍 후보(기호 5번·제주시 조천읍)가 조천읍 지역 특성에 맞춘 맞춤형 보건·복지 정책과 청년·이주민 지원 공약을 발표하며 "세대와 계층을 아우르는 따뜻한 공동체 조천을 만들겠다"고 밝혔다.',
      },
      {
        type: "h2",
        text: "어르신 맞춤 복지 강화",
      },
      {
        type: "list",
        items: [
          "어르신 방문의료 및 돌봄서비스 확대",
          "경로당 환경 개선 및 급식지원 단계적 확대",
        ],
      },
      {
        type: "h2",
        text: "청년·아이 키우기 좋은 조천",
      },
      {
        type: "list",
        items: [
          "청년·신혼가정 주거기반 확충",
          "키즈·에코 복합 공공육아센터 추진",
          "공동육아 돌봄센터 및 어린이 놀이시설 확충",
        ],
      },
      {
        type: "h2",
        text: "이주민·반려가족과 함께",
      },
      {
        type: "list",
        items: [
          "이주민 정착지원센터 설치 및 마을공동체 교류 활성화",
          "반려동물 기본의료 지원·반려문화 교육 확대",
          "반려견 놀이터 조성 및 반려동물 친화구역 확대",
        ],
      },
      {
        type: "quote",
        text: "복지는 특정 계층만을 위한 정책이 아니라 주민 모두의 삶의 질을 높이는 가장 기본적인 지역의 책임이다. 어르신부터 아이, 청년, 이주민, 반려가족까지 모두가 존중받고 함께 살아가는 따뜻한 조천을 만들겠다",
        cite: "김덕홍 후보",
      },
    ],
  },

  // ── 복지 (삼다일보 보도) ──
  {
    id: 6,
    slug: "welfare-elderly-youth-residents",
    category: "언론보도",
    title: '김덕홍 "어르신·청년·이주민 함께 사는 조천읍 만들 것"',
    lead:
      "김덕홍 후보(기호 5번·무소속)가 고령층 복지, 청년 주거 지원, 이주민 정착 지원 등 생활밀착형 정책을 공약했다. 반려동물 복지정책도 함께 추진하겠다고 밝혔다.",
    date: "2026-05-13",
    source: "삼다일보",
    sourceUrl: "http://www.samdailbo.com/news/articleView.html?idxno=264293",
    heroPc: "/images/news/03-pc.jpg",
    heroMo: "/images/news/03-mo.jpg",
    heroAlt: "복지 공약을 발표하는 김덕홍 후보",
    hasHero: true,
    body: [
      {
        type: "p",
        text: "김덕홍 후보(기호 5번·무소속)가 고령층 복지, 청년·신혼가정 주거 지원, 이주민 정착 지원 등 생활밀착형 복지 정책을 공약했다. 반려동물 복지정책도 함께 추진하겠다고 밝혔다.",
      },
      {
        type: "list",
        items: [
          "어르신: 방문의료·돌봄서비스·경로당 환경 개선",
          "청년·가족: 주거기반 확충·에코 복합 공공육아센터",
          "이주민: 정착지원센터·마을공동체 교류",
          "반려동물: 기본의료 지원·반려견 놀이터 조성",
        ],
      },
      {
        type: "quote",
        text: "청년과 아이 키우기 좋은 조천 조성을 위해 청년·신혼가정 주거기반을 확충하겠다",
        cite: "김덕홍 후보",
      },
    ],
  },

  // ── 거리인사 (보도자료 전문) ──
  {
    id: 7,
    slug: "morning-street-greeting",
    category: "보도자료",
    title: "매일 아침 6시 30분, 90도 인사 — 35일째 이어가는 거리인사",
    lead:
      "김덕홍 후보(기호 5번·무소속)가 선거사무소 개소 이후 매일 아침 조천읍 곳곳에서 거리인사를 이어오고 있다. '소통하고 실천하는 조천읍 일꾼'이 되겠다는 다짐이다.",
    date: "2026-05-10",
    source: "김덕홍 캠페인",
    heroPc: "/images/news/13-pc.jpg",
    heroMo: "/images/news/13-mo.jpg",
    heroAlt: "아침 거리인사를 하는 김덕홍 후보",
    hasHero: true,
    body: [
      {
        type: "p",
        text: "매일 아침 6시 30분부터 9시까지 조천읍 진드르 도로를 지나다 보면 흰 점퍼를 입고 허리를 90도로 숙여 인사하는 김덕홍 후보(기호 5번·무소속)를 만날 수 있다. 4월 6일 진드르를 시작으로 조천리 통물사거리, 함덕 하나로마트 사거리, 대흘초등학교 앞 등에서 매일 아침 거리인사를 이어오고 있으며 35일째를 맞았다.",
      },
      {
        type: "quote",
        text: "태어나고 자란 조천읍은 보물 같은 자연과 역사, 공동체의 가치를 간직한 곳이지만 주민들이 체감하는 삶의 만족도는 아직 충분하지 않다. '소통하고 실천하는 조천읍 일꾼'이 되겠다는 마음으로 출마를 결심했다",
        cite: "김덕홍 후보",
      },
      {
        type: "p",
        text: "김 후보는 아침 인사 과정에서 손을 흔들어 주거나 음료 한 병을 건네며 격려해 준 주민들 덕분에 초심을 다지게 됐다고 전했다.",
      },
      {
        type: "quote",
        text: "언제나 읍민의 곁에서 '다니멍, 들으멍, 챙기멍'을 실천하는 지역일꾼이 되겠다. 선거가 끝나는 날까지 하루도 빠짐없이 아침 인사를 이어 가겠다",
        cite: "김덕홍 후보",
      },
    ],
  },

  // ── 소통·실천 일꾼 / 거리인사 (제주의소리 보도) ──
  {
    id: 8,
    slug: "doer-who-listens",
    category: "언론보도",
    title: '조천 김덕홍 "소통하고 실천하는 일꾼 되겠다"',
    lead:
      "김덕홍 후보(기호 5번·무소속)가 매일 아침 거리인사를 이어가며 '소통하고 실천하는 조천읍 일꾼'을 약속했다. 조천의 자연·역사·공동체 가치를 살리되 주민 삶의 만족도를 높이겠다는 목표다.",
    date: "2026-05-10",
    source: "제주의소리",
    sourceUrl: "https://www.jejusori.net/news/articleView.html?idxno=502623",
    heroPc: "/images/news/05-pc.jpg",
    heroMo: "/images/news/05-mo.jpg",
    heroAlt: "거리인사를 이어가는 김덕홍 후보",
    hasHero: true,
    body: [
      {
        type: "p",
        text: "김덕홍 후보(기호 5번·무소속)가 매일 아침 거리인사를 이어가며 '소통하고 실천하는 조천읍 일꾼'이 되겠다고 약속했다. 조천읍의 자연과 역사, 공동체 가치를 살리되 주민이 체감하는 삶의 만족도를 높이는 것이 목표다.",
      },
      {
        type: "quote",
        text: "언제나 읍민의 곁에서 '다니멍, 들으멍, 챙기멍'을 실천하는 지역일꾼이 되겠다",
        cite: "김덕홍 후보",
      },
    ],
  },

  // ── 함덕 주차·교통 (보도자료 전문, 공약4) ──
  {
    id: 9,
    slug: "hamdeok-parking-traffic-pledge",
    category: "보도자료",
    title: "[공약4] 함덕권 주차·교통난 단계적 해소",
    lead:
      "김덕홍 후보(기호 5번·무소속)가 관광객 증가로 심화된 함덕권의 주차 부족·불법 주차·교통 혼잡 문제를 단계적으로 해소하는 공약을 발표했다. 주민 생활과 관광 환경이 조화를 이루는 교통체계를 약속했다.",
    date: "2026-05-06",
    source: "김덕홍 캠페인",
    heroPc: "/images/news/12-pc.jpg",
    heroMo: "/images/news/12-mo.jpg",
    heroAlt: "함덕권 주차·교통 공약",
    hasHero: true,
    body: [
      {
        type: "p",
        text: "김덕홍 후보(기호 5번·무소속)가 조천읍 함덕권의 고질적인 주차 부족과 불법 주차, 교통 혼잡 문제를 단계적으로 해소하기 위한 공약을 발표했다. 관광객 증가와 상권 활성화로 주차 수요가 급증했지만 이를 뒷받침할 인프라가 부족해 주민 불편이 심각하다는 진단이다.",
      },
      {
        type: "h2",
        text: "주요 공약",
      },
      {
        type: "list",
        items: [
          "교통 밀집 지역 및 주요 관광지 인근 공영주차장 단계적 확충",
          "함덕해수욕장 일대 관광버스 전용주차장 조성",
          "주차 수요 분산을 통한 불법 주차 감소 및 보행 안전 확보",
          "주말·성수기 교통 혼잡 대응을 위한 탄력적 교통대책 운영",
          "주민·상인 참여형 교통 관리 시스템 구축",
        ],
      },
      {
        type: "quote",
        text: "함덕권 교통 문제는 더 이상 미룰 수 없는 생활 현안이다. 실효성 있는 정책 추진으로 주민 불편을 줄이고, 관광과 지역경제가 함께 살아나는 환경을 만들겠다",
        cite: "김덕홍 후보",
      },
    ],
  },

  // ── 함덕 주차·교통 (제주의소리 보도) ──
  {
    id: 10,
    slug: "hamdeok-parking-traffic",
    category: "언론보도",
    title: '조천 김덕홍 "함덕 주차난·교통난 해결"',
    lead:
      "김덕홍 후보(기호 5번·무소속)가 함덕리의 만성적 주차난과 교통 혼잡 해결을 주요 공약으로 제시했다. 관광객 증가로 인한 인프라 부족을 지적하며 공영주차장 확충 등 구체적 방안을 내놨다.",
    date: "2026-05-07",
    source: "제주의소리",
    sourceUrl: "https://www.jejusori.net/news/articleView.html?idxno=502525",
    heroPc: "/images/news/06-pc.jpg",
    heroMo: "/images/news/06-mo.jpg",
    heroAlt: "함덕 주차·교통 공약을 발표하는 김덕홍 후보",
    hasHero: true,
    body: [
      {
        type: "p",
        text: "김덕홍 후보(기호 5번·무소속)가 함덕리의 만성적 주차난과 교통 혼잡 문제 해결을 주요 공약으로 제시했다. 관광객 증가로 인한 인프라 부족 상황을 지적하며 구체적 개선 방안을 내놨다.",
      },
      {
        type: "list",
        items: [
          "공영주차장 확충",
          "관광버스 전용 주차장 조성",
          "성수기 대응 탄력적 교통체계",
          "주민 참여형 교통 관리 시스템 도입",
        ],
      },
      {
        type: "quote",
        text: "함덕 교통 문제는 더 이상 미룰 수 없는 현안이다",
        cite: "김덕홍 후보",
      },
    ],
  },

  // ── 농업용수 (보도자료 전문, 공약3) ──
  {
    id: 11,
    slug: "agricultural-water-infra-pledge",
    category: "보도자료",
    title: "[공약3] 농업용수 인프라 확충 — 1차 산업 경쟁력 강화",
    lead:
      "김덕홍 후보(기호 5번·무소속)가 노후 농업용수 시설과 기후변화로 인한 물 부족 문제 해결을 위한 농업용수 인프라 확충 공약을 발표했다. 조천읍 농업의 지속 가능한 발전 기반 구축이 목표다.",
    date: "2026-05-04",
    source: "김덕홍 캠페인",
    heroPc: "/images/news/11-pc.jpg",
    heroMo: "/images/news/11-mo.jpg",
    heroAlt: "농업용수 인프라 확충 공약",
    hasHero: true,
    body: [
      {
        type: "p",
        text: "김덕홍 후보(기호 5번·무소속)가 1차 산업 경쟁력 강화를 위한 공약으로 '농업용수 인프라 확충'을 제시했다. 노후화된 농업용수 시설과 기후변화로 인한 물 부족 문제를 근본적으로 해결하고, 조천읍 농업의 지속 가능한 발전 기반을 구축하는 데 목적이 있다.",
      },
      {
        type: "quote",
        text: "조천읍은 저수지와 관개시설 중심의 공급체계를 유지하고 있으나 시설 노후화와 기후변화로 물 관리의 한계가 뚜렷해지고 있다. 농업용수는 농민의 생존과 직결된 문제인 만큼 가장 시급하고 우선적인 과제로 해결해 나가겠다",
        cite: "김덕홍 후보",
      },
      {
        type: "h2",
        text: "주요 공약",
      },
      {
        type: "list",
        items: [
          "노후 관개시설 현대화를 통한 안정적 농업용수 공급 기반 조성",
          "ICT 기반 스마트 물관리 체계 도입",
          "기후변화 대응을 위한 수자원 관리 강화",
          "친환경 물 관리 및 재활용 시스템 구축",
          "지역 특성을 반영한 맞춤형 통합 수자원 정책 추진",
        ],
      },
    ],
  },

  // ── 농업용수 (제주의소리 보도) ──
  {
    id: 12,
    slug: "agricultural-water-infra",
    category: "언론보도",
    title: '조천 김덕홍 "농업용수 인프라 확충"',
    lead:
      "김덕홍 후보(기호 5번·무소속)가 노후 관개시설 현대화, ICT 기반 스마트 물관리, 기후변화 대응 등을 담은 농업용수 인프라 확충 공약을 발표했다.",
    date: "2026-05-04",
    source: "제주의소리",
    sourceUrl: "https://www.jejusori.net/news/articleView.html?idxno=502423",
    heroPc: "/images/news/07-pc.jpg",
    heroMo: "/images/news/07-mo.jpg",
    heroAlt: "농업용수 인프라 공약을 발표하는 김덕홍 후보",
    hasHero: true,
    body: [
      {
        type: "p",
        text: "김덕홍 후보(기호 5번·무소속)가 노후 관개시설 현대화, ICT 기반 스마트 물관리, 기후변화 대응 등을 포함한 농업용수 인프라 확충 공약을 발표했다.",
      },
      {
        type: "list",
        items: [
          "노후 관개시설 현대화",
          "ICT 스마트 물관리 체계 도입",
          "기후변화 대응 수자원 관리",
          "친환경 물 재활용 시스템",
          "지역 맞춤형 통합 수자원 정책",
        ],
      },
      {
        type: "quote",
        text: "농업용수 인프라 확충과 체계적인 관리는 조천 지역 농업 경쟁력 확보를 위한 핵심 요소다",
        cite: "김덕홍 후보",
      },
    ],
  },

  // ── 119구조센터 (보도자료 전문, 공약2) ──
  {
    id: 13,
    slug: "119-rescue-center-pledge",
    category: "보도자료",
    title: "[공약2] 119구조센터 조천읍 유치 — 동부권 재난 골든타임 단축",
    lead:
      "김덕홍 후보(기호 5번·무소속)가 조천·구좌·우도 등 동부권 재난 대응 역량 강화를 위해 전문 인명구조 조직인 119구조센터의 조천읍 유치를 공약했다.",
    date: "2026-04-28",
    source: "김덕홍 캠페인",
    heroPc: "/images/news/10-pc.jpg",
    heroMo: "/images/news/10-mo.jpg",
    heroAlt: "119구조센터 유치 공약",
    hasHero: true,
    body: [
      {
        type: "p",
        text: "김덕홍 후보(기호 5번·무소속)가 제주시 조천·구좌·우도 등 동부권 재난 대응 역량 강화를 위해 전문 인명구조 조직인 '119구조센터'의 조천읍 유치 추진 계획을 밝혔다.",
      },
      {
        type: "quote",
        text: "동부권 일부 지역은 구조대 출동 거리가 약 10~40㎞에 이르러 재난 발생 시 골든타임 내 현장 대응에 한계가 있다는 주민들의 요구가 지속돼 왔다. 전문 구조 인력과 장비를 갖춘 상설 구조센터 설치는 동부권 주민의 생명과 안전을 지키기 위한 필수 기반시설",
        cite: "김덕홍 후보",
      },
      {
        type: "p",
        text: "김 후보는 조천읍 119센터 인근 공유지를 활용한 구조센터 설치 방안을 제시하며, 조천읍이 제주시 동부권의 지리적 중심지로서 조천·구좌·우도 전역의 재난 대응 골든타임을 단축할 수 있는 최적의 입지라고 강조했다.",
      },
      {
        type: "quote",
        text: "도의회에 진출하게 된다면 제주도 및 소방안전본부와 협력해 설치 타당성 검토부터 행정 절차 추진까지 단계적으로 실행해 동부권 주민 누구나 신속하고 안전한 구조 서비스를 받도록 119구조센터 유치를 반드시 현실화하겠다",
        cite: "김덕홍 후보",
      },
    ],
  },

  // ── 119구조센터 (제주일보 보도) ──
  {
    id: 14,
    slug: "119-rescue-center-jocheon",
    category: "언론보도",
    title: "조천에 119구조센터 유치…동부권 재난 골든타임 확보",
    lead:
      "김덕홍 후보(기호 5번·무소속)가 동부권 재난 대응 강화를 위해 조천읍에 전문 구조센터 설치를 공약했다. 동부권 일부의 구조대 출동 거리가 10~40㎞에 달해 골든타임 확보가 어렵다는 주민 요구를 반영했다.",
    date: "2026-04-28",
    source: "제주일보",
    sourceUrl: "http://www.jejunews.com/news/articleView.html?idxno=2225158",
    heroPc: "/images/news/08-pc.jpg",
    heroMo: "/images/news/08-mo.jpg",
    heroAlt: "119구조센터 유치 공약을 발표하는 김덕홍 후보",
    hasHero: true,
    body: [
      {
        type: "p",
        text: "김덕홍 후보(기호 5번·무소속)가 동부권 재난 대응 역량 강화를 위해 조천읍에 전문 구조 센터를 설치하겠다고 공약했다. 현재 동부권 일부 지역의 구조대 출동 거리가 10~40㎞에 달해 골든타임 확보가 어렵다는 주민 요구에 따른 것이다. 조천읍 119센터 인근 공유지를 활용해 전문 인력과 장비를 갖춘 상설 구조센터를 설치하는 방안이다.",
      },
      {
        type: "quote",
        text: "도의회에 진출하게 된다면 설치 타당성 검토부터 행정절차 추진까지 단계적으로 실행하겠다",
        cite: "김덕홍 후보",
      },
    ],
  },

  // ── 로컬푸드·스마트 농어업 (보도자료 전문, 공약1) ──
  {
    id: 15,
    slug: "localfood-smart-agriculture-pledge",
    category: "보도자료",
    title: "[공약1] 로컬푸드 직거래 플랫폼 구축 및 스마트 농어업 확대",
    lead:
      "김덕홍 후보(기호 5번·무소속)가 농어가 소득 증대와 안정적 판로 확보를 위한 '로컬푸드 직거래 플랫폼 구축 및 스마트 농어업 확대' 정책을 발표했다. 유통구조 개선과 청년 유입까지 도모하는 종합 정책이다.",
    date: "2026-04-27",
    source: "김덕홍 캠페인",
    heroPc: "/images/news/09-pc.jpg",
    heroMo: "/images/news/09-mo.jpg",
    heroAlt: "로컬푸드 직거래 플랫폼·스마트 농어업 공약",
    hasHero: true,
    body: [
      {
        type: "p",
        text: "김덕홍 후보(기호 5번·무소속)가 『무에서 함께 써 내려갈 덕홍이야기』 제1탄 공약으로, 농어가 소득 증대와 안정적 판로 확보를 위한 '로컬푸드 직거래 플랫폼 구축 및 스마트 농어업 확대 정책'을 발표했다.",
      },
      {
        type: "p",
        text: "지역 농수산물의 유통 구조 개선을 위해 오프라인 직판장과 온라인 쇼핑몰을 연계한 '로컬푸드 직거래 플랫폼'을 구축하겠다는 구상이다. 중간 유통 단계를 줄여 생산자 수익을 높이는 동시에 소비자에게는 신선하고 합리적인 가격의 지역 농수산물을 제공한다. 저장·가공·포장 등에 필요한 공동 가공시설 지원 체계도 함께 추진해 농어가의 부가가치 창출 기반을 강화한다.",
      },
      {
        type: "p",
        text: "또한 첨단 환경센서, 양식 모니터링 시스템 등 스마트 기술을 단계적으로 도입하는 스마트 농어업 시범 보급 사업으로 생산성과 관리 효율을 높이고, 기후 변화 등 미래 농어업 환경 변화에도 대응할 기반을 마련한다. 청년층 유입 확대를 위해 초기 정착 지원금, 주거 지원, 선배 농어업인 멘토링을 연계한 청년 귀농·귀어 정착 지원 패키지도 추진한다.",
      },
      {
        type: "quote",
        text: "조천읍 농어업의 경쟁력을 높이고 지속 가능한 소득 기반을 만들기 위해 현장에서 체감할 수 있는 정책을 준비했다. 로컬푸드 플랫폼 구축과 스마트 농어업 확대를 통해 조천 농어업의 새로운 미래를 열겠다",
        cite: "김덕홍 후보",
      },
    ],
  },
];

// 표시 정렬: 발행일 역순 → (동일 날짜) 이미지 있는 글 우선 → id
export function getAllArticles(): Article[] {
  return [...NEWS].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    if (a.hasHero !== b.hasHero) return a.hasHero ? -1 : 1;
    return a.id - b.id;
  });
}

export function getFeaturedArticle(): Article {
  return getAllArticles()[0];
}

// 주제 그룹 (홈 "최근 보도자료" 중복 노출 방지용 — 같은 주제는 한 번만).
const TOPIC: Record<number, string> = {
  1: "중산간",
  2: "중산간",
  3: "중산간",
  4: "출정식",
  5: "복지",
  6: "복지",
  7: "거리인사",
  8: "거리인사",
  9: "함덕교통",
  10: "함덕교통",
  11: "농업용수",
  12: "농업용수",
  13: "119구조센터",
  14: "119구조센터",
  15: "로컬푸드",
  16: "사랑방포럼",
};

// 최신순으로 주제가 겹치지 않게 n건 (홈 진입 섹션용)
export function getRecentDistinct(n: number): Article[] {
  const seen = new Set<string>();
  const out: Article[] = [];
  for (const a of getAllArticles()) {
    const t = TOPIC[a.id] ?? `id-${a.id}`;
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(a);
    if (out.length >= n) break;
  }
  return out;
}

export function getArticleById(id: number): Article | undefined {
  return NEWS.find((a) => a.id === id);
}

export function articlePath(a: Pick<Article, "id" | "slug">): string {
  return `/news/${a.id}-${a.slug}`;
}

// URL 파라미터 "{id}-{slug}" → { id, slug }. 형식이 아니면 null.
export function parseNewsParam(param: string): { id: number; slug: string } | null {
  const m = /^(\d+)(?:-(.*))?$/.exec(param);
  if (!m) return null;
  return { id: Number(m[1]), slug: m[2] ?? "" };
}
