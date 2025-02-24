import { createContext, useState } from "react";

export interface IThreadContext {
  expandThread: string | null;
  setExpandThread: (id: string | null) => void;
}

export const ThreadContext = createContext<IThreadContext>({
  expandThread: null,
  setExpandThread: () => {},
});

export function useThreadContextProps(): IThreadContext {
  const [expandThread, setExpandThread] = useState<string | null>(null);
  return {
    expandThread,
    setExpandThread,
  };
}
