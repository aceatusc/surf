import { useContext } from "react";
import styles from "./Socials.module.css";
import { HighlightContext } from "../../context/HighlightContext";
import PostGroup from "./PostGroup";
import SamplePostData from "../../assets/examples/sample1_post.json";
import HideScroll from "../UI/HideScroll";

export type PostType = {
  id: string | undefined;
  ptype: string;
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
    <HideScroll
      className={styles.panel}
      data-theme="light"
      paddingX={16}
      paddingY={8}
    >
      {SamplePosts.map((pg) => (
        <PostGroup key={pg.pgroup} {...pg} />
      ))}
      {highlightedBlock}
    </HideScroll>
  );
}
