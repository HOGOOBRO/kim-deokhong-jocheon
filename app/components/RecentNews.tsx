import Link from "next/link";
import {
  articlePath,
  getAllArticles,
  getRecentDistinct,
  type Article,
} from "@/app/data/news";

function fmt(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${y.slice(2)}.${m}.${d}`;
}

function CardThumb({ article }: { article: Article }) {
  if (article.hasHero && article.heroPc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={article.heroPc}
        alt={article.heroAlt}
        loading="lazy"
        className="w-full h-[220px] md:h-[280px] object-cover object-top"
      />
    );
  }
  return (
    <div className="relative w-full h-[220px] md:h-[280px] bg-[#1a1a1a] text-[#FFD400] flex flex-col justify-end p-4 md:p-5">
      <span className="absolute top-4 left-4 md:top-5 md:left-5 text-[10px] md:text-[11px] font-bold tracking-[0.05em] opacity-60">
        소식 · {String(article.id).padStart(2, "0")}
      </span>
      <span className="text-[15px] md:text-[17px] font-bold tracking-[-0.02em]">
        {article.category}
      </span>
    </div>
  );
}

export default function RecentNews() {
  const all = getAllArticles();
  const recent = getRecentDistinct(3);

  return (
    <section
      id="news"
      className="bg-white border-t border-[#eaeaea] px-5 pt-12 pb-14 md:px-[60px] md:pt-24 md:pb-[110px]"
      style={{ fontFamily: "Pretendard, sans-serif" }}
    >
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-end justify-between gap-4 mb-7 md:mb-12">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] md:text-[12px] font-bold tracking-[0.02em] text-[#9a9a9a] mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400]" />
              조천읍 도의원 당선인 김덕홍
            </div>
            <h2 className="m-0 text-[28px] md:text-[48px] font-bold tracking-[-0.04em] leading-[1.1] text-[#1a1a1a]">
              최근 보도자료
            </h2>
          </div>
          <Link
            href="/news"
            className="shrink-0 inline-flex items-center gap-1.5 bg-[#1a1a1a] text-white rounded-full px-4 py-3 md:px-[22px] md:py-3.5 text-[12px] md:text-[14px] font-bold tracking-[-0.01em] no-underline [@media(hover:hover)]:hover:opacity-90"
          >
            전체 {all.length}건 보기 →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {recent.map((a) => (
            <Link
              key={a.id}
              href={articlePath(a)}
              className="block no-underline text-[#1a1a1a] group"
            >
              <div className="rounded-xl overflow-hidden mb-3.5">
                <CardThumb article={a} />
              </div>
              <div className="text-[12px] md:text-[13px] font-bold text-[#9a9a9a] tracking-[0.02em] mb-2">
                {fmt(a.date)} · {a.source}
              </div>
              <div className="text-[17px] md:text-[21px] font-bold leading-[1.3] tracking-[-0.02em] line-clamp-3 break-keep [@media(hover:hover)]:group-hover:opacity-70">
                {a.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
