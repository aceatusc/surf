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
  [key: string]: string[];
};

export type TSummaryData = {
  [key: string]: TSummary;
};

export type TContext = {
  [key: string]: string;
};

export type TContextData = {
  [key: string]: TContext;
};

export type TQuality = {
  [key: string]: number;
};

export type TQualityData = {
  [key: string]: TQuality;
};

export const ptypeConfig = {
  "Related Work": { icon: "📖", priority: 5 },
  Perspective: { icon: "💬", priority: 4 },
  Critique: { icon: "⚠️", priority: 2 },
  Overview: { icon: "🧵", priority: 0 },
  Teaser: { icon: "🔎", priority: 7 },
  "Q&A": { icon: "❓", priority: 3 },
  Resource: { icon: "🔗", priority: 6 },
  Author: { icon: "✍️", priority: 1 },
};

export const FOCUS_THRESHOLD = (type: string) => {
  return type in ["Critique", "Q&A", "Perspective"]
    ? 0.5
    : type === "Teaser"
    ? 0.1
    : 0.3;
};

export const getIcon = (type: string) => {
  if (type in ptypeConfig) {
    return ptypeConfig[type as keyof typeof ptypeConfig].icon;
  }
  return null;
};
