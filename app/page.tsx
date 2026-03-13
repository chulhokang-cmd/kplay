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
    glow: "rgba(255,77,141,0.18)",
  },
  {
    href: "/fall",
    emoji: "🌸",
    title: "落ちてくる",
    desc: "降ってくる単語をタップ！反射神経勝負",
    accent: "#ffe566",
    glow: "rgba(255,229,102,0.18)",
  },
  {
    href: "/match",
    emoji: "🔗",
    title: "マッチング",
    desc: "韓国語と日本語をペアに！記憶力チェック",
    accent: "#3de8d0",
    glow: "rgba(61,232,208,0.18)",
  },
  {
    href: "/lyric",
    emoji: "🎤",
    title: "歌詞埋め",
    desc: "空欄を埋めよう！推しの曲で覚える",
    accent: "#b06aff",
    glow: "rgba(176,106,255,0.18)",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <BgDeco />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-8 animate-pop-in">

        {/* Logo */}
        <div className="text-center relative">
          <span className="absolute text-3xl left-6 top-0" style={{ animation: "spin 3s ease-in-out infinite alternate" }}>🎵</span>
          <span className="absolute text-3xl right-6 top-0" style={{ animation: "spin 5s ease-in-out infinite alternate-reverse" }}>⭐</span>
          <h1
            className="font-fredoka gradient-text"
            style={{ fontSize: "72px", lineHeight: 1, filter: "drop-shadow(0 0 30px rgba(255,77,141,0.4))" }}
          >
            K★PLAY
          </h1>
          <p className="font-yomogi text-base mt-1" style={{ color: "var(--pink2)", letterSpacing: "2px" }}>
            遊びながら韓国語♪
          </p>
        </div>

        {/* Mode grid */}
        <div className="grid grid-cols-2 gap-3">
          {MODES.map((m) => (
            <Link key={m.href} href={m.href} className="group block">
              <div
                className="card-base p-5 text-center cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.97]"
                style={{
                  "--accent": m.accent,
                  "--glow": m.glow,
                } as React.CSSProperties}
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

        {/* Tagline */}
        <p className="font-yomogi text-sm text-center leading-relaxed" style={{ color: "var(--muted)" }}>
          ログイン不要 • いつでも気軽に遊べる
          <br />
          遊んでいたら韓国語が上手になっていた♪
        </p>

      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(-15deg) scale(1); }
          to   { transform: rotate(15deg) scale(1.2); }
        }
      `}</style>
    </main>
  );
}
