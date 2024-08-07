import { createContext, useState } from "react";

export interface IHighlightContext {
  highlightedBlock: number | null;
  setHighlightedBlock: (id: number | null) => void;
}

export const HighlightContext = createContext<IHighlightContext>({
  highlightedBlock: null,
  setHighlightedBlock: () => {},
});

export function useHighlightContextProps(): IHighlightContext {
  const [highlightedBlock, setHighlightedBlock] = useState<number | null>(null);
  return { highlightedBlock, setHighlightedBlock };
}
