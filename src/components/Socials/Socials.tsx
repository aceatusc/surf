import { useContext, useEffect } from "react";
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
  text?: string;
};

const SamplePosts = SamplePostData as PostGroupType[];

export default function Socials() {
  const { highlightedBlock, setHighlightedBlock } =
    useContext(HighlightContext);

  useEffect(() => {
    const handleGlobalClick = () => {
      setHighlightedBlock(null);
    };
    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  const postToDisplay =
    highlightedBlock === null
      ? SamplePosts
      : SamplePosts.filter((pg) => pg.pgroup === highlightedBlock);
  return (
    <HideScroll
      className={styles.panel}
      data-theme="light"
      paddingX={16}
      paddingY={8}
    >
      {postToDisplay.map((pg) => (
        <PostGroup key={pg.pgroup} {...pg} />
      ))}
    </HideScroll>
  );
}
