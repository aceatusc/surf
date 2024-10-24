import { MouseEvent } from "react";
import { EmbeddedTweet, EmbeddedTweetReply } from "../post/src";
import { TPost } from "../types";

type TPostEmbed = TPost & {
  getQuote: (id: string) => TPost | undefined;
  getReplies: (id: string) => TPost[];
  onClickReply?: (event: MouseEvent) => void;
};

export const EmbedPost = ({ getQuote, getReplies, ...post }: TPostEmbed) => {
  const Embed = post?.is_reply ? EmbeddedTweetReply : EmbeddedTweet;
  const replies = getReplies(post.id_str);
  post.quoted_tweet = getQuote(post.id_str);
  post.conversation_count = replies?.length || 0;

  return (
    <Embed
      tweet={post}
      id={`post-${post.id_str}`}
      onClickReply={post.onClickReply}
      className="my-2"
    >
      {replies &&
        replies.length > 0 &&
        replies.map((reply) => (
          <EmbedPost
            key={reply.id_str}
            {...reply}
            is_reply
            getQuote={getQuote}
            getReplies={getReplies}
          />
        ))}
    </Embed>
  );
};
