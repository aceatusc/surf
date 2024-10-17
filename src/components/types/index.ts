import { EnrichedTweet } from "../post/src";

export type TQuote = {
    qid: number;
    qtype: string;
    bbox: number[];
}

export type TPost = EnrichedTweet & {
    replies: string[];
    quoted_status_id_str?: string;
    locations?: number[];
}

export type TPostData = {
    [key: string]: TPost;
}

export * from "./reader";