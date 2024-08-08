import {
  EmbeddedTweet,
  EnrichedTweet,
  enrichTweet,
  QuotedTweet,
  TweetActions,
  TweetBody,
  TweetContainer,
  TweetInfo,
  TweetInReplyTo,
  TweetMedia,
  TweetNotFound,
  TweetSkeleton,
  TwitterComponents,
  useTweet,
  type TweetProps,
} from "../PostEmbed/src";
import type { Tweet } from "react-tweet/api";
import styles from "./Post.module.css";
import Pill from "../UI/Pill";

type Props = {
  tweet: Tweet;
  components?: TwitterComponents;
};

const PostHeader = ({ tweet }: { tweet: EnrichedTweet }) => {
  const { user } = tweet;
  const userUrl = `https://twitter.com/${user.screen_name}`;

  return (
    <div className={styles.tweet_header__container}>
      <a
        href={userUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.tweet_header__user}
      >
        <div className={styles.tweet_header__user__avatar}>
          <img
            src={user.profile_image_url_https}
            alt={`profile picture of ${user.name}`}
          />
        </div>
        <div className={styles.tweet_header__user__names}>
          <span className={styles.tweet_header__user__dn}>{user.name}</span>
          <span className={styles.tweet_header__user__sn}>
            @{user.screen_name}
            <a
              className={styles.tweet_header__user__follow}
              href={user.follow_url}
            >
              +Follow
            </a>
          </span>
        </div>
      </a>
      <Pill className={styles.tweet_header__type}>Author</Pill>
    </div>
  );
};

const PostActions = ({ tweet }: { tweet: EnrichedTweet }) => {
  const favoriteCount = tweet.favorite_count;
  return (
    <div className={styles.tweet_actions__container}>
      <div className={styles.tweet_actions_list}>
        <div className={styles.tweet_actions__icon}>
          <div className={styles.tweet_actions__icon_wrapper}>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={styles.tweet_actions__like_icon}
            >
              <g>
                <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
              </g>
            </svg>
          </div>
          <span className={styles.tweet_actions_icon_text}>
            {favoriteCount}
          </span>
        </div>
        <div className={styles.tweet_actions__icon}>
          <div className={styles.tweet_actions__icon_wrapper}>
            <svg
              viewBox="0 0 24 24"
              className={styles.tweet_actions__reply_icon}
              aria-hidden="true"
            >
              <g>
                <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01z"></path>
              </g>
            </svg>
          </div>
          <span className={styles.tweet_actions_icon_text}>Reply in X</span>
        </div>
      </div>
    </div>
  );
};

export const PostCard = ({ tweet: t, components }: Props) => {
  const tweet = enrichTweet(t);
  return (
    <TweetContainer>
      <PostHeader tweet={tweet} />
      {tweet.in_reply_to_status_id_str && <TweetInReplyTo tweet={tweet} />}
      <TweetBody tweet={tweet} />
      {tweet.mediaDetails?.length ? (
        <div style={{ flexBasis: "36%", marginLeft: "1rem" }}>
          <TweetMedia tweet={tweet} components={components} />
        </div>
      ) : null}
      {/* <div style={{ display: "flex", width: "100%" }}>
        <div style={{ flexGrow: 1, flexBasis: "60%" }}>
          <TweetBody tweet={tweet} />
        </div>
        {tweet.mediaDetails?.length ? (
          <div style={{ flexBasis: "36%", marginLeft: "1rem" }}>
            <TweetMedia tweet={tweet} components={components} />
          </div>
        ) : null}
      </div> */}
      {tweet.quoted_tweet && <QuotedTweet tweet={tweet.quoted_tweet} />}
      <TweetInfo tweet={tweet} />
      <PostActions tweet={tweet} />
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
