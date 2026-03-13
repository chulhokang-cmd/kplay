"use client";
import { useEffect, useRef } from "react";

export interface EffectItem {
  id: number;
  text: string;
  color: string;
  x: number;
  y: number;
}

interface Props {
  effects: EffectItem[];
}

export default function EffectLayer({ effects }: Props) {
  return (
    <>
      {effects.map((ef) => (
        <div
          key={ef.id}
          className="fixed pointer-events-none z-[999] font-fredoka text-3xl effect-text"
          style={{ left: ef.x, top: ef.y, color: ef.color }}
        >
          {ef.text}
        </div>
      ))}
    </>
  );
}

let _id = 0;
export function makeEffect(
  text: string,
  color: string,
  x: number,
  y: number,
): EffectItem {
  return { id: _id++, text, color, x, y };
}

export function useEffects() {
  const { useState, useCallback } = require("react");
  const [effects, setEffects] = useState<EffectItem[]>([]);

  const spawn = useCallback((text: string, color: string, x: number, y: number) => {
    const ef = makeEffect(text, color, x, y);
    setEffects((prev: EffectItem[]) => [...prev, ef]);
    setTimeout(() => setEffects((prev: EffectItem[]) => prev.filter((e) => e.id !== ef.id)), 950);
  }, []);

  return { effects, spawn };
}
