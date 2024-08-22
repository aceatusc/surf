import type { EnrichedQuotedTweet } from "../../utils.js";
import { QuotedTweetContainer } from "./quoted-tweet-container.jsx";
import { QuotedTweetHeader } from "./quoted-tweet-header.jsx";
import { QuotedTweetBody } from "./quoted-tweet-body.jsx";
import { TweetMedia } from "../tweet-media.jsx";

type Props = { tweet: EnrichedQuotedTweet };

export const QuotedTweet = ({ tweet }: Props) => (
  <QuotedTweetContainer tweet={tweet}>
    <QuotedTweetHeader tweet={tweet} />
    <QuotedTweetBody tweet={tweet} />
  </QuotedTweetContainer>
);
