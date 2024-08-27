import type { Tweet } from "../api/index.js";
import type { TwitterComponents } from "./types.jsx";
import { TweetContainer } from "./tweet-container.jsx";
import { TweetHeader } from "./tweet-header.jsx";
import { TweetInReplyTo } from "./tweet-in-reply-to.jsx";
import { TweetBody } from "./tweet-body.jsx";
import { TweetMedia } from "./tweet-media.jsx";
import { TweetInfo } from "./tweet-info.jsx";
import { TweetActions } from "./tweet-actions.jsx";
import { QuotedTweet } from "./quoted-tweet/index.js";
import { enrichTweet } from "../utils.js";
import React, { MouseEvent, useMemo } from "react";
import s from "./tweet-header.module.css";

export function isColorDark(color: string | undefined): boolean {
  if (!color) return false;
  color = color.replace("#", "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 130;
}

type Props = {
  tweet: Tweet;
  components?: Omit<TwitterComponents, "TweetNotFound">;
  children?: React.ReactNode;
  id?: string;
  quoteId?: number;
  quoteColor?: string;
  style?: React.CSSProperties;
};

export const EmbeddedTweet = ({
  tweet: t,
  components,
  children,
  id,
  quoteId,
  quoteColor,
  style,
}: Props) => {
  // useMemo does nothing for RSC but it helps when the component is used in the client (e.g by SWR)
  const tweet = useMemo(() => enrichTweet(t), [t]);
  const jumpToQuote = (e: MouseEvent) => {
    e.stopPropagation();
    const quoteId = (e.target as HTMLElement).id.split("_")[0].slice(1);
    const element = document.getElementById(`highlight_${quoteId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <TweetContainer inThread={tweet.in_thread} id={id} style={style}>
      {!tweet.in_thread && (
        <div
          id={`g${quoteId}_${id}`}
          className={s.tag}
          style={{
            backgroundColor: quoteColor,
            marginBottom: 6.4,
            color: isColorDark(quoteColor) ? "#F4F1DE" : "#2a2a2a",
            cursor: "pointer",
          }}
          onClick={jumpToQuote}
        >{`← Jump to Quote`}</div>
      )}
      <TweetHeader tweet={tweet} components={components} />
      {tweet.in_reply_to_status_id_str && !tweet.in_thread && (
        <TweetInReplyTo tweet={tweet} />
      )}
      <TweetBody tweet={tweet} />
      {tweet.mediaDetails?.length ? (
        <TweetMedia tweet={tweet} components={components} />
      ) : null}
      {tweet.quoted_tweet && <QuotedTweet tweet={tweet.quoted_tweet} />}
      {!tweet.in_thread && <TweetInfo tweet={tweet} />}
      <TweetActions tweet={tweet} />
      {/* <TweetReplies tweet={tweet} /> */}
      {children}
    </TweetContainer>
  );
};
