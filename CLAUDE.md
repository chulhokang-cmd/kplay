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

## 프로젝트 개요
- 서비스명: Seollem
- 목적: 문화를 통해서 한국어를 공부하고 싶은 일본의 젊은 유저들을 위한 서비스 
- 운영사: 원티드랩 (WantedLab)

## 타겟 고객
- 20-30대 한국어를 공부하고 싶은 초보유저
- 한국어가 비지니스 레벨이상인 유저

## 핵심 서비스
1. 초보유저을 위해서 게임처럼 한국문화를 한국어로 배우는 기능
2. 유창한 유저를 위해서는 한국어를 사용해서 일할수 있는 기업을 소개

## 디자인 원칙
- 캐주얼 게임 느낌, 학습 느낌 NO
- 로그인/회원가입 없음
- 다크 테마 유지 (배경색 #0e0b1a)
- 폰트: Fredoka One (타이틀), Noto Sans KR (한국어), Noto Sans JP (일본어)

## 배포
- GitHub: https://github.com/chulhokang-cmd/kplay
- Vercel: https://kplay-peeu.vercel.app
- git push하면 Vercel 자동 배포

## 주의사항
- `lib/gameStore.tsx` 확장자는 tsx (jsx 포함이라 ts 아님)
- `"use client"` 는 게임 컴포넌트에 필수
- 새 페이지 만들 때 반드시 `"use client"` 추가