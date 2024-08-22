export type PostData = {
    pid: string;
    ptype: string;
    replies: PostData[];
}

export type QuoteData = {
    qid: number;
    qtype: string;
    bbox: number[];
    posts: PostData[];
}

export type PageData = QuoteData[];
export type DataType = PageData[];

export * from "./reader";