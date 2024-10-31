import { createContext, useState } from "react";

export interface IDevContext {
  studyPhase: string;
  setStudyPhase: (phase: string) => void;
}

export const DevContext = createContext<IDevContext>({
  studyPhase: "annotation",
  setStudyPhase: () => {},
});

export function useDevContextProps(): IDevContext {
  const [studyPhase, setStudyPhase] = useState<string>("annotation");

  return {
    studyPhase,
    setStudyPhase,
  };
}
