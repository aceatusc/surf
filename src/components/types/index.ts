import { EnrichedTweet } from "../post/src";

export type TLocation = {
  bbox: number[];
  posts: string[];
  id: string;
};

export type TlocationData = {
  [key: string]: TLocation[];
};

export type TPost = EnrichedTweet & {
  replies: string[];
  quoted_status_id_str?: string;
  locations?: Set<string>;
};

export type TPostData = {
  [key: string]: TPost;
};
