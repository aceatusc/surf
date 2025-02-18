import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import { MouseEvent, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TPostData, ptypeConfig } from "../types";
import { HighlightContext } from "@/context/HighlightContext";
import HideScroll from "../ui/HideScroll";
import { Badge } from "../ui/badge";
import Thread from "./Thread";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getColor } from "@/context/ColorManager";
import { DataContext } from "@/context/DataContext";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { SidebarCloseIcon } from "lucide-react";
import { UIContext } from "@/context/UIContext";

const TabTypes = Object.keys(ptypeConfig).sort((a, b) => {
  return (
    ptypeConfig[a as keyof typeof ptypeConfig].priority -
    ptypeConfig[b as keyof typeof ptypeConfig].priority
  );
});

// const FilterTypes = ["Time", "Location", "Popularity"];

export default function Social() {
  const {
    setHighlightedLocation,
    setHighlightedType,
    highlightedLocation,
    highlightedType,
  } = useContext(HighlightContext);
  const { posts } = useContext(DataContext);
  const { sidebarOpen, setSidebarOpen } = useContext(UIContext);
  const [section, setSection] = useState("All");
  // const [filterType, setFilterType] = useState("All");
  // const [sortBy, setSortBy] = useState("Location");

  const postToDisplay = Object.values(posts)
    .filter(
      (post) =>
        post?.tweet_type &&
        post?.tweet_type !== "Trivia" &&
        !post?.in_thread &&
        (!highlightedType || post.tweet_type === highlightedType) &&
        (!highlightedLocation || post.location === highlightedLocation)
    )
    .sort((a, b) => {
      const score_diff = (b.thread_score || 0) - (a.thread_score || 0);
      if (score_diff !== 0) return score_diff;
      return b.favorite_count - a.favorite_count;
    });

  return (
    <div
      className="h-[100vh] mr-auto sticky top-0 z-20"
      style={{
        width: sidebarOpen ? "42rem" : "0",
        height: "100vh",
        transition: "width 0.2s",
      }}
    >
      <div className="pt-4 pb-1 px-3">
        <SidebarCloseIcon
          className="absolute top-4 -left-10 h-10 w-10 bg-zinc-100 opacity-80 cursor-pointer hover:bg-zinc-200 p-2 rounded-xl shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <div
          className="text-lg overflow-hidden"
          style={{
            display: sidebarOpen ? "block" : "none",
          }}
        >
          <span className="mr-2.5 font-semibold">Discussion:</span>
          {TabTypes.map((type) => (
            <Button
              key={type}
              variant="secondary"
              onClick={() => {
                if (type === highlightedType) {
                  setHighlightedType(null);
                } else {
                  setHighlightedType(type);
                }
              }}
              className={`text-[1rem] rounded-3xl px-3 h-8 mb-3 mr-2.5 ${
                type === highlightedType
                  ? "bg-stone-700 text-white hover:bg-stone-600"
                  : "bg-stone-100 hover:bg-stone-200"
              }`}
            >
              {ptypeConfig[type as keyof typeof ptypeConfig].icon} {type}
            </Button>
          ))}
        </div>
        <Separator className="mt-3 -mb-1" />

        {highlightedLocation !== null && (
          <Badge
            style={{ backgroundColor: getColor(highlightedLocation) }}
            className="mt-4 mb-1 text-md rounded-full py-1 pl-4 pr-2 cursor-pointer w-fit text-stone-700"
            onClick={() => {
              setHighlightedLocation(null);
              setHighlightedType(null);
            }}
          >
            Showing Only Related Posts
            <svg
              className="ml-1"
              width="1.4rem"
              height="1.4rem"
              viewBox="0 0 24 24"
              fill="#fafafa"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                stroke="#27272a"
                strokeWidth="2"
              />
              <path
                d="M9 9L15 15M15 9L9 15"
                stroke="#27272a"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </Badge>
        )}
      </div>

      <div
        className="h-full"
        data-theme="light"
        style={{
          display: sidebarOpen ? "block" : "none",
        }}
      >
        <HideScroll paddingLeft={0.8} paddingRight={0.8} paddingBottom={8}>
          <AnimatePresence>
            {postToDisplay.map((post) => (
              <motion.div
                key={post.id_str}
                initial={{ opacity: 0, x: 64 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 64 }}
                transition={{ duration: 0.16, type: "just", ease: "easeIn" }}
              >
                <Thread post={post} />
              </motion.div>
            ))}
          </AnimatePresence>
        </HideScroll>
      </div>
    </div>
  );
}
