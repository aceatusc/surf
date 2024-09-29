import { CSSProperties } from "react";
import type { EnrichedTweet } from "../utils.js";
import { TweetInfoCreatedAt } from "./tweet-info-created-at.jsx";
import s from "./tweet-info.module.css";

export const TweetInfo = ({
  tweet,
  style,
}: {
  tweet: EnrichedTweet;
  style?: CSSProperties;
}) => (
  <div className={s.info} data-in-thread={tweet.is_reply} style={style}>
    <TweetInfoCreatedAt tweet={tweet} />
  </div>
);
