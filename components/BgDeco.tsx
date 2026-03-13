"use client";
import { useEffect, useRef } from "react";

export default function BgDeco() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const colors = ["#b06aff", "#ff4d8d", "#3de8d0"];
    for (let i = 0; i < 18; i++) {
      const s = document.createElement("div");
      const size = Math.random() * 40 + 10;
      s.style.cssText = `
        position:absolute;
        width:${size}px; height:${size}px;
        border-radius:50%;
        background:${colors[i % 3]};
        opacity:0.12;
        left:${Math.random() * 100}%;
        animation: bgFloat ${Math.random() * 8 + 6}s ${Math.random() * 8}s linear infinite;
      `;
      ref.current.appendChild(s);
    }
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
}
