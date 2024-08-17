import {
  EmbeddedTweet,
  TweetNotFound,
  TweetSkeleton,
  useTweet,
} from "../PostEmbed/src";
import styles from "./PostGroup.module.css";
import { PostGroupType, PostType } from "./Socials";

export type PostProps = {
  postData: PostType;
  apiUrl?: string;
  isReply?: boolean;
};

export const Post = ({ postData, apiUrl, isReply }: PostProps) => {
  const { id, ptype, replies } = postData;
  const { data, error, isLoading } = useTweet(id, apiUrl);
  if (isLoading) return <TweetSkeleton />;
  if (error || !data) return <TweetNotFound error={error} />;

  return (
    <div id={`post-${id}`}>
      <EmbeddedTweet tweet={data} ptype={ptype} isReply>
        {replies &&
          replies.length > 0 &&
          replies.map((reply) => (
            <Post
              key={reply.id}
              postData={reply}
              apiUrl={apiUrl}
              isReply={true}
            />
          ))}
      </EmbeddedTweet>
    </div>
  );
};

export default function PostGroup({ pgroup, color, posts }: PostGroupType) {
  return (
    <div id={`pgroup-${pgroup}`} className={styles.root}>
      {posts.map((post) => (
        <Post key={post.id} postData={post} />
      ))}
    </div>
  );
}
