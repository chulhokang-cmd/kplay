import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "@/lib/gameStore";

export const metadata: Metadata = {
  title: "K★PLAY — 遊びながら韓国語♪",
  description: "K-POPや韓国ドラマで楽しく韓国語を学ぼう！ログイン不要、いつでも遊べる",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
