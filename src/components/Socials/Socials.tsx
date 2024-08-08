import { useContext } from "react";
import styles from "./Socials.module.css";
import { HighlightContext } from "../../context/HighlightContext";
import { Post } from "./Post";
import SamplePosts from "../../assets/examples/sample1_post.json";

export default function Socials() {
  const { highlightedBlock } = useContext(HighlightContext);
  return (
    <div className={styles.panel} data-theme="light">
      <Post id="1751023987206103244" />
      <Post id="1751279042375057724" />
      {highlightedBlock}
    </div>
  );
}
