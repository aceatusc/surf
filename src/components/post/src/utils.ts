import type {
  TweetBase,
  Tweet,
  QuotedTweet,
  MediaDetails,
  HashtagEntity,
  SymbolEntity,
  Indices,
  UserMentionEntity,
  UrlEntity,
  MediaEntity,
  MediaAnimatedGif,
  MediaVideo,
} from "./api/index.js";

export type TweetCoreProps = {
  id: string;
  onError?(error: any): any;
};

const getTweetUrl = (tweet: TweetBase) =>
  `https://x.com/${tweet.user.screen_name}/status/${tweet.id_str}`;

const getUserUrl = (usernameOrTweet: string | TweetBase) =>
  `https://x.com/${
    typeof usernameOrTweet === "string"
      ? usernameOrTweet
      : usernameOrTweet.user.screen_name
  }`;

const getLikeUrl = (tweet: TweetBase) =>
  `https://x.com/intent/like?tweet_id=${tweet.id_str}`;

const getReplyUrl = (tweet: TweetBase) =>
  `https://x.com/intent/tweet?in_reply_to=${tweet.id_str}`;

const getFollowUrl = (tweet: TweetBase) =>
  `https://x.com/intent/follow?screen_name=${tweet.user.screen_name}`;

const getHashtagUrl = (hashtag: HashtagEntity) =>
  `https://x.com/hashtag/${hashtag.text}`;

const getSymbolUrl = (symbol: SymbolEntity) =>
  `https://x.com/search?q=%24${symbol.text}`;

const getInReplyToUrl = (tweet: Tweet) =>
  `https://x.com/${tweet.in_reply_to_screen_name}/status/${tweet.in_reply_to_status_id_str}`;

export const getMediaUrl = (
  media: MediaDetails,
  size: "small" | "medium" | "large"
): string => {
  const url = new URL(media.media_url_https);
  const extension = url.pathname.split(".").pop();

  if (!extension) return media.media_url_https;

  url.pathname = url.pathname.replace(`.${extension}`, "");
  url.searchParams.set("format", extension);
  url.searchParams.set("name", size);

  return url.toString();
};

export const getMp4Videos = (media: MediaAnimatedGif | MediaVideo) => {
  if (!media.video_info) return [];
  const { variants } = media.video_info;
  const sortedMp4Videos = variants
    .filter((vid) => vid.content_type === "video/mp4")
    .sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0));

  return sortedMp4Videos;
};

export const getMp4Video = (media: MediaAnimatedGif | MediaVideo) => {
  const mp4Videos = getMp4Videos(media);
  // Skip the highest quality video and use the next quality
  return mp4Videos.length > 1 ? mp4Videos[1] : mp4Videos[0];
};

export const formatNumber = (n: number): string => {
  if (n > 999999) return `${(n / 1000000).toFixed(1)}M`;
  if (n > 999) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
};

type TextEntity = {
  indices: Indices;
  type: "text";
};

type TweetEntity =
  | HashtagEntity
  | UserMentionEntity
  | UrlEntity
  | MediaEntity
  | SymbolEntity;

type EntityWithType =
  | TextEntity
  | (HashtagEntity & { type: "hashtag" })
  | (UserMentionEntity & { type: "mention" })
  | (UrlEntity & { type: "url" })
  | (MediaEntity & { type: "media" })
  | (SymbolEntity & { type: "symbol" });

type Entity = {
  text: string;
} & (
  | TextEntity
  | (HashtagEntity & { type: "hashtag"; href: string })
  | (UserMentionEntity & { type: "mention"; href: string })
  | (UrlEntity & { type: "url"; href: string })
  | (MediaEntity & { type: "media"; href: string })
  | (SymbolEntity & { type: "symbol"; href: string })
);

export type EnrichedTweet = Omit<Tweet, "entities" | "quoted_tweet"> & {
  url: string;
  user: {
    url: string;
    follow_url: string;
    description: string;
    followers_count: number;
    entities: any;
  };
  like_url: string;
  reply_url: string;
  in_reply_to_url?: string;
  entities: Entity[];
  quoted_tweet?: EnrichedTweet;
  tweet_type?: string;
  replies: string[];
  quoted_status_id_str?: string;
  location?: string;
  thread_score?: number;
  score?: number;
  reply_count: number;
  root: string;
  in_thread?: string[];
  is_branch?: boolean;
};

export type EnrichedQuotedTweet = Omit<QuotedTweet, "entities"> & {
  url: string;
  entities: Entity[];
};
