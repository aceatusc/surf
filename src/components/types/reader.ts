export type HighlightData = {
    qid: number;
    bbox: number [];
    qtype: string;
}

export type HighlightProps = {
    pageData: HighlightData[];
    pageIndex: number;
}