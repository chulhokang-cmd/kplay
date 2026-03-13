"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { WORDS, shuffle } from "@/lib/data";
import { useGame } from "@/lib/gameStore";
import BgDeco from "@/components/BgDeco";
import EffectLayer, { useEffects } from "@/components/EffectText";
import Confetti from "@/components/Confetti";

interface Card {
  id: string;
  type: "kr" | "jp";
  text: string;
  pairIdx: number;
  state: "idle" | "selected" | "matched" | "wrong";
}

export default function MatchPage() {
  const router = useRouter();
  const { dispatch } = useGame();
  const { effects, spawn } = useEffects();

  const PAIR_COUNT = 4;
  const TIME_LIMIT = 60;

  const [words]   = useState(() => shuffle(WORDS).slice(0, PAIR_COUNT));
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<Card | null>(null);
  const [score, setScore]       = useState(0);
  const [matched, setMatched]   = useState(0);
  const [timeLeft, setTime]     = useState(TIME_LIMIT);
  const [correct, setCorrect]   = useState(0);
  const [confetti, setConfetti] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const endGame = (finalScore: number, finalCorrect: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    dispatch({
      type: "SET_RESULT",
      payload: { score: finalScore, correct: finalCorrect, total: PAIR_COUNT, maxCombo: 0, mode: "match" },
    });
    router.push("/result");
  };

  useEffect(() => {
    const krCards: Card[] = words.map((w, i) => ({ id: `kr-${i}`, type: "kr", text: w.kr, pairIdx: i, state: "idle" }));
    const jpCards: Card[] = words.map((w, i) => ({ id: `jp-${i}`, type: "jp", text: w.jp, pairIdx: i, state: "idle" }));
    setCards(shuffle([...krCards, ...jpCards]));

    timerRef.current = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          dispatch({ type: "SET_RESULT", payload: { score: 0, correct: 0, total: PAIR_COUNT, maxCombo: 0, mode: "match" } });
          router.push("/result");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleTap = (card: Card, el: HTMLButtonElement) => {
    if (card.state === "matched" || card.state === "selected") return;

    if (!selected) {
      setCards(prev => prev.map(c => c.id === card.id ? { ...c, state: "selected" } : c));
      setSelected(card);
      return;
    }

    if (selected.id === card.id) {
      setCards(prev => prev.map(c => c.id === card.id ? { ...c, state: "idle" } : c));
      setSelected(null);
      return;
    }

    // Check pair
    if (selected.pairIdx === card.pairIdx && selected.type !== card.type) {
      const newScore = score + 25;
      const newCorrect = correct + 1;
      const newMatched = matched + 1;
      setScore(newScore);
      setCorrect(newCorrect);
      setMatched(newMatched);
      setCards(prev => prev.map(c =>
        c.id === card.id || c.id === selected.id ? { ...c, state: "matched" } : c
      ));
      const rect = el.getBoundingClientRect();
      spawn("+25", "#3de88a", rect.left, rect.top);
      setSelected(null);
      if (newMatched >= PAIR_COUNT) {
        setConfetti(true);
        setTimeout(() => endGame(newScore, newCorrect), 700);
      }
    } else {
      setCards(prev => prev.map(c =>
        c.id === card.id || c.id === selected.id ? { ...c, state: "wrong" } : c
      ));
      setSelected(null);
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          c.state === "wrong" ? { ...c, state: "idle" } : c
        ));
      }, 500);
    }
  };

  const timerPct = (timeLeft / TIME_LIMIT) * 100;
  const circumference = 150.8;
  const offset = circumference * (1 - timerPct / 100);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-6">
      <BgDeco />
      <EffectLayer effects={effects} />
      <Confetti trigger={confetti} />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-4 animate-pop-in">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button className="btn-back" onClick={() => { if (timerRef.current) clearInterval(timerRef.current); router.push("/"); }}>←</button>
          <span className="font-fredoka text-2xl" style={{ color: "var(--yellow)", textShadow: "0 0 12px rgba(255,229,102,0.6)" }}>{score}</span>
          <div className="flex-1" />
          {/* Timer ring */}
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="28" cy="28" r="24" fill="none" stroke="var(--card)" strokeWidth="5" />
              <circle
                cx="28" cy="28" r="24" fill="none"
                stroke="var(--cyan)" strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-fredoka text-lg" style={{ color: "var(--cyan)" }}>
              {timeLeft}
            </div>
          </div>
        </div>

        <p className="text-sm text-center" style={{ color: "var(--muted)" }}>
          韓国語と日本語をペアにしよう！
        </p>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={(e) => handleTap(card, e.currentTarget)}
              disabled={card.state === "matched"}
              className="card-base py-4 px-3 text-center font-bold transition-all duration-200 min-h-[72px] flex items-center justify-center"
              style={{
                fontFamily: card.type === "kr" ? "'Noto Sans KR', sans-serif" : undefined,
                fontSize: card.type === "kr" ? 20 : 14,
                color:
                  card.state === "matched" ? "var(--correct)" :
                  card.state === "selected" ? "var(--yellow)" :
                  card.type === "kr" ? "var(--pink)" : "var(--cyan)",
                borderColor:
                  card.state === "matched" ? "var(--correct)" :
                  card.state === "selected" ? "var(--yellow)" :
                  card.state === "wrong"    ? "var(--wrong)"  : undefined,
                background:
                  card.state === "matched" ? "rgba(61,232,138,0.12)" :
                  card.state === "selected" ? "rgba(255,229,102,0.12)" :
                  card.state === "wrong"    ? "rgba(255,85,85,0.15)"  : undefined,
                transform:
                  card.state === "selected" ? "scale(1.06)" :
                  card.state === "matched"  ? "scale(1.02)" : undefined,
                opacity: card.state === "matched" ? 0.5 : 1,
                animation: card.state === "wrong" ? "shake 0.3s ease" : undefined,
                cursor: card.state === "matched" ? "default" : "pointer",
              }}
            >
              {card.text}
              {card.state === "matched" && (
                <span className="absolute top-1 right-2 text-xs" style={{ color: "var(--correct)" }}>✓</span>
              )}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 justify-center">
          {words.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all"
              style={{ background: i < matched ? "var(--correct)" : "var(--border)" }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
