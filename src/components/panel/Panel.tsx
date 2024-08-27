import { useContext, useEffect } from "react";
import styles from "./Panel.module.css";
import { HighlightContext } from "../../context/HighlightContext";
import HideScroll from "../ui/HideScroll";
import { getColorForGroup } from "../../context/ColorManager";
import { DataType, PostData } from "../types";
import {
  EmbeddedTweet,
  TweetNotFound,
  TweetSkeleton,
  useTweet,
} from "../post/src";

type EmbedPostprops = PostData & {
  quoteId: number;
  apiUrl?: string;
  in_thread?: boolean;
};

export const EmbedPost = ({
  pid,
  ptype,
  replies,
  quoteId,
  apiUrl,
  in_thread,
}: EmbedPostprops) => {
  const { data, error, isLoading } = useTweet(pid, apiUrl);
  if (isLoading) return <TweetSkeleton />;
  if (error || !data) return <TweetNotFound error={error} />;

  data.in_thread = in_thread;
  data.tweet_type = ptype;
  const color = getColorForGroup(quoteId);

  return (
    <EmbeddedTweet
      tweet={data}
      id={`post-${pid}`}
      quoteId={quoteId}
      quoteColor={color}
    >
      {replies &&
        replies.length > 0 &&
        replies.map((reply) => (
          <EmbedPost
            key={reply.pid}
            {...reply}
            apiUrl={apiUrl}
            quoteId={quoteId}
            in_thread
          />
        ))}
    </EmbeddedTweet>
  );
};

export default function Panel({ data }: { data: DataType }) {
  const { highlightedBlock, setHighlightedBlock } =
    useContext(HighlightContext);

  // const { visiblePageRatios, scrollThresholdReachedInDirection } =
  //   useContext(ScrollContext);
  // const [currentPage, setCurrentPage] = useState(1);

  // useEffect(() => {
  //   if (visiblePageRatios.size === 0) return;
  //   if (!visiblePageRatios.has(currentPage)) return;
  //   const curPageRatio = visiblePageRatios.get(currentPage)?.ratio || 0;
  //   if (curPageRatio > 0.5) return;
  //   setCurrentPage(
  //     (prev) =>
  //       prev +
  //       (scrollThresholdReachedInDirection == ScrollDirection.UP ? -1 : 1)
  //   );
  // }, [visiblePageRatios]);

  useEffect(() => {
    const handleGlobalClick = () => {
      setHighlightedBlock(null);
    };
    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  let quotes = data.flat();
  if (highlightedBlock !== null) {
    quotes = quotes.filter((quote) => quote.qid === highlightedBlock);
  }

  return (
    <HideScroll
      className={styles.panel}
      data-theme="light"
      paddingX={16}
      paddingY={8}
    >
      {quotes.map(({ qid, posts }, i) => (
        <div key={i} id={`quote-${qid}`}>
          {posts.map((post) => (
            <EmbedPost key={post.pid} quoteId={qid} {...post} />
          ))}
        </div>
      ))}
    </HideScroll>
  );
}
