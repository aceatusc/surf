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
};

export const Post = ({ postData, apiUrl }: PostProps) => {
  const { id, ptype, replies } = postData;
  const { data, error, isLoading } = useTweet(id, apiUrl);
  if (isLoading) return <TweetSkeleton />;
  if (error || !data) return <TweetNotFound error={error} />;

  return <EmbeddedTweet tweet={data} ptype={ptype} />;
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
