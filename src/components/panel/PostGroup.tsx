import { getColorForGroup } from "../../context/ColorManager";
import {
  EmbeddedTweet,
  TweetNotFound,
  TweetSkeleton,
  useTweet,
} from "../post/src";
import styles from "./PostGroup.module.css";
import { PostGroupType, PostType } from "./Panel";

export type PostProps = {
  postData: PostType;
  groupId: number;
  apiUrl?: string;
  inThread?: boolean;
};

export const Post = ({ postData, apiUrl, inThread, groupId }: PostProps) => {
  const { id, ptype, replies } = postData;
  const { data, error, isLoading } = useTweet(id, apiUrl);
  if (isLoading) return <TweetSkeleton />;
  if (error || !data) return <TweetNotFound error={error} />;

  data.in_thread = inThread;
  data.tweet_type = ptype;
  const color = getColorForGroup(groupId);

  return (
    <EmbeddedTweet
      tweet={data}
      id={`post-${id}`}
      groupId={groupId}
      groupColor={color}
    >
      {replies &&
        replies.length > 0 &&
        replies.map((reply) => (
          <Post
            key={reply.id}
            postData={reply}
            apiUrl={apiUrl}
            groupId={groupId}
            inThread
          />
        ))}
    </EmbeddedTweet>
  );
};

export default function PostGroup({ pgroup, posts }: PostGroupType) {
  return (
    <div id={`pgroup-${pgroup}`} className={styles.root}>
      {/* <div
        className={styles.divider}
        style={{
          backgroundColor: color,
        }}
      /> */}
      {posts.map((post) => (
        <Post key={post.id} postData={post} inThread={false} groupId={pgroup} />
      ))}
    </div>
  );
}
