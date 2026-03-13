"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { WORDS, shuffle, Word } from "@/lib/data";
import { useGame } from "@/lib/gameStore";
import BgDeco from "@/components/BgDeco";
import GameHeader from "@/components/GameHeader";
import EffectLayer, { useEffects } from "@/components/EffectText";
import Confetti from "@/components/Confetti";

const TOTAL = 8;
const TIMER_STEP = 1.4;
const TICK_MS = 50;

export default function QuizPage() {
  const router = useRouter();
  const { dispatch } = useGame();

  const [words]     = useState<Word[]>(() => shuffle(WORDS).slice(0, TOTAL));
  const [idx, setIdx]       = useState(0);
  const [score, setScore]   = useState(0);
  const [combo, setCombo]   = useState(0);
  const [maxCombo, setMax]  = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timerPct, setTimer]  = useState(100);
  const [opts, setOpts]     = useState<Word[]>([]);
  const [answered, setAnswered] = useState(false);
  const [cardAnim, setCardAnim] = useState("");
  const [confetti, setConfetti] = useState(false);
  const { effects, spawn }  = useEffects();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timerVal = useRef(100);
  const answered_ref = useRef(false);

  const buildOptions = useCallback((w: Word) => {
    const wrongs = shuffle(WORDS.filter((x) => x.jp !== w.jp)).slice(0, 3);
    return shuffle([w, ...wrongs]);
  }, []);

  const startTimer = useCallback((onTimeout: () => void) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerVal.current = 100;
    setTimer(100);
    timerRef.current = setInterval(() => {
      timerVal.current -= TIMER_STEP;
      setTimer(Math.max(0, timerVal.current));
      if (timerVal.current <= 0) {
        clearInterval(timerRef.current!);
        if (!answered_ref.current) onTimeout();
      }
    }, TICK_MS);
  }, []);

  const advance = useCallback((nextIdx: number) => {
    if (nextIdx >= TOTAL) {
      if (timerRef.current) clearInterval(timerRef.current);
      return "end";
    }
    setIdx(nextIdx);
    setOpts(buildOptions(words[nextIdx]));
    setAnswered(false);
    answered_ref.current = false;
    setCardAnim("");
    return "ok";
  }, [words, buildOptions]);

  const handleTimeout = useCallback(() => {
    answered_ref.current = true;
    setAnswered(true);
    setCombo(0);
    setTimeout(() => {
      const next = idx + 1;
      if (next >= TOTAL) {
        endGame(score, correct, combo);
      } else {
        advance(next);
        startTimer(() => handleTimeout());
      }
    }, 900);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, score, correct, combo]);

  const endGame = useCallback((finalScore: number, finalCorrect: number, finalMaxCombo: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    dispatch({
      type: "SET_RESULT",
      payload: { score: finalScore, correct: finalCorrect, total: TOTAL, maxCombo: finalMaxCombo, mode: "quiz" },
    });
    router.push("/result");
  }, [dispatch, router]);

  // Init
  useEffect(() => {
    setOpts(buildOptions(words[0]));
    startTimer(handleTimeout);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (opt: Word, el: HTMLButtonElement) => {
    if (answered_ref.current) return;
    answered_ref.current = true;
    setAnswered(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = opt.jp === words[idx].jp;
    const rect = el.getBoundingClientRect();

    if (isCorrect) {
      const newCombo = combo + 1;
      const newCorrect = correct + 1;
      const newMax = Math.max(maxCombo, newCombo);
      const bonus = newCombo >= 3 ? 30 : 20;
      const newScore = score + bonus;
      setCombo(newCombo);
      setCorrect(newCorrect);
      setMax(newMax);
      setScore(newScore);
      setCardAnim("animate-correct");
      spawn(newCombo >= 3 ? `🔥 +${bonus}` : `+${bonus}`, newCombo >= 3 ? "#ffe566" : "#3de88a", rect.left, rect.top);
      if (newCombo >= 3) setConfetti(true);
      setTimeout(() => {
        setConfetti(false);
        const next = idx + 1;
        if (next >= TOTAL) endGame(newScore, newCorrect, newMax);
        else { advance(next); startTimer(handleTimeout); }
      }, 600);
    } else {
      setCombo(0);
      setCardAnim("animate-shake");
      spawn("✗", "#ff5555", rect.left, rect.top);
      setTimeout(() => {
        const next = idx + 1;
        if (next >= TOTAL) endGame(score, correct, maxCombo);
        else { advance(next); startTimer(handleTimeout); }
      }, 900);
    }
  };

  if (!words[idx] || opts.length === 0) return null;
  const w = words[idx];

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-6">
      <BgDeco />
      <EffectLayer effects={effects} />
      <Confetti trigger={confetti} />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-4 animate-pop-in">
        <GameHeader score={score} timerPct={timerPct} combo={combo} />

        {/* Source chip */}
        <div
          className="flex items-center gap-2 self-start px-3 py-1.5 rounded-full text-xs border"
          style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--muted)" }}
        >
          <span className="w-2 h-2 rounded-full animate-blink" style={{ background: "var(--pink)" }} />
          {w.song}
        </div>

        {/* Question card */}
        <div
          className={`card-base p-7 text-center flex flex-col items-center gap-3 transition-all ${cardAnim}`}
          style={{ minHeight: 160 }}
        >
          <div className="text-xs tracking-widest uppercase" style={{ color: "var(--muted)" }}>
            日本語はなに？
          </div>
          <div
            className="font-noto-kr font-black"
            style={{
              fontSize: 44,
              background: "linear-gradient(135deg, #f0eeff, #ff85b3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.2,
            }}
          >
            {w.kr}
          </div>
          <div className="italic text-sm" style={{ color: "var(--muted)" }}>{w.rom}</div>
          <div
            className="text-xs rounded-full px-3 py-1"
            style={{ background: "rgba(176,106,255,0.12)", color: "var(--purple)" }}
          >
            🎵 {w.ctx}
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-2.5">
          {opts.map((opt) => {
            const isCorrectAns = answered && opt.jp === w.jp;
            const isWrongAns   = answered && opt.jp !== w.jp;
            return (
              <button
                key={opt.jp}
                disabled={answered}
                onClick={(e) => handleAnswer(opt, e.currentTarget)}
                className="card-base py-4 px-3 text-sm font-bold text-center transition-all duration-150 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.97] disabled:cursor-not-allowed"
                style={{
                  borderColor: isCorrectAns ? "var(--correct)" : isWrongAns ? "var(--wrong)" : undefined,
                  background: isCorrectAns ? "rgba(61,232,138,0.15)" : isWrongAns ? "rgba(255,85,85,0.15)" : undefined,
                  color: isCorrectAns ? "var(--correct)" : isWrongAns ? "var(--wrong)" : "var(--white)",
                  transform: isCorrectAns ? "scale(1.04)" : undefined,
                }}
              >
                {opt.jp}
              </button>
            );
          })}
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 justify-center">
          {words.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: i < idx ? "var(--correct)" : i === idx ? "var(--yellow)" : "var(--border)",
                transform: i === idx ? "scale(1.3)" : i < idx ? "scale(1.2)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
