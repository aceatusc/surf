import { DataContext } from "@/context/DataContext";
import clsx from "clsx";
import { Fragment, useContext } from "react";
import { TPostData } from "../types";
import { ThreadContext } from "@/context/ThreadContext";

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
  loc,
}: {
  inputText: string;
  posts: TPostData;
  onClick?: (pid: string | null) => void;
  loc: string;
}) => {
  const parts = inputText.split(
    /(?=<\d{16,20}>)|(?<=<\d{16,20}>)|(?=\[\[)|(?<=\]\])|(?=\n)|(?<=\n)/
  );

  return parts.map((part, idx) => {
    const pidMatch = part.match(/^<(\d{16,20})>$/);
    if (pidMatch) {
      const pid = pidMatch[1];
      const post = posts[pid];
      const threadToExpand = findParent(pid, posts, loc);
      return (
        <span
          key={idx}
          className="text-pink-600 font-semibold font-mono hover:underline cursor-pointer"
          onClick={() => {
            onClick?.(threadToExpand);
            setTimeout(() => {
              const element = document.getElementById(pid);
              if (element) {
                const originalColor = element.style.backgroundColor;
                element.style.backgroundColor = "#dadada";
                setTimeout(() => {
                  element.style.backgroundColor = originalColor;
                }, 360);
              }
            }, 120); // Small delay to ensure portal has opened
          }}
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

  return (
    <Fragment>
      {summaries[type][loc].map((r, idx) => (
        <div
          className={clsx("text-lg text-stone-700 leading-6 pb-1.5", className)}
          style={style}
          key={idx}
        >
          {formatText({ inputText: r, posts, onClick: setExpandThread, loc })}
        </div>
      ))}
    </Fragment>
  );
}
