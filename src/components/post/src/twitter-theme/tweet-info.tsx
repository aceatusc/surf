import { CSSProperties } from "react";
import type { EnrichedTweet } from "../utils.js";
import { TweetInfoCreatedAt } from "./tweet-info-created-at.jsx";
import s from "./tweet-info.module.css";

export const TweetInfo = ({
  tweet,
  style,
  inThread = false,
}: {
  tweet: EnrichedTweet;
  style?: CSSProperties;
  inThread?: boolean;
}) => (
  <div className={s.info} data-in-thread={inThread} style={style}>
    <TweetInfoCreatedAt tweet={tweet} />
  </div>
);
