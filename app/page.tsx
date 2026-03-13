"use client";
import Link from "next/link";
import BgDeco from "@/components/BgDeco";

const MODES = [
  {
    href: "/quiz",
    emoji: "⚡",
    title: "クイズ",
    desc: "K-POPの単語を当てよう！タイムアタック形式",
    accent: "#ff4d8d",
  },
  {
    href: "/fall",
    emoji: "🌸",
    title: "落ちてくる",
    desc: "降ってくる単語をタップ！反射神経勝負",
    accent: "#ffe566",
  },
  {
    href: "/match",
    emoji: "🔗",
    title: "マッチング",
    desc: "韓国語と日本語をペアに！記憶力チェック",
    accent: "#3de8d0",
  },
  {
    href: "/lyric",
    emoji: "🎤",
    title: "歌詞埋め",
    desc: "空欄を埋めよう！推しの曲で覚える",
    accent: "#b06aff",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center px-4 py-10 pb-16">
      <BgDeco />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-10 animate-pop-in">

        {/* Logo */}
        <div className="text-center pt-4">
          <h1
            className="font-fredoka gradient-text"
            style={{ fontSize: "64px", lineHeight: 1, filter: "drop-shadow(0 0 30px rgba(255,77,141,0.4))" }}
          >
            설렘
          </h1>
          <p className="font-fredoka text-2xl mt-1" style={{ color: "var(--pink2)", letterSpacing: "2px" }}>
            Seollem
          </p>
          <p className="font-yomogi text-sm mt-2" style={{ color: "var(--muted)" }}>
            韓国語を学んで、韓国で働こう♪
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--border)" }}>
            Powered by WantedLab
          </p>
        </div>

        {/* Section 1: Beginners */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🌱</span>
            <span className="font-fredoka text-base" style={{ color: "var(--cyan)" }}>初心者 — ゲームで韓国語を学ぼう</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {MODES.map((m) => (
              <Link key={m.href} href={m.href} className="group block">
                <div
                  className="card-base p-5 text-center cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.97]"
                >
                  <span className="text-4xl block mb-2">{m.emoji}</span>
                  <div className="font-fredoka text-lg mb-1" style={{ color: m.accent }}>
                    {m.title}
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                    {m.desc}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 2: Advanced users */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💼</span>
            <span className="font-fredoka text-base" style={{ color: "var(--yellow)" }}>上級者 — 韓国語で働こう</span>
          </div>
          <Link href="/jobs" className="block">
            <div
              className="card-base p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:scale-[1.01] active:scale-[0.97]"
              style={{ borderColor: "var(--yellow)", background: "linear-gradient(135deg, #221e3a 0%, #2a2040 100%)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-fredoka text-xl mb-1" style={{ color: "var(--yellow)" }}>
                    韓国企業の求人を見る
                  </div>
                  <div className="text-sm" style={{ color: "var(--muted)" }}>
                    韓国語を活かせる仕事・企業を探そう
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {["IT", "マーケ", "営業", "カスタマー"].map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "var(--surface)", color: "var(--yellow)", border: "1px solid var(--border)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-4xl ml-4">→</span>
              </div>
            </div>
          </Link>
        </section>

        {/* Footer */}
        <p className="font-yomogi text-xs text-center" style={{ color: "var(--muted)" }}>
          ログイン不要 • いつでも気軽に
        </p>

      </div>
    </main>
  );
}
