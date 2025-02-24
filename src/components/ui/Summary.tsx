import { DataContext } from "@/context/DataContext";
import clsx from "clsx";
import { Fragment, useContext } from "react";
import { TPostData } from "../types";
import { ThreadContext } from "@/context/ThreadContext";

const formatText = ({
  inputText,
  posts,
  onClick,
}: {
  inputText: string;
  posts: TPostData;
  onClick?: (pid: string | null) => void;
}) => {
  const parts = inputText.split(
    /(?=<\d{16,20}>)|(?<=<\d{16,20}>)|(?=\[\[)|(?<=\]\])|(?=\n)|(?<=\n)/
  );

  return parts.map((part, idx) => {
    const pidMatch = part.match(/^<(\d{16,20})>$/);
    if (pidMatch) {
      const pid = pidMatch[1];
      const post = posts[pid];
      const threadToExpand = post.is_branch ? pid : post.root;
      return (
        <span
          key={idx}
          className="text-pink-600 font-semibold font-mono hover:underline cursor-pointer"
          onClick={() => {
            console.log(pid, threadToExpand);
            onClick && onClick(threadToExpand);
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
  raw,
  className,
  style,
}: {
  raw: string[];
  className?: string;
  style?: React.CSSProperties;
}) {
  const { posts } = useContext(DataContext);
  const { setExpandThread } = useContext(ThreadContext);

  return (
    <Fragment>
      {raw.map((r, idx) => (
        <div
          className={clsx("text-lg text-stone-700 leading-6 pb-1.5", className)}
          style={style}
          key={idx}
        >
          {formatText({ inputText: r, posts, onClick: setExpandThread })}
        </div>
      ))}
    </Fragment>
  );
}
