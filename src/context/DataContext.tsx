import {
  TContextData,
  TLocationData,
  TPostData,
  TQualityData,
  TSummaryData,
  TTitleData,
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
  quality: TQualityData;
  setQuality: (quality: TQualityData) => void;
  focusMode: boolean;
  setFocusMode: (focusMode: boolean) => void;
  titles: TTitleData;
  setTitles: (titles: TTitleData) => void;
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
  quality: {},
  setQuality: () => {},
  titles: {},
  setTitles: () => {},
});

export function useDataContextProps(): IDataContext {
  const [posts, setPosts] = useState<TPostData>({});
  const [locations, setLocations] = useState<TLocationData>({});
  const [summaries, setSummaries] = useState<TSummaryData>({});
  const [focusMode, setFocusMode] = useState<boolean>(true);
  const [context, setContext] = useState<TContextData>({});
  const [quality, setQuality] = useState<TQualityData>({});
  const [titles, setTitles] = useState<TTitleData>({});

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
    quality,
    setQuality,
    titles,
    setTitles,
  };
}
