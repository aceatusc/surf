import type { TwitterComponents } from "./types.jsx";
import { TweetContainer } from "./tweet-container.jsx";
import { TweetHeader } from "./tweet-header.jsx";
import { TweetInReplyTo } from "./tweet-in-reply-to.jsx";
import { TweetBody } from "./tweet-body.jsx";
import { TweetMedia } from "./tweet-media.jsx";
import { TweetInfo } from "./tweet-info.jsx";
import { TweetActions } from "./tweet-actions.jsx";
import { QuotedTweet } from "./quoted-tweet/index.js";
import { EnrichedTweet } from "../utils.js";
import React, { MouseEvent, ReactElement, useContext, useState } from "react";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { DevContext } from "../../../../context/DevContext";
import uniqolor from "uniqolor";

type Props = {
  tweet: EnrichedTweet;
  components?: Omit<TwitterComponents, "TweetNotFound">;
  children?: React.ReactNode;
  id?: string;
  className?: string;
  onClickReply?: (event: React.MouseEvent) => void;
};

type EmbeddedTweetComp = ReactElement<Props>;

export const EmbeddedTweetReply = ({
  tweet,
  components,
  children,
  className,
  onClickReply,
  id,
}: Props) => {
  const { studyPhase } = useContext(DevContext);

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as EmbeddedTweetComp, {
        onClickReply,
      });
    }
    return child;
  });

  return (
    <TweetContainer id={id} className={className}>
      {studyPhase === "annotation" && (
        <div className="font-bold text-xl text-gray-800 mb-3">
          Tweet ID:
          <br /> {tweet.id_str}
        </div>
      )}
      <TweetHeader tweet={tweet} />
      {tweet.in_reply_to_status_id_str && <TweetInReplyTo tweet={tweet} />}
      <TweetBody tweet={tweet} />
      {tweet.mediaDetails?.length ? (
        <TweetMedia tweet={tweet} components={components} />
      ) : null}
      {tweet.quoted_tweet && <QuotedTweet tweet={tweet.quoted_tweet} />}
      <TweetInfo tweet={tweet} />
      <TweetActions tweet={tweet} onClickDiscussion={onClickReply} />
      {childrenWithProps}
    </TweetContainer>
  );
};

export const EmbeddedTweet = ({
  tweet,
  components,
  children,
  className,
  id,
}: Props) => {
  const { studyPhase } = useContext(DevContext);
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
    <TweetContainer id={id} className={className}>
      {studyPhase === "annotation" && (
        <div className="font-bold text-xl text-gray-800 mb-3">
          Tweet ID:
          <br /> {tweet.id_str}
        </div>
      )}
      <TweetHeader tweet={tweet} />
      {tweet.in_reply_to_status_id_str && <TweetInReplyTo tweet={tweet} />}
      <TweetBody tweet={tweet} />
      {tweet.mediaDetails?.length ? (
        <TweetMedia tweet={tweet} components={components} />
      ) : null}
      {tweet.quoted_tweet && <QuotedTweet tweet={tweet.quoted_tweet} />}
      <TweetActions tweet={tweet} onClickDiscussion={handleClickReply} />
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
