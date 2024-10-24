import { createContext, useState } from "react";

export interface IDevContext {
  annotationMode: boolean;
  setAnnotationMode: (mode: boolean) => void;
}

export const DevContext = createContext<IDevContext>({
  annotationMode: false,
  setAnnotationMode: () => {},
});

export function useDevContextProps(): IDevContext {
  const [annotationMode, setAnnotationMode] = useState<boolean>(false);

  return {
    annotationMode,
    setAnnotationMode,
  };
}
