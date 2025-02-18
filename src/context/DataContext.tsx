import { TLocationData, TPostData, TSummaryData } from "@/components/types";
import { createContext, useState } from "react";

export interface IDataContext {
  posts: TPostData;
  setPosts: (posts: TPostData) => void;
  locations: TLocationData;
  setLocations: (locations: TLocationData) => void;
  summaries: TSummaryData;
  setSummaries: (summaries: TSummaryData) => void;
}

export const DataContext = createContext<IDataContext>({
  posts: {},
  setPosts: () => {},
  locations: {},
  setLocations: () => {},
  summaries: {},
  setSummaries: () => {},
});

export function useDataContextProps(): IDataContext {
  const [posts, setPosts] = useState<TPostData>({});
  const [locations, setLocations] = useState<TLocationData>({});
  const [summaries, setSummaries] = useState<TSummaryData>({});
  return {
    posts,
    setPosts,
    locations,
    setLocations,
    summaries,
    setSummaries,
  };
}
