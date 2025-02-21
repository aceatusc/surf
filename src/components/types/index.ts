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

export type TPostData = {
  [key: string]: EnrichedTweet;
};

export type TLocationData = {
  [key: string]: TLocation[];
};

export type TSummary = {
  [key: string]: string;
};

export type TSummaryData = {
  [key: string]: TSummary;
};

export const ptypeConfig = {
  "Related Work": { icon: "📖", priority: 5 },
  Perspective: { icon: "💬", priority: 4 },
  Critique: { icon: "⚠️", priority: 3 },
  Overview: { icon: "🧵", priority: 1 },
  Teaser: { icon: "🔎", priority: 7 },
  "Q&A": { icon: "❓", priority: 2 },
  Resource: { icon: "🔗", priority: 6 },
  // Author: { icon: "✍️", priority: 0 },
};
