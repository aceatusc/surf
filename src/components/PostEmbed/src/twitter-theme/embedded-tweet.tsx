import type { Tweet } from "../api/index.js";
import type { TwitterComponents } from "./types.js";
import { TweetContainer } from "./tweet-container.js";
import { TweetHeader } from "./tweet-header.js";
import { TweetInReplyTo } from "./tweet-in-reply-to.js";
import { TweetBody } from "./tweet-body.js";
import { TweetMedia } from "./tweet-media.js";
import { TweetInfo } from "./tweet-info.js";
import { TweetActions } from "./tweet-actions.js";
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
  groupId?: number;
  groupColor?: string;
  style?: React.CSSProperties;
};

export const EmbeddedTweet = ({
  tweet: t,
  components,
  children,
  id,
  groupId,
  groupColor,
  style,
}: Props) => {
  // useMemo does nothing for RSC but it helps when the component is used in the client (e.g by SWR)
  const tweet = useMemo(() => enrichTweet(t), [t]);
  const jumpToQuote = (e: MouseEvent) => {
    e.stopPropagation();
    const groupId = (e.target as HTMLElement).id.split("_")[0].slice(1);
    const element = document.getElementById(`highlight_group_${groupId}`);
    console.log(groupId, element);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <TweetContainer inThread={tweet.in_thread} id={id} style={style}>
      {!tweet.in_thread && (
        <div
          id={`g${groupId}_${id}`}
          className={s.tag}
          style={{
            backgroundColor: groupColor,
            marginBottom: 6.4,
            color: isColorDark(groupColor) ? "#F4F1DE" : "#2a2a2a",
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
