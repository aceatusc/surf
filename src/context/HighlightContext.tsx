import { createContext, useState } from "react";

export interface IHighlightContext {
  highlightedLocation: string | undefined;
  setHighlightedLocation: (id: string | undefined) => void;
  highlightedType: string;
  setHighlightedType: (type: string) => void;
}

export const HighlightContext = createContext<IHighlightContext>({
  highlightedLocation: undefined,
  setHighlightedLocation: () => {},
  highlightedType: "Overview",
  setHighlightedType: () => {},
});

export function useHighlightContextProps(): IHighlightContext {
  const [highlightedLocation, setHighlightedLocation] = useState<
    string | undefined
  >(undefined);
  const [highlightedType, setHighlightedType] = useState<string>("Overview");
  return {
    highlightedLocation,
    setHighlightedLocation,
    highlightedType,
    setHighlightedType,
  };
}
