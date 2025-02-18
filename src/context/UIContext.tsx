import { createContext, useState } from "react";

export interface IUIContext {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const UIContext = createContext<IUIContext>({
  sidebarOpen: true,
  setSidebarOpen: () => {},
});

export function useUIContextProps(): IUIContext {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return {
    sidebarOpen,
    setSidebarOpen,
  };
}
