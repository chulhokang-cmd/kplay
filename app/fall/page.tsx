"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { WORDS, shuffle, Word } from "@/lib/data";
import { useGame } from "@/lib/gameStore";
import BgDeco from "@/components/BgDeco";
import EffectLayer, { useEffects } from "@/components/EffectText";

interface FallingWord {
  id: number;
  word: Word;
  x: number;
  y: number;
  speed: number;
  colorIdx: number;
  dead: boolean;
}

const COLORS = [
  { border: "#ff4d8d", bg: "rgba(255,77,141,0.18)",  text: "#ff4d8d"  },
  { border: "#3de8d0", bg: "rgba(61,232,208,0.18)",  text: "#3de8d0"  },
  { border: "#b06aff", bg: "rgba(176,106,255,0.18)", text: "#b06aff"  },
  { border: "#ffe566", bg: "rgba(255,229,102,0.18)", text: "#ffe566"  },
];

const PAIRS = 6;

export default function FallPage() {
  const router = useRouter();
  const { dispatch } = useGame();
  const { effects, spawn } = useEffects();

  const [pairs]  = useState(() => shuffle(WORDS).slice(0, PAIRS));
  const [pairIdx, setPairIdx] = useState(0);
  const [score, setScore]     = useState(0);
  const [lives, setLives]     = useState(3);
  const [correct, setCorrect] = useState(0);
  const [falling, setFalling] = useState<FallingWord[]>([]);
  const [done, setDone]       = useState(false);
  const [shakeId, setShakeId] = useState<number | null>(null);

  const pairIdxRef  = useRef(0);
  const livesRef    = useRef(3);
  const scoreRef    = useRef(0);
  const correctRef  = useRef(0);
  const doneRef     = useRef(false);
  const rafRef      = useRef<number>(0);
  const lastRef     = useRef<number>(0);
  let wordId        = useRef(0);

  const endGame = useCallback(() => {
    doneRef.current = true;
    setDone(true);
    cancelAnimationFrame(rafRef.current);
    dispatch({
      type: "SET_RESULT",
      payload: { score: scoreRef.current, correct: correctRef.current, total: PAIRS, maxCombo: 0, mode: "fall" },
    });
    router.push("/result");
  }, [dispatch, router]);

  const spawnWords = useCallback((currentPairIdx: number) => {
    const target = pairs[currentPairIdx];
    const pool = shuffle(WORDS.filter(w => w.kr !== target.kr)).slice(0, 4);
    const all = shuffle([target, ...pool]);
    const ARENA_W = 320;

    setFalling(all.map((w, i) => ({
      id: wordId.current++,
      word: w,
      x: Math.max(10, Math.min(ARENA_W - 110, (i * 70) + Math.random() * 20)),
      y: -(50 + i * 35),
      speed: 0.7 + Math.random() * 0.5,
      colorIdx: i % 4,
      dead: false,
    })));
  }, [pairs]);

  // Physics loop
  useEffect(() => {
    const ARENA_H = 300;
    const tick = (ts: number) => {
      if (doneRef.current) return;
      const dt = Math.min(ts - lastRef.current, 32);
      lastRef.current = ts;

      setFalling(prev => {
        const target = pairs[pairIdxRef.current];
        if (!target) return prev;

        let missedTarget = false;
        const next = prev.map(fw => {
          if (fw.dead) return fw;
          const ny = fw.y + fw.speed * (dt / 16);
          if (ny > ARENA_H + 20) {
            if (fw.word.kr === target.kr) missedTarget = true;
            return { ...fw, y: -(50 + Math.random() * 60), x: Math.max(10, Math.min(210, Math.random() * 260)) };
          }
          return { ...fw, y: ny };
        });

        if (missedTarget) {
          livesRef.current = Math.max(0, livesRef.current - 1);
          setLives(livesRef.current);
          if (livesRef.current <= 0) {
            setTimeout(() => endGame(), 300);
          }
        }
        return next;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame((ts) => { lastRef.current = ts; rafRef.current = requestAnimationFrame(tick); });
    return () => cancelAnimationFrame(rafRef.current);
  }, [pairs, endGame]);

  // Initial spawn
  useEffect(() => { spawnWords(0); }, [spawnWords]);

  const handleTap = (fw: FallingWord, el: HTMLElement) => {
    if (doneRef.current) return;
    const target = pairs[pairIdxRef.current];
    if (!target) return;
    const rect = el.getBoundingClientRect();

    if (fw.word.kr === target.kr) {
      scoreRef.current  += 20;
      correctRef.current += 1;
      setScore(scoreRef.current);
      setCorrect(correctRef.current);
      spawn("+20", "#3de88a", rect.left, rect.top);
      setFalling(prev => prev.map(f => f.id === fw.id ? { ...f, dead: true } : f));
      const next = pairIdxRef.current + 1;
      if (next >= PAIRS) { setTimeout(endGame, 300); return; }
      pairIdxRef.current = next;
      setPairIdx(next);
      setTimeout(() => spawnWords(next), 350);
    } else {
      spawn("✗", "#ff5555", rect.left, rect.top);
      setShakeId(fw.id);
      livesRef.current = Math.max(0, livesRef.current - 1);
      setLives(livesRef.current);
      setTimeout(() => setShakeId(null), 400);
      if (livesRef.current <= 0) setTimeout(endGame, 400);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-6">
      <BgDeco />
      <EffectLayer effects={effects} />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-4 animate-pop-in">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            className="btn-back"
            onClick={() => { doneRef.current = true; router.push("/"); }}
          >←</button>
          <span className="font-fredoka text-2xl" style={{ color: "var(--yellow)", textShadow: "0 0 12px rgba(255,229,102,0.6)" }}>{score}</span>
          <div className="flex-1" />
          <div className="flex gap-1.5">
            {[0,1,2].map(i => (
              <span key={i} className="text-xl transition-all" style={{ opacity: i < lives ? 1 : 0.2, filter: i < lives ? "none" : "grayscale(1)" }}>💗</span>
            ))}
          </div>
        </div>

        {/* Target */}
        <div
          className="card-base p-4 text-center"
          style={{ background: "var(--card)" }}
        >
          <div className="font-bold text-xl" style={{ color: "var(--white)" }}>
            {pairs[pairIdx]?.jp ?? "—"}
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            この意味の韓国語をタップ！
          </div>
        </div>

        {/* Arena */}
        <div
          className="relative rounded-2xl overflow-hidden border-2"
          style={{ height: 300, background: "var(--surface)", borderColor: "var(--border)" }}
        >
          {falling.filter(f => !f.dead).map(fw => {
            const c = COLORS[fw.colorIdx];
            return (
              <button
                key={fw.id}
                onClick={(e) => handleTap(fw, e.currentTarget)}
                className={`absolute font-noto-kr font-black text-xl px-4 py-2.5 rounded-2xl border-2 select-none transition-transform hover:scale-110 ${shakeId === fw.id ? "animate-shake" : ""}`}
                style={{
                  left: fw.x,
                  top: fw.y,
                  borderColor: c.border,
                  background: c.bg,
                  color: c.text,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                }}
              >
                {fw.word.kr}
              </button>
            );
          })}
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 justify-center">
          {pairs.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: i < pairIdx ? "var(--correct)" : i === pairIdx ? "var(--yellow)" : "var(--border)",
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
