"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/lib/gameStore";
import BgDeco from "@/components/BgDeco";
import Confetti from "@/components/Confetti";

const MODE_ROUTES: Record<string, string> = {
  quiz: "/quiz", fall: "/fall", match: "/match", lyric: "/lyric",
};

export default function ResultPage() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const result = state.result;

  useEffect(() => {
    if (!result) router.push("/");
  }, [result, router]);

  if (!result) return null;

  const pct      = result.correct / result.total;
  const emoji    = pct >= 0.8 ? "🏆" : pct >= 0.5 ? "🎉" : "💪";
  const title    = pct >= 0.8 ? "完璧！" : pct >= 0.5 ? "いいね！" : "もう一回！";
  const showConf = pct >= 0.6;

  const retry = () => {
    dispatch({ type: "CLEAR" });
    router.push(MODE_ROUTES[result.mode] ?? "/");
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <BgDeco />
      <Confetti trigger={showConf} />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-6 text-center animate-pop-in">

        {/* Emoji */}
        <div className="text-7xl" style={{ animation: "bounce 0.6s ease" }}>
          {emoji}
        </div>

        {/* Title */}
        <h1 className="font-fredoka text-4xl gradient-text-yp">{title}</h1>

        {/* Score */}
        <div
          className="font-fredoka"
          style={{ fontSize: 88, lineHeight: 1, color: "var(--yellow)", textShadow: "0 0 40px rgba(255,229,102,0.5)" }}
        >
          {result.score}
        </div>
        <p className="text-sm -mt-4" style={{ color: "var(--muted)" }}>ポイント獲得！</p>

        {/* Stats */}
        <div className="flex gap-4">
          <div
            className="card-base px-5 py-4 text-center min-w-[90px]"
          >
            <div className="font-fredoka text-3xl" style={{ color: "var(--cyan)" }}>
              {result.correct}/{result.total}
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>正解</div>
          </div>
          <div className="card-base px-5 py-4 text-center min-w-[90px]">
            <div className="font-fredoka text-3xl" style={{ color: "var(--cyan)" }}>
              {result.maxCombo || result.correct}
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>最大コンボ</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3 mt-2">
          <button className="btn-primary" onClick={retry}>
            もう一回！
          </button>
          <button
            onClick={() => { dispatch({ type: "CLEAR" }); router.push("/"); }}
            className="w-full py-3 rounded-2xl text-sm border-2 transition-all hover:border-pink-400"
            style={{ background: "transparent", borderColor: "var(--border)", color: "var(--muted)" }}
          >
            ほかのゲームを遊ぶ
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          40%     { transform: translateY(-20px); }
          70%     { transform: translateY(-8px); }
        }
      `}</style>
    </main>
  );
}
