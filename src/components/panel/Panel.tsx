import { useContext, useEffect } from "react";
import styles from "./Panel.module.css";
import { HighlightContext } from "../../context/HighlightContext";
import PostGroup from "./PostGroup";
import HideScroll from "../ui/HideScroll";
import { getColorForGroup } from "../../context/ColorManager";
import { DataType } from "../types";
import { ScrollContext } from "../pdf";

// export type PostType = {
//   id: string | undefined;
//   ptype: string;
//   replies: PostType[];
// };

// export type PostGroupType = {
//   pgroup: number;
//   posts: PostType[];
//   text?: string;
// };

// const SamplePosts = SamplePostData as PostGroupType[];

export default function Panel({ data }: { data: DataType }) {
  const { highlightedBlock, setHighlightedBlock } =
    useContext(HighlightContext);

  const { isPageVisible, visiblePageRatios, scrollRoot } =
    useContext(ScrollContext);

  useEffect(() => {
    const handleGlobalClick = () => {
      setHighlightedBlock(null);
    };
    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  // const postToDisplay =
  //   highlightedBlock === null
  //     ? SamplePosts
  //     : SamplePosts.filter((pg) => pg.pgroup === highlightedBlock);

  // postToDisplay.map((pg) => {
  //   getColorForGroup(pg.pgroup);
  // });

  return (
    <HideScroll
      className={styles.panel}
      data-theme="light"
      paddingX={16}
      paddingY={8}
    >
      hello
      {/* {postToDisplay.map((pg) => (
        <PostGroup key={pg.pgroup} {...pg} />
      ))} */}
    </HideScroll>
  );
}
