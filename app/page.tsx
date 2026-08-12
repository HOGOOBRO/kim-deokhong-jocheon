// 리뉴얼 홈 — 화이트 에디토리얼 현장 기록 (디자인 원칙: docs/renewal/ideas.md)
// 캠페인 구조에서 의정활동 기록 사이트로 전환. 사실관계·정책 명칭은 원본 기준,
// 구조·디자인은 리뉴얼 시안 기준. 활동 기록은 정적 예시 대신 실제 보도자료 연동.
import Link from "next/link";
import { articlePath, getAllArticles, getRecentDistinct } from "@/app/data/news";
import { POLICIES } from "@/app/data/policies";

// 현장 기록 2장은 기존 소스의 무표식 실사진으로 교체 (2026-08-12 Theo 지시).
// 마누스 zip의 fieldwork·senior-center 사본은 각각 policy1.png·news/24-pc.jpg와
// 동일 파일(md5 일치)이라 제거.
const photos = {
  // 고화질본(원본 4268px는 docs/renewal/assets-original/ 보관, 웹용 1800px 사용).
  // 기존 저해상 dukhong-council-session.jpg는 그대로 별도 보관.
  council: "/images/dukhong-council-session-hq.jpg",
  sea: "/images/news/20-pc.jpg",
  village: "/images/quote2-pc.png",
};

const SNS_LINKS = {
  instagram: "https://www.instagram.com/dukhong4jocheon?igsh=bm1lanYyeXd2OXJs",
  facebook: "https://www.facebook.com/share/18VzrpoQnn/?mibextid=wwXIfr",
};

// 6개 의정 과제 — 명칭·요약·추진 과제 전부 원본 단일 소스(app/data/policies.ts).
// 분야 라벨만 리뉴얼 시안.
const priorityLabels: Record<number, string> = {
  1: "지역의 기반",
  2: "지역의 활력",
  3: "소통의 방식",
  4: "생활의 기준",
  5: "보전의 기준",
  6: "함께 사는 일",
};

const career: [string, string][] = [
  ["2026", "제주특별자치도 조천읍\n도의원"],
  ["2020", "조천읍장"],
  ["2018", "아라동장"],
  ["2012", "한라산국립공원\n탐방안내소관리팀장"],
  ["2009", "절물자연휴양림\n관리생태소장"],
];

