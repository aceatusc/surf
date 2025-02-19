import { createContext, useState } from "react";

export interface IHighlightContext {
  highlightedLocation: string | null;
  setHighlightedLocation: (id: string | null) => void;
}

export const HighlightContext = createContext<IHighlightContext>({
  highlightedLocation: null,
  setHighlightedLocation: () => {},
});

export function useHighlightContextProps(): IHighlightContext {
  const [highlightedLocation, setHighlightedLocation] = useState<string | null>(
    null
  );
  return {
    highlightedLocation,
    setHighlightedLocation,
  };
}
