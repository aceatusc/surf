import { EnrichedTweet } from "../post/src";

export type THighlight = {
  bbox: number[];
  posts: string[];
  id: string;
};

export type THighlightData = {
  [key: string]: THighlight[];
};

export type TPost = EnrichedTweet & {
  replies: string[];
  quoted_status_id_str?: string;
  locations?: Set<string>;
};

export type TPostData = {
  [key: string]: TPost;
};
