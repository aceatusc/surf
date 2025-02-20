import { DataContext } from "@/context/DataContext";
import { useContext } from "react";

const formatText = (inputText: string) => {
  const { posts } = useContext(DataContext);

  const textWithCollapsedNewlines = inputText.replace(/(?:\s*\n\s*)+/g, "\n");
  const parts = textWithCollapsedNewlines.split(
    /(?=<\d{16,20}>)|(?<=<\d{16,20}>)|(?=\[\[)|(?<=\]\])|(?=\n)|(?<=\n)/
  );

  return parts.map((part, idx) => {
    const pidMatch = part.match(/^<(\d{16,20})>$/);
    if (pidMatch) {
      const pid = pidMatch[1];
      const post = posts[pid];
      return (
        <span key={idx} className="text-pink-600 font-semibold font-mono">
          {post.user.name}
        </span>
      );
    }

    const urlMatch = part.match(/^\[\[(.*?)\]\]$/);
    if (urlMatch) {
      const url = urlMatch[1];
      return (
        <a key={idx} href={url} className="text-blue-500 hover:underline">
          {url}
        </a>
      );
    }

    if (part === "\n") {
      return <div key={idx} className="h-3" />;
    }

    return part ? <span key={idx}>{part}</span> : null;
  });
};

export default function Summary({ raw }: { raw: string }) {
  return (
    <div style={{ direction: "ltr" }} className="text-lg text-stone-800">
      {formatText(raw)}
    </div>
  );
}
