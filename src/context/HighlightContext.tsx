import { createContext, useState } from "react";

export interface IHighlightContext {
  highlightedQuote: number | null;
  setHighlightedQuote: (id: number | null) => void;
}

export const HighlightContext = createContext<IHighlightContext>({
  highlightedQuote: null,
  setHighlightedQuote: () => {},
});

export function useHighlightContextProps(): IHighlightContext {
  const [highlightedQuote, setHighlightedQuote] = useState<number | null>(null);
  return {
    highlightedQuote,
    setHighlightedQuote,
  };
}
