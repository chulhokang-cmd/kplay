"use client";
import { createContext, useContext, useReducer, ReactNode } from "react";

export interface GameResult {
  score: number;
  correct: number;
  total: number;
  maxCombo: number;
  mode: string;
}

interface State {
  result: GameResult | null;
}

type Action = { type: "SET_RESULT"; payload: GameResult } | { type: "CLEAR" };

const GameContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_RESULT": return { ...state, result: action.payload };
    case "CLEAR":      return { ...state, result: null };
    default:           return state;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { result: null });
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
