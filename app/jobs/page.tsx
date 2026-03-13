"use client";
import Link from "next/link";
import BgDeco from "@/components/BgDeco";
import { JOBS } from "@/lib/data";

const LEVEL_COLOR: Record<string, string> = {
  "ビジネス以上": "#ff4d8d",
  "日常会話以上": "#ffe566",
  "初級以上": "#3de8d0",
};

const CATEGORY_EMOJI: Record<string, string> = {
  "IT": "💻",
  "マーケティング": "📣",
  "営業": "🤝",
  "カスタマーサポート": "🎧",
  "コンテンツ": "✍️",
};

export default function JobsPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center px-4 py-10 pb-16">
      <BgDeco />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-6 animate-pop-in">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/" className="btn-back">←</Link>
          <div>
            <h1 className="font-fredoka text-2xl" style={{ color: "var(--yellow)" }}>
              韓国語で働こう 💼
            </h1>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              韓国語を活かせる求人 {JOBS.length}件
            </p>
          </div>
        </div>

        {/* Job list */}
        <div className="flex flex-col gap-4">
          {JOBS.map((job, i) => (
            <div
              key={i}
              className="card-base p-5 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
              style={{ cursor: "default" }}
            >
              {/* Company & category */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-fredoka text-base" style={{ color: "var(--white)" }}>
                    {CATEGORY_EMOJI[job.category] ?? "🏢"} {job.company}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {job.location}
                  </div>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2"
                  style={{
                    background: "var(--surface)",
                    color: LEVEL_COLOR[job.level] ?? "var(--cyan)",
                    border: `1px solid ${LEVEL_COLOR[job.level] ?? "var(--cyan)"}`,
                  }}
                >
                  {job.level}
                </span>
              </div>

              {/* Position */}
              <div className="font-fredoka text-lg mb-1" style={{ color: "var(--cyan)" }}>
                {job.position}
              </div>

              {/* Description */}
              <div className="text-xs leading-relaxed mb-3" style={{ color: "var(--muted)" }}>
                {job.desc}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="card-base p-5 text-center"
          style={{ borderColor: "var(--purple)", background: "var(--surface)" }}
        >
          <p className="font-fredoka text-base mb-1" style={{ color: "var(--purple)" }}>
            もっと求人を見たい？
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            WantedLab の公式サイトで<br />さらに多くの韓国企業求人をチェック
          </p>
        </div>

      </div>
    </main>
  );
}
