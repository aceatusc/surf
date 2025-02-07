import { EnrichedTweet } from "../post/src";

export type TDimensions = {
  width: number;
  height: number;
};

export type TLocation = {
  box: number[];
  types: string[];
  title: string;
  dimensions: TDimensions;
};

export type TPost = EnrichedTweet & {
  replies: string[];
  quoted_status_id_str?: string;
  location: string;
};

export type TPostData = {
  [key: string]: TPost;
};

export type TLocationData = {
  [key: string]: TLocation[];
};
