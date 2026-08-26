import { createContext, useContext, type ReactNode } from "react";
import { useDifficulty } from "../hooks/useDifficulty";

type DifficultyContextValue = ReturnType<typeof useDifficulty>;

const DifficultyContext = createContext<DifficultyContextValue | null>(null);

export function DifficultyProvider({ children }: { children: ReactNode }) {
  const value = useDifficulty();
  return (
    <DifficultyContext.Provider value={value}>
      {children}
    </DifficultyContext.Provider>
  );
}

export function useDifficultyContext(): DifficultyContextValue {
  const ctx = useContext(DifficultyContext);
  if (!ctx)
    throw new Error(
      "useDifficultyContext must be used within DifficultyProvider"
    );
  return ctx;
}
