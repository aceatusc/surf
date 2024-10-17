"use client";

import type { ReactNode } from "react";
import type { EnrichedTweet } from "../../utils.js";
import s from "./quoted-tweet-container.module.css";

type Props = { tweet: EnrichedTweet; children: ReactNode };

export const QuotedTweetContainer = ({ tweet, children }: Props) => (
  <div
    className={s.root}
    onClick={(e) => {
      e.preventDefault();
      window.open(tweet.url, "_blank");
    }}
  >
    <article className={s.article}>{children}</article>
  </div>
);
