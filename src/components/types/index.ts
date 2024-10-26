import { IHighlight } from "react-pdf-highlighter";
import { EnrichedTweet } from "../post/src";

export type THighlight = {
  posts?: string[];
} & IHighlight;

export type TPost = EnrichedTweet & {
  replies: string[];
  quoted_status_id_str?: string;
  locations?: Set<string>;
};

export type TPostData = {
  [key: string]: TPost;
};
