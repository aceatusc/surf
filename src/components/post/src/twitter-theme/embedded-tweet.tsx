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
import React, { MouseEvent, ReactElement, useMemo, useState } from "react";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

type Props = {
  tweet: Tweet;
  components?: Omit<TwitterComponents, "TweetNotFound">;
  children?: React.ReactNode;
  id?: string;
  className?: string;
  onClickReply?: (event: React.MouseEvent) => void;
};

type EmbeddedTweetComp = ReactElement<Props>;

export const EmbeddedTweetReply = ({
  tweet: t,
  components,
  children,
  className,
  onClickReply,
  id,
}: Props) => {
  // useMemo does nothing for RSC but it helps when the component is used in the client (e.g by SWR)
  const tweet = useMemo(() => enrichTweet(t), [t]);

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as EmbeddedTweetComp, {
        onClickReply,
      });
    }
    return child;
  });

  return (
    <TweetContainer inThread={tweet.is_reply} id={id} className={className}>
      <TweetHeader tweet={tweet} components={components} />
      {tweet.in_reply_to_status_id_str && !tweet.is_reply && (
        <TweetInReplyTo tweet={tweet} />
      )}
      <TweetBody tweet={tweet} />
      {tweet.mediaDetails?.length ? (
        <TweetMedia tweet={tweet} components={components} />
      ) : null}
      {tweet.quoted_tweet && <QuotedTweet tweet={tweet.quoted_tweet} />}
      {!tweet.is_reply && <TweetInfo tweet={tweet} />}
      <TweetActions tweet={tweet} onClickReply={onClickReply} />
      {childrenWithProps}
    </TweetContainer>
  );
};

export const EmbeddedTweet = ({
  tweet: t,
  components,
  children,
  className,
  id,
}: Props) => {
  // useMemo does nothing for RSC but it helps when the component is used in the client (e.g by SWR)
  const tweet = useMemo(() => enrichTweet(t), [t]);
  const [replyTo, setReplyTo] = useState<{
    id: null | string;
    name: null | string;
  }>({ id: null, name: null });

  const handleClickReply = (e: MouseEvent) => {
    const targetId = e.currentTarget.getAttribute("data-pid");
    if (tweet.id_str === targetId && replyTo.id) {
      setReplyTo({ id: null, name: null });
    } else {
      setReplyTo({
        id: targetId,
        name: e.currentTarget.getAttribute("data-name"),
      });
    }
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as EmbeddedTweetComp, {
        onClickReply: handleClickReply,
      });
    }
    return child;
  });

  return (
    <TweetContainer inThread={tweet.is_reply} id={id} className={className}>
      <TweetHeader tweet={tweet} components={components} />
      {tweet.in_reply_to_status_id_str && !tweet.is_reply && (
        <TweetInReplyTo tweet={tweet} />
      )}
      <TweetBody tweet={tweet} />
      {tweet.mediaDetails?.length ? (
        <TweetMedia tweet={tweet} components={components} />
      ) : null}
      {tweet.quoted_tweet && <QuotedTweet tweet={tweet.quoted_tweet} />}
      <TweetActions tweet={tweet} onClickReply={handleClickReply} />
      {replyTo.id && (
        <div className="flex w-full items-center space-x-2 h-11 mt-2 mb-3.5">
          <Input
            placeholder={`Replying to @${replyTo.name}`}
            className="rounded-xl h-full text-lg"
          />
          <Button type="submit" className="h-full text-lg rounded-xl font-bold">
            <FontAwesomeIcon icon={faPaperPlane} />
          </Button>
        </div>
      )}
      {replyTo.id && childrenWithProps}
    </TweetContainer>
  );
};
