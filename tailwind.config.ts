import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ["'Fredoka One'", "cursive"],
        yomogi: ["'Yomogi'", "cursive"],
        notoJP: ["'Noto Sans JP'", "sans-serif"],
        notoKR: ["'Noto Sans KR'", "sans-serif"],
      },
      colors: {
        bg:      "#0e0b1a",
        surface: "#1a1630",
        card:    "#221e3a",
        border:  "#35306a",
        pink:    "#ff4d8d",
        pink2:   "#ff85b3",
        yellow:  "#ffe566",
        cyan:    "#3de8d0",
        purple:  "#b06aff",
        correct: "#3de88a",
        wrong:   "#ff5555",
        muted:   "#7a748a",
      },
      animation: {
        "pop-in":    "popIn 0.5s cubic-bezier(.34,1.56,.64,1)",
        "float-up":  "floatUp 0.9s ease forwards",
        "spin-slow":  "spin 3s linear infinite",
      },
      keyframes: {
        popIn: {
          "0%":   { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        floatUp: {
          "0%":   { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-80px) scale(1.4)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
