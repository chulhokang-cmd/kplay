# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (defaults to port 3000, auto-increments if in use)
npm run build    # Production build
npm run lint     # ESLint
```

## Architecture

**K★PLAY** is a client-side-only Korean language learning game app built with Next.js 14 App Router. No API routes, no database, no authentication — everything runs in the browser.

### Data flow

1. `lib/data.ts` — source of truth for all game content (Korean words and K-POP lyrics)
2. Game pages (`app/quiz`, `app/fall`, `app/match`, `app/lyric`) — consume data, run game logic locally
3. On game end, dispatch `SET_RESULT` to `lib/gameStore.tsx` (React Context + useReducer), then navigate to `/result`
4. `app/result/page.tsx` — reads result from Context, renders stats, dispatches `CLEAR` on retry/home

### State management

`lib/gameStore.tsx` holds a single `GameResult | null`. It is the only shared state in the app. The `GameProvider` wraps the root layout so all pages can access it.

### Scoring convention

- Base: **+25** per correct answer
- Combo bonus: **+10** extra when combo ≥ 3 (total +35)
- Quiz and Lyric modes support combo; Fall and Match do not

### Styling

- Tailwind CSS with a custom dark-purple theme defined as CSS variables in `app/globals.css`
- Key palette vars: `--pink` (primary accent), `--yellow` (scores), `--cyan`, `--correct`, `--wrong`
- Custom keyframe animations (pop-in, float-up, shake, confettiFall, etc.) are defined in `globals.css` and referenced via Tailwind `animate-*` classes in `tailwind.config.ts`
- Mobile-first layout, max content width `max-w-sm` (448px)

### Adding new content

All game content lives in `lib/data.ts`:
- `WORDS` — vocabulary used by Quiz and Fall/Match games (fields: `kr`, `rom`, `jp`, `song`, `ctx`)
- `LYRICS` — fill-in-the-blank items for Lyric game (fields: `song`, `line` with `<BLANK>`, `blank`, `jp`, `opts`)
- `shuffle()` — Fisher-Yates utility used by game pages to randomize options
