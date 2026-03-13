"use client";
import { useRouter } from "next/navigation";

interface Props {
  score: number;
  showTimer?: boolean;
  timerPct?: number;       // 0–100
  combo?: number;
  extra?: React.ReactNode;
}

export default function GameHeader({ score, showTimer = true, timerPct = 100, combo = 0, extra }: Props) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 w-full">
      <button
        className="btn-back"
        onClick={() => router.push("/")}
        aria-label="ホームへ戻る"
      >
        ←
      </button>

      {/* Score */}
      <span
        className="font-fredoka text-2xl min-w-[56px]"
        style={{ color: "var(--yellow)", textShadow: "0 0 12px rgba(255,229,102,0.6)" }}
      >
        {score}
      </span>

      {/* Timer bar */}
      {showTimer && (
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--card)" }}>
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${timerPct}%`,
              background: "linear-gradient(90deg, var(--cyan), var(--pink))",
            }}
          />
        </div>
      )}

      {/* Combo badge */}
      {combo >= 2 && (
        <span
          className="font-fredoka text-sm px-3 py-1 rounded-full text-white whitespace-nowrap"
          style={{ background: "linear-gradient(135deg, var(--pink), var(--purple))" }}
        >
          🔥 {combo}x
        </span>
      )}

      {extra}
    </div>
  );
}