function ArrowUpRight({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}

function ChevronDown({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ArrowDownRight({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 7l10 10" />
      <path d="M17 7v10H7" />
    </svg>
  );
}

function SectionLabel({ number, children }: { number: string; children: string }) {
  return (
    <p className="section-label">
      <span>{number}</span>
      {children}
    </p>
  );
}

function fmt(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${y}.${m}.${d}`;
}

export default function Home() {
  const all = getAllArticles();
  const recent = getRecentDistinct(3);

  return (
    <div className="rn">
      <header className="site-header">
        <a href="#top" className="wordmark" aria-label="덕홍닷컴 첫 화면">
          <span className="basalt-mark" aria-hidden="true" />
          <span>김덕홍</span>
          <i />
          <span>제주특별자치도의회</span>
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#about">소개</a>
          <a href="#priorities">의정 과제</a>
          <a href="#records">활동 기록</a>
        </nav>
        <Link href="/news" className="header-link">
          보도자료 <ArrowUpRight size={15} />
        </Link>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-topline">
            <p>제주특별자치도의회</p>
            <p>조천읍, 2026년</p>
          </div>
          <div className="hero-grid">
            <div className="hero-intro">
              <p className="hero-kicker">조천읍 의정활동 기록</p>
              <h1 id="hero-title">
                <span>현장에서 듣고,</span>
                <span>
                  의정으로 답합니다<span className="accent-dot">.</span>
                </span>
              </h1>
              <p className="hero-deck">
                조천의 오늘을 직접 살피고, 주민의 일상이 조금 더 나아지는 방향을 함께
                찾겠습니다.
              </p>
            </div>
            <figure className="hero-keyvisual">
              <img
                src={photos.council}
                alt="제주특별자치도의회 회의에서 발언하는 김덕홍 의원"
              />
              <figcaption>
                <strong>김덕홍</strong>
                <span>제주특별자치도 조천읍 도의원</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="about" className="statement" aria-labelledby="statement-title">
          <SectionLabel number="01">소개</SectionLabel>
          <div className="statement-grid">
            <h2 id="statement-title">
              작은 불편도
              <br />
              그냥 지나치지 않는
              <br />
              의정활동<span className="accent-dot">.</span>
            </h2>
            {/* 소개 카피는 원본 사이트 문장 그대로 (2026-08-12 Theo: 카피도 원본 우선) */}
            <div className="statement-copy">
              <p className="lead">
                38년 공직 경험, 행정은 책상이 아니라 현장에서 배웠습니다.
              </p>
              <p>
                절물자연휴양림, 한라산국립공원, 아라동, 조천읍까지. 주민 가까이에서
                듣고, 직접 해결해 왔습니다.
              </p>
              <p>이제 그 경험을 조천의 변화로 이어가겠습니다.</p>
              <a href="#priorities" className="plain-link">
                의정 과제 살펴보기 <ArrowDownRight size={17} />
              </a>
            </div>
          </div>
          <div className="career-strip" aria-label="주요 공직 경력">
            {career.map(([year, title]) => (
              <div key={year}>
                <small>{year}</small>
                <strong>
                  {title.split("\n").map((line, i) => (
                    <span key={line}>
                      {i > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <section className="manifesto" aria-labelledby="manifesto-title">
          <div>
            <p className="hero-kicker">의정활동의 원칙</p>
            <h2 id="manifesto-title">
              조천의 일은,
              <br />
              조천의 자리에서
              <br />
              풀어가겠습니다<span className="accent-dot">.</span>
            </h2>
          </div>
          <p className="manifesto-copy">
            큰 변화보다 먼저 일상의 불편을 살핍니다. 주민이 직접 느끼는 문제를 정책의
            언어로 바꾸고, 실행의 과정을 투명하게 기록하겠습니다.
          </p>
        </section>

        <section id="priorities" className="priorities" aria-labelledby="priorities-title">
          <SectionLabel number="02">의정 과제</SectionLabel>
          <div className="priorities-title-row">
            <h2 id="priorities-title">
              지금의 생활을
              <br />더 단단하게.
            </h2>
            <p>
              분야별 과제는 서로 연결되어 있습니다. 지역의 일상에 어떤 변화가
              필요한지, 우선순위를 두고 꾸준히 살피겠습니다.
            </p>
          </div>
          {/* 클릭 시 원본 '자세히 보기' 상세(추진 과제)가 펼쳐지는 아코디언 */}
          <div className="priority-list">
            {POLICIES.map((p) => (
              <details className="priority-item" key={p.n}>
                <summary>
                  <span className="priority-number">{String(p.n).padStart(2, "0")}</span>
                  <span className="priority-label">{priorityLabels[p.n]}</span>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.summary}</p>
                  </div>
                  <ChevronDown className="priority-icon" size={19} />
                </summary>
                <div className="priority-detail">
                  <div className="priority-detail-inner">
                    <p className="priority-detail-heading">추진 과제</p>
                    <ul>
                      {p.bullets.map((b) =>
                        typeof b === "string" ? (
                          <li key={b}>{b}</li>
                        ) : (
                          <li key={b.head}>
                            {b.head}
                            <ul>
                              {b.sub.map((s) => (
                                <li key={s}>{s}</li>
                              ))}
                            </ul>
                          </li>
                        )
                      )}
                    </ul>
                    <p className="priority-closing">{p.closing}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section id="records" className="records" aria-labelledby="records-title">
          <div className="records-rail" aria-hidden="true">
            <span>활동 기록</span>
            <i />
          </div>
          <SectionLabel number="03">현장 기록</SectionLabel>
          <div className="records-title-row">
            <h2 id="records-title">
              현장의 목소리를
              <br />
              남깁니다<span className="accent-dot">.</span>
            </h2>
            <p>의정활동의 과정과 현장에서 들은 이야기를 차곡차곡 기록하겠습니다.</p>
          </div>
          <div className="record-gallery" aria-label="현장 활동 사진">
            <figure>
              <img
                src={photos.sea}
                alt="해안 포구에서 해녀들과 소라 선별 작업을 함께하는 김덕홍 의원"
              />
              <figcaption>해녀 작업 포구에서</figcaption>
            </figure>
            <figure>
              <img
                src={photos.village}
                alt="마을 마당에서 강아지들과 어울리는 김덕홍 의원"
              />
              <figcaption>마을의 반려가족과</figcaption>
            </figure>
          </div>
          <div className="records-list">
            {recent.map((a, i) => (
              <Link className="record-item" key={a.id} href={articlePath(a)}>
                <span className="record-index">{String(i + 1).padStart(2, "0")}</span>
                <div className="record-type">
                  <span>{a.category}</span>
                  <time dateTime={a.date}>{fmt(a.date)}</time>
                </div>
                <h3>{a.title}</h3>
                <ArrowUpRight className="record-arrow" size={19} />
              </Link>
            ))}
          </div>
          <Link href="/news" className="records-more">
            보도자료 전체 {all.length}건 보기 <ArrowUpRight size={15} />
          </Link>
        </section>

        <section className="closing" aria-labelledby="closing-title">
          <SectionLabel number="04">조천에 드리는 말씀</SectionLabel>
          <h2 id="closing-title">
            주민 가까이에서,
            <br />
            책임 있게 답하겠습니다.
          </h2>
          <p className="closing-copy">말보다 실천으로, 조천읍의 변화를 만들겠습니다.</p>
          <a href="#top" className="closing-link">
            첫 화면으로 <ArrowUpRight size={18} />
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="basalt-mark" aria-hidden="true" />
          <div>
            <strong>김덕홍</strong>
            <span>제주특별자치도 조천읍 도의원</span>
          </div>
        </div>
        <p>현장에서 듣고, 의정으로 답합니다.</p>
        <div className="footer-side">
          <div className="footer-sns">
            <a
              href={SNS_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="인스타그램으로 이동"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href={SNS_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="페이스북으로 이동"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13.5 21v-7.5h2.55l.38-2.95H13.5V8.7c0-.85.24-1.43 1.45-1.43h1.55V4.63c-.27-.04-1.19-.12-2.27-.12-2.24 0-3.78 1.37-3.78 3.88v2.16H7.9v2.95h2.55V21h3.05z" />
              </svg>
            </a>
          </div>
          <small>© 2026 김덕홍 의원실. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}
