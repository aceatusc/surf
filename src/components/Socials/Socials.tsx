import { useContext } from "react";
import styles from "./Socials.module.css";
import { HighlightContext } from "../../context/HighlightContext";
import PostGroup from "./PostGroup";
import SamplePostData from "../../assets/examples/sample1_post.json";

export type PostType = {
  id: string | undefined;
  type: string;
  replies: PostType[];
};

export type PostGroupType = {
  pgroup: number;
  color: string;
  posts: PostType[];
};

const SamplePosts = SamplePostData as PostGroupType[];

export default function Socials() {
  const { highlightedBlock } = useContext(HighlightContext);
  return (
    <div className={styles.panel} data-theme="light">
      {SamplePosts.map((pg) => (
        <PostGroup key={pg.pgroup} {...pg} />
      ))}
      {highlightedBlock}
    </div>
  );
}
