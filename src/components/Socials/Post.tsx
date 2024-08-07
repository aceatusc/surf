import {
  EmbeddedTweet,
  EnrichedTweet,
  enrichTweet,
  TweetContainer,
  TweetNotFound,
  TweetSkeleton,
  TwitterComponents,
  useTweet,
  type TweetProps,
} from "react-tweet";
import type { Tweet } from "react-tweet/api";
import styles from "./Post.module.css";

type Props = {
  tweet: Tweet;
  components?: TwitterComponents;
};

const PostHeader = ({ tweet }: { tweet: EnrichedTweet }) => {
  return (
    <div className={styles.tweet_header__container}>
      <a href={tweet.user.url} target="_blank" rel="noopener noreferrer">
        {tweet.user.name}
      </a>
    </div>
  );
};

export const PostCard = ({ tweet: t, components }: Props) => {
  const tweet = enrichTweet(t);
  return (
    <TweetContainer>
      <PostHeader tweet={tweet} />
    </TweetContainer>
  );
};

export const Post = ({
  id,
  apiUrl,
  fallback = <TweetSkeleton />,
  components,
  onError,
}: TweetProps) => {
  const { data, error, isLoading } = useTweet(id, apiUrl);

  if (isLoading) return fallback;
  if (error || !data) {
    const NotFound = components?.TweetNotFound || TweetNotFound;
    return <NotFound error={onError ? onError(error) : error} />;
  }

  return <EmbeddedTweet tweet={data} />;
};
