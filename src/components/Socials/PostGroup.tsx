import {
  EmbeddedTweet,
  TweetNotFound,
  TweetSkeleton,
  useTweet,
} from "../PostEmbed/src";
import { isColorDark } from "../UI/Utils";
import styles from "./PostGroup.module.css";
import { PostGroupType, PostType } from "./Socials";

export type PostProps = {
  postData: PostType;
  color?: string;
  apiUrl?: string;
  inThread?: boolean;
};

export const Post = ({ postData, apiUrl, inThread, color }: PostProps) => {
  const { id, ptype, replies } = postData;
  const { data, error, isLoading } = useTweet(id, apiUrl);
  if (isLoading) return <TweetSkeleton />;
  if (error || !data) return <TweetNotFound error={error} />;

  data.in_thread = inThread;
  data.tweet_type = ptype;

  return (
    <EmbeddedTweet
      tweet={data}
      id={`post-${id}`}
      // style={{ backgroundColor: `${color}06` }}
    >
      {replies &&
        replies.length > 0 &&
        replies.map((reply) => (
          <Post
            key={reply.id}
            postData={reply}
            apiUrl={apiUrl}
            inThread
            color={color}
          />
        ))}
    </EmbeddedTweet>
  );
};

export default function PostGroup({
  pgroup,
  color,
  posts,
  text,
}: PostGroupType) {
  return (
    <div id={`pgroup-${pgroup}`} className={styles.root}>
      <div
        className={styles.divider}
        style={{
          backgroundColor: color,
        }}
      />
      {posts.map((post) => (
        <Post key={post.id} postData={post} inThread={false} color={color} />
      ))}
    </div>
  );
}
