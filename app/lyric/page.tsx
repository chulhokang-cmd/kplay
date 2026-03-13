"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LYRICS, shuffle, LyricItem } from "@/lib/data";
import { useGame } from "@/lib/gameStore";
import BgDeco from "@/components/BgDeco";
import GameHeader from "@/components/GameHeader";
import EffectLayer, { useEffects } from "@/components/EffectText";
import Confetti from "@/components/Confetti";

export default function LyricPage() {
  const router = useRouter();
  const { dispatch } = useGame();
  const { effects, spawn } = useEffects();

  const [items]   = useState<LyricItem[]>(() => shuffle(LYRICS).slice(0, 5));
  const [idx, setIdx]     = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMax] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [filled, setFilled]     = useState<string | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [shuffledOpts] = useState(() => items.map(item => shuffle(item.opts)));

  const endGame = useCallback((s: number, c: number, mc: number) => {
    dispatch({ type: "SET_RESULT", payload: { score: s, correct: c, total: items.length, maxCombo: mc, mode: "lyric" } });
    router.push("/result");
  }, [dispatch, items.length, router]);

  const handleAnswer = (opt: string, el: HTMLButtonElement) => {
    if (answered) return;
    setAnswered(true);
    const item = items[idx];
    const isCorrect = opt === item.blank;
    const rect = el.getBoundingClientRect();

    if (isCorrect) {
      const newCombo = combo + 1;
      const newCorrect = correct + 1;
      const newMax = Math.max(maxCombo, newCombo);
      const bonus = newCombo >= 3 ? 35 : 25;
      const newScore = score + bonus;
      setCombo(newCombo); setCorrect(newCorrect); setMax(newMax); setScore(newScore);
      setFilled(item.blank);
      spawn(newCombo >= 3 ? `🎵 +${bonus}` : `+${bonus}`, newCombo >= 3 ? "#ffe566" : "#3de88a", rect.left, rect.top);
      if (newCombo >= 3) setConfetti(true);
      setTimeout(() => {
        setConfetti(false);
        const next = idx + 1;
        if (next >= items.length) { endGame(newScore, newCorrect, newMax); return; }
        setIdx(next); setAnswered(false); setFilled(null);
      }, 750);
    } else {
      setCombo(0);
      setFilled(item.blank);
      spawn("✗", "#ff5555", rect.left, rect.top);
      setTimeout(() => {
        const next = idx + 1;
        if (next >= items.length) { endGame(score, correct, maxCombo); return; }
        setIdx(next); setAnswered(false); setFilled(null);
      }, 950);
    }
  };

  if (!items[idx]) return null;
  const item = items[idx];
  const opts = shuffledOpts[idx];

  // Build display line
  const parts = item.line.split("<BLANK>");

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-6">
      <BgDeco />
      <EffectLayer effects={effects} />
      <Confetti trigger={confetti} />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-4 animate-pop-in">
        <GameHeader score={score} showTimer={false} combo={combo} />

        {/* Lyric card */}
        <div
          className="card-base p-6 text-center relative overflow-hidden"
          style={{ minHeight: 180 }}
        >
          {/* Deco ♪ */}
          <span
            className="absolute top-[-10px] right-4 text-7xl pointer-events-none select-none"
            style={{ color: "var(--purple)", opacity: 0.06, lineHeight: 1 }}
          >♪</span>

          {/* Song tag */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs mb-4 border"
            style={{
              background: "rgba(176,106,255,0.15)",
              borderColor: "rgba(176,106,255,0.3)",
              color: "var(--purple)",
            }}
          >
            🎵 {item.song}
          </div>

          {/* Line with blank */}
          <div
            className="font-noto-kr font-black text-2xl leading-loose mb-3"
            style={{ color: "var(--white)" }}
          >
            {parts[0]}
            <span
              className="inline-block min-w-[80px] border-b-2 px-1 transition-all duration-200"
              style={{
                borderColor: filled ? "var(--correct)" : "var(--pink)",
                color: filled ? "var(--correct)" : "var(--pink)",
                verticalAlign: "bottom",
              }}
            >
              {filled ?? "\u3000".repeat(item.blank.length)}
            </span>
            {parts[1]}
          </div>

          <div className="text-sm" style={{ color: "var(--muted)" }}>{item.jp}</div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-2.5 justify-center">
          {opts.map((opt) => {
            const isCorrectAns = answered && opt === item.blank;
            const isWrongAns   = answered && opt !== item.blank;
            return (
              <button
                key={opt}
                disabled={answered}
                onClick={(e) => handleAnswer(opt, e.currentTarget)}
                className="font-noto-kr font-black text-lg card-base px-5 py-3 transition-all duration-200 hover:-translate-y-1 hover:scale-105 active:scale-95"
                style={{
                  borderColor: isCorrectAns ? "var(--correct)" : isWrongAns ? "var(--wrong)" : undefined,
                  background:  isCorrectAns ? "rgba(61,232,138,0.15)" : isWrongAns ? "rgba(255,85,85,0.15)" : undefined,
                  color:       isCorrectAns ? "var(--correct)" : isWrongAns ? "var(--wrong)" : "var(--white)",
                  transform:   isCorrectAns ? "scale(1.08)" : undefined,
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 justify-center">
          {items.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: i < idx ? "var(--correct)" : i === idx ? "var(--yellow)" : "var(--border)",
                transform: i === idx ? "scale(1.3)" : undefined,
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
