import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "@/lib/gameStore";

export const metadata: Metadata = {
  title: "설렘 Seollem — 韓国語を学んで、韓国で働こう",
  description: "K-POPや韓国ドラマで楽しく韓国語を学ぼう。上級者は韓国語を活かせる仕事も探せる！ログイン不要",
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
