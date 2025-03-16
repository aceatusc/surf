import { DataContext } from "@/context/DataContext";
import clsx from "clsx";
import { Fragment, useContext } from "react";
import { TPostData } from "../types";
import { ThreadContext } from "@/context/ThreadContext";
import { HighlightContext } from "@/context/HighlightContext";

const findParent = (pid: string, posts: TPostData, loc: string) => {
  const post = posts[pid];
  if (
    !post.in_reply_to_status_id_str ||
    (post.is_branch && post.location === loc)
  )
    return post.id_str;
  return findParent(post.in_reply_to_status_id_str, posts, loc);
};

const formatText = ({
  inputText,
  posts,
  onClick,
}: {
  inputText: string;
  posts: TPostData;
  onClick: (pid: string) => void;
}) => {
  const parts = inputText.split(
    /(?=<\d{16,20}>)|(?<=<\d{16,20}>)|(?=\[\[)|(?<=\]\])|(?=\n)|(?<=\n)/
  );

  return parts.map((part, idx) => {
    const pidMatch = part.match(/^<(\d{16,20})>$/);
    if (pidMatch) {
      const pid = pidMatch[1];
      const post = posts[pid];
      if (!post) return null;
      return (
        <span
          key={idx}
          className="text-pink-600 font-semibold font-mono hover:underline cursor-pointer"
          onClick={() => onClick(pid)}
        >
          {post.user.name}
        </span>
      );
    }

    const urlMatch = part.match(/^\[\[(.*?)\]\]$/);
    if (urlMatch) {
      const url = urlMatch[1];
      return (
        <a
          key={idx}
          href={url.startsWith("http") ? url : `https://${url}`}
          className="text-blue-500 hover:underline"
        >
          {url}
        </a>
      );
    }

    return part ? <span key={idx}>{part}</span> : null;
  });
};

export default function Summary({
  className,
  style,
  type,
  loc,
}: {
  className?: string;
  style?: React.CSSProperties;
  type: string;
  loc: string;
}) {
  const { posts, summaries } = useContext(DataContext);
  const { setExpandThread } = useContext(ThreadContext);
  const { setHighlightedLocation, setHighlightedType } =
    useContext(HighlightContext);

  const onClick = (pid: string) => {
    const threadToExpand = findParent(pid, posts, loc);
    setExpandThread(threadToExpand);
    setHighlightedLocation(loc);
    setHighlightedType(type);
    setTimeout(() => {
      const element = document.getElementById(pid);
      if (element) {
        const elementRect = element.getBoundingClientRect();
        const headerOffset = 200;

        // Check if element is already visible in the viewport
        const isVisible = elementRect.top < window.innerHeight - 240;

        if (!isVisible) {
          let scrollParent = element;
          while (scrollParent.parentElement) {
            if (scrollParent.hasAttribute("data-hide-scroll")) break;
            scrollParent = scrollParent.parentElement;
          }
          scrollParent.scrollBy({
            top: elementRect.top - headerOffset,
            behavior: "smooth",
          });
        }

        setTimeout(
          () => {
            const originalColor = element.style.backgroundColor;
            element.style.backgroundColor = "#fed7aa";
            setTimeout(
              () => {
                element.style.backgroundColor = originalColor;
              },
              isVisible ? 240 : 600
            );
          },
          isVisible ? 40 : 200
        );
      }
    }, 50);
  };

  return (
    <Fragment>
      {summaries[type][loc].map((r, idx) => (
        <div
          className={clsx("text-lg text-stone-800 leading-6 pb-1.5", className)}
          style={style}
          key={idx}
        >
          {formatText({ inputText: r, posts, onClick })}
        </div>
      ))}
    </Fragment>
  );
}
