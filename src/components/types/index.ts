export type TQuote = {
    qid: number;
    qtype: string;
    bbox: number[];
}

export type TPost = {
    pid: string;
    ptype: string;
    replies: TPost[];
    quotes?: number[];
}

export * from "./reader";