import {
  TContextData,
  TLocationData,
  TPostData,
  TSummaryData,
} from "@/components/types";
import { createContext, useState } from "react";

export interface IDataContext {
  posts: TPostData;
  setPosts: (posts: TPostData) => void;
  locations: TLocationData;
  setLocations: (locations: TLocationData) => void;
  summaries: TSummaryData;
  setSummaries: (summaries: TSummaryData) => void;
  context: TContextData;
  setContext: (context: TContextData) => void;
  focusMode: boolean;
  setFocusMode: (focusMode: boolean) => void;
}

export const DataContext = createContext<IDataContext>({
  posts: {},
  setPosts: () => {},
  locations: {},
  setLocations: () => {},
  summaries: {},
  setSummaries: () => {},
  focusMode: true,
  setFocusMode: () => {},
  context: {},
  setContext: () => {},
});

export function useDataContextProps(): IDataContext {
  const [posts, setPosts] = useState<TPostData>({});
  const [locations, setLocations] = useState<TLocationData>({});
  const [summaries, setSummaries] = useState<TSummaryData>({});
  const [focusMode, setFocusMode] = useState<boolean>(true);
  const [context, setContext] = useState<TContextData>({});

  return {
    posts,
    setPosts,
    locations,
    setLocations,
    summaries,
    setSummaries,
    focusMode,
    setFocusMode,
    context,
    setContext,
  };
}
