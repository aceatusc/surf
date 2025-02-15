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

const TabTypes = Object.keys(ptypeConfig).sort((a, b) => {
  return (
    ptypeConfig[a as keyof typeof ptypeConfig].priority -
    ptypeConfig[b as keyof typeof ptypeConfig].priority
  );
});

// const FilterTypes = ["Time", "Location", "Popularity"];

export default function Social({ allLocations }: { allLocations: string[] }) {
  const {
    setHighlightedLocation,
    setHighlightedType,
    highlightedLocation,
    highlightedType,
  } = useContext(HighlightContext);
  const { posts } = useContext(DataContext);
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
    .sort((a, b) => (b.thread_score || 0) - (a.thread_score || 0));

  return (
    <div
      className="h-[100vh] mr-auto sticky top-0 z-[999]"
      style={{ maxWidth: "42rem", height: "100vh" }}
    >
      <div className="pt-4 pb-1 px-3">
        <div className="text-lg">
          <div>
            <span className="mr-2 font-semibold">Discussion:</span>
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
                className={`text-[1rem] rounded-3xl px-3 h-8 mb-2.5 mr-2.5 ${
                  type === highlightedType
                    ? "bg-stone-700 text-white hover:bg-stone-600"
                    : "bg-stone-100 hover:bg-stone-200"
                }`}
              >
                {ptypeConfig[type as keyof typeof ptypeConfig].icon} {type}
              </Button>
            ))}
          </div>
          <div className="grid-cols-3 grid gap-4">
            <div className="flex items-center mt-1.5 col-span-2">
              <div className="mr-2 font-semibold">Section:</div>
              <Select>
                <SelectTrigger
                  className="rounded-3xl bg-white text-[1rem] overflow-hidden"
                  style={{
                    backgroundColor:
                      section != "All" ? getColor(section) : undefined,
                  }}
                >
                  <SelectValue placeholder={section} />
                </SelectTrigger>
                <SelectContent>
                  {["All", ...allLocations].map((location) => (
                    <SelectItem value={location} key={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center mt-1.5">
              <div className="mr-2 font-semibold whitespace-nowrap">
                Sort By:
              </div>
              <Select>
                <SelectTrigger
                  className="rounded-3xl text-[1rem] bg-white overflow-hidden"
                  style={{
                    backgroundColor:
                      section != "All" ? getColor(section) : undefined,
                  }}
                >
                  <SelectValue placeholder={section} />
                </SelectTrigger>
                <SelectContent>
                  {["All", ...allLocations].map((location) => (
                    <SelectItem value={location} key={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator className="mt-3 -mb-1" />
        </div>

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

      <div className="h-full" data-theme="light">
        <HideScroll paddingLeft={0.8} paddingRight={0.8} paddingBottom={8}>
          <AnimatePresence>
            {postToDisplay.map((post) => (
              <motion.div
                key={post.id_str}
                className="relative"
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
