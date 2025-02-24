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
import { ArrowLeft, SidebarCloseIcon } from "lucide-react";
import { UIContext } from "@/context/UIContext";
import clsx from "clsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Summary from "../ui/Summary";
import { EnrichedTweet } from "../post/src";

const TabTypes = Object.keys(ptypeConfig).sort((a, b) => {
  return (
    ptypeConfig[a as keyof typeof ptypeConfig].priority -
    ptypeConfig[b as keyof typeof ptypeConfig].priority
  );
});

const AccordionPanel = ({ data }: { data: EnrichedTweet[] }) => {
  const { highlightedType, highlightedLocation, setHighlightedLocation } =
    useContext(HighlightContext);
  const { summaries, context } = useContext(DataContext);
  const locationList = Object.keys(summaries[highlightedType] || {});

  return highlightedType === "Overview" ? (
    data.map((post) => <Thread post={post} key={post.id_str} />)
  ) : (
    <Accordion
      type="single"
      value={highlightedLocation}
      onValueChange={(loc) => {
        if (loc === highlightedLocation) setHighlightedLocation(undefined);
        else setHighlightedLocation(loc);
      }}
      collapsible
    >
      {locationList.map((loc, i) => (
        <AccordionItem value={loc} key={i} className="mb-3 border-none">
          <AccordionTrigger
            className={clsx(
              "text-xl font-mono px-4 rounded-t-3xl flex-wrap",
              loc === highlightedLocation ? "pb-1.5" : "rounded-b-3xl"
            )}
            style={{
              backgroundColor: getColor(loc),
            }}
          >
            <span>
              <b className="mr-2">Section:</b>
              {loc}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {context[highlightedType] ? (
              <div
                className="text-lg px-4 pb-2 rounded-b-3xl"
                style={{
                  backgroundColor: getColor(loc),
                }}
              >
                <span>{context[highlightedType][loc]}</span>
              </div>
            ) : null}
            <Summary
              raw={summaries[highlightedType][loc]}
              className="text-stone-600 px-2 py-3"
            />
            {data
              .filter(
                (post) =>
                  post.location === loc || (!post.location && loc === "General")
              )
              .map((post) => (
                <Thread post={post} key={post.id_str} />
              ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default function Social() {
  const {
    setHighlightedLocation,
    setHighlightedType,
    highlightedLocation,
    highlightedType,
  } = useContext(HighlightContext);
  const { posts, focusMode, setFocusMode } = useContext(DataContext);
  const { sidebarOpen, setSidebarOpen } = useContext(UIContext);

  let postToDisplay = Object.values(posts)
    .filter((p) => p.tweet_type === highlightedType && p.is_branch)
    .sort((a, b) => {
      const score_diff = (b.thread_score || 0) - (a.thread_score || 0);
      if (score_diff !== 0) return score_diff;
      return b.favorite_count - a.favorite_count;
    });

  // const postToDisplay = Object.values(posts)
  //   .filter(
  //     (post) =>
  //       post?.tweet_type &&
  //       post?.tweet_type !== "Trivia" &&
  //       !post?.in_thread &&
  //       (!highlightedType || post.tweet_type === highlightedType) &&
  //       (!highlightedLocation || post.location === highlightedLocation) &&
  //       (focusMode && post.thread_score ? post.thread_score > 0.2 : true) &&
  //       (!highlightedLocation && !highlightedType
  //         ? !post.in_reply_to_status_id_str
  //         : true) &&
  //       post.is_branch
  //   )
  //   .sort((a, b) => {
  //     const score_diff = (b.thread_score || 0) - (a.thread_score || 0);
  //     if (score_diff !== 0) return score_diff;
  //     return b.favorite_count - a.favorite_count;
  //   });

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
                if (type !== highlightedType) {
                  setHighlightedType(type);
                }
              }}
              className={`text-[1rem] rounded-3xl px-3 h-8 mb-3 mr-2.5 ${
                type === highlightedType
                  ? "bg-stone-800 text-stone-50 hover:bg-stone-700"
                  : "bg-stone-100 hover:bg-stone-200"
              }`}
            >
              {ptypeConfig[type as keyof typeof ptypeConfig].icon} {type}
            </Button>
          ))}
        </div>
        <Separator className="mt-1 mb-3" />
        {/* <div
          className={clsx(
            "items-center border px-6 justify-between py-2 rounded-full bg-stone-100 w-72 mb-1 flex",
            sidebarOpen ? "flex" : "hidden"
          )}
        >
          <div className="flex flex-col mr-2">
            <Label htmlFor="#focus-mode-switch" className="text-lg">
              {focusMode ? "Focus Mode" : "Social Mode "}
            </Label>
            <div className="text-stone-600 text-sm">
              {focusMode
                ? "Show only key discussions"
                : "Show more discussions"}
            </div>
          </div>
          <Switch
            id="focus-mode-switch"
            checked={focusMode}
            onClick={() => setFocusMode(!focusMode)}
          />
        </div> */}

        {/* {highlightedLocation !== null && (
          <Badge
            style={{ backgroundColor: getColor(highlightedLocation) }}
            className="mt-4 mb-1 text-md rounded-full py-1 pl-4 pr-2 cursor-pointer w-fit text-stone-700"
            onClick={() => {
              setHighlightedLocation(null);
              // setHighlightedType(null);
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
        )} */}
      </div>

      <div
        className="h-full"
        data-theme="light"
        style={{
          display: sidebarOpen ? "block" : "none",
        }}
      >
        <HideScroll paddingLeft={0.8} paddingRight={0.8} paddingBottom={7.2}>
          <AnimatePresence>
            <AccordionPanel data={postToDisplay} />
          </AnimatePresence>
        </HideScroll>
      </div>
    </div>
  );
}
