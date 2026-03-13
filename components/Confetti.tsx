"use client";
import { useEffect } from "react";

export default function Confetti({ trigger }: { trigger: boolean }) {
  useEffect(() => {
    if (!trigger) return;
    const colors = ["#ff4d8d", "#ffe566", "#3de8d0", "#b06aff", "#ff85b3"];
    const pieces: HTMLDivElement[] = [];
    for (let i = 0; i < 45; i++) {
      const p = document.createElement("div");
      const size = Math.random() * 10 + 5;
      p.style.cssText = `
        position:fixed; pointer-events:none; z-index:999;
        width:${size}px; height:${size}px;
        border-radius:2px;
        left:${Math.random() * 100}vw;
        background:${colors[i % colors.length]};
        animation: confettiFall ${Math.random() * 1 + 0.8}s ${Math.random() * 0.3}s linear forwards;
        transform: rotate(${Math.random() * 360}deg);
      `;
      document.body.appendChild(p);
      pieces.push(p);
    }
    const t = setTimeout(() => pieces.forEach((p) => p.remove()), 1600);
    return () => { clearTimeout(t); pieces.forEach((p) => p.remove()); };
  }, [trigger]);

  return null;
}
