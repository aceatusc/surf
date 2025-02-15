import { TLocationData, TPostData } from "@/components/types";
import { createContext, useState } from "react";

export interface IDataContext {
  posts: TPostData;
  setPosts: (posts: TPostData) => void;
  locations: TLocationData;
  setLocations: (locations: TLocationData) => void;
}

export const DataContext = createContext<IDataContext>({
  posts: {},
  setPosts: () => {},
  locations: {},
  setLocations: () => {},
});

export function useDataContextProps(): IDataContext {
  const [posts, setPosts] = useState<TPostData>({});
  const [locations, setLocations] = useState<TLocationData>({});
  return {
    posts,
    setPosts,
    locations,
    setLocations,
  };
}
