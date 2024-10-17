import { createContext, useState } from "react";

export interface IHighlightContext {
  highlightedLocation: number | null;
  setHighlightedLocation: (id: number | null) => void;
}

export const HighlightContext = createContext<IHighlightContext>({
  highlightedLocation: null,
  setHighlightedLocation: () => {},
});

export function useHighlightContextProps(): IHighlightContext {
  const [highlightedLocation, setHighlightedLocation] = useState<number | null>(
    null
  );
  return {
    highlightedLocation,
    setHighlightedLocation,
  };
}
