# K★PLAY — 遊びながら韓国語♪

K-POPや韓国ドラマの歌詞・台詞でゲーム感覚に韓国語を学べる、ログイン不要のカジュアルゲームアプリです。

## ゲームモード

| モード | 説明 |
|--------|------|
| ⚡ クイズ | K-POP単語のタイムアタック。コンボで高得点！ |
| 🌸 落ちてくる | 降ってくる単語を素早くタップ！反射神経勝負 |
| 🔗 マッチング | 韓国語↔日本語を60秒でペアに |
| 🎤 歌詞埋め | 好きな曲の歌詞の空欄を埋めよう |

## セットアップ

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## ビルド & デプロイ

```bash
npm run build
npm start
```

Vercelに1コマンドでデプロイ可能：

```bash
npx vercel --prod
```

## プロジェクト構成

```
kplay/
├── app/
│   ├── page.tsx          # ホーム (ゲーム選択)
│   ├── quiz/page.tsx     # クイズゲーム
│   ├── fall/page.tsx     # 落ちてくる単語ゲーム
│   ├── match/page.tsx    # マッチングゲーム
│   ├── lyric/page.tsx    # 歌詞埋めゲーム
│   ├── result/page.tsx   # 結果画面
│   ├── layout.tsx        # ルートレイアウト
│   └── globals.css       # グローバルスタイル
├── components/
│   ├── BgDeco.tsx        # 背景アニメーション
│   ├── GameHeader.tsx    # ゲームヘッダー (スコア・タイマー)
│   ├── EffectText.tsx    # 正解/不正解エフェクト
│   └── Confetti.tsx      # コンフェッティアニメーション
├── lib/
│   ├── data.ts           # 単語・歌詞データ & ユーティリティ
│   └── gameStore.ts      # ゲーム状態管理 (Context API)
└── README.md
```

## 単語・歌詞データの追加

`lib/data.ts` を編集するだけでコンテンツを追加できます：

```ts
// 単語追加
export const WORDS: Word[] = [
  { kr: "새로운", rom: "sae-ro-un", jp: "新しい", song: "アーティスト • 曲名", ctx: "曲名から" },
  // ...
];

// 歌詞穴埋め追加
export const LYRICS: LyricItem[] = [
  {
    song: "アーティスト • 曲名",
    line: "韓国語の歌詞 <BLANK> の続き",
    blank: "答え",
    jp: "日本語訳",
    opts: ["答え", "不正解1", "不正解2", "不正解3"],
  },
  // ...
];
```

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Context API** (状態管理)
- ログイン不要・DB不要・サーバーレス対応
