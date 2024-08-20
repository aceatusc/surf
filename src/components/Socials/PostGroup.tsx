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
  apiUrl?: string;
  inThread?: boolean;
};

export const Post = ({ postData, apiUrl, inThread }: PostProps) => {
  const { id, ptype, replies } = postData;
  const { data, error, isLoading } = useTweet(id, apiUrl);
  if (isLoading) return <TweetSkeleton />;
  if (error || !data) return <TweetNotFound error={error} />;

  data.in_thread = inThread;
  data.tweet_type = ptype;

  return (
    <div id={`post-${id}`}>
      <EmbeddedTweet tweet={data}>
        {replies &&
          replies.length > 0 &&
          replies.map((reply) => (
            <Post key={reply.id} postData={reply} apiUrl={apiUrl} inThread />
          ))}
      </EmbeddedTweet>
    </div>
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
        className={styles.divider_container}
        style={{
          backgroundColor: color,
          color: isColorDark(color) ? "#F4F1DE" : "#2a2a2a",
        }}
      >
        "{text}"
      </div>
      {posts.map((post) => (
        <Post key={post.id} postData={post} inThread={false} />
      ))}
    </div>
  );
}
