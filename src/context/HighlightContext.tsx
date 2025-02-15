import { createContext, useState } from "react";

export interface IHighlightContext {
  highlightedLocation: string | null;
  setHighlightedLocation: (id: string | null) => void;
  highlightedType: string | null;
  setHighlightedType: (type: string | null) => void;
}

export const HighlightContext = createContext<IHighlightContext>({
  highlightedLocation: null,
  setHighlightedLocation: () => {},
  highlightedType: null,
  setHighlightedType: () => {},
});

export function useHighlightContextProps(): IHighlightContext {
  const [highlightedLocation, setHighlightedLocation] = useState<string | null>(
    null
  );
  const [highlightedType, setHighlightedType] = useState<string | null>(null);
  return {
    highlightedLocation,
    setHighlightedLocation,
    highlightedType,
    setHighlightedType,
  };
}
