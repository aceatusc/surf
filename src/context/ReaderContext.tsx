import { createContext, useState } from "react";

export interface IReaderContext {
  scale: number;
  selectedHighlight: string | null;
  setScale: (scale: number) => void;
  setSelectedHighlight: (id: string | null) => void;
}

export const ReaderContext = createContext<IReaderContext>({
  scale: 1,
  setScale: () => {},
  selectedHighlight: null,
  setSelectedHighlight: () => {},
});

export function useReaderContextProps(): IReaderContext {
  const [scale, setScale] = useState<number>(1);
  const [selectedHighlight, setSelectedHighlight] = useState<string | null>(
    null
  );
  return {
    scale,
    setScale,
    selectedHighlight,
    setSelectedHighlight,
  };
}
