import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import { useContext, useEffect, useState } from "react";
import { FOCUS_THRESHOLD, getIcon, ptypeConfig } from "../types";
import { HighlightContext } from "@/context/HighlightContext";
import HideScroll from "../ui/HideScroll";
import Thread, { ReadMore } from "./Thread";
import { getColor } from "@/context/ColorManager";
import { DataContext } from "@/context/DataContext";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { SidebarCloseIcon } from "lucide-react";
import { UIContext } from "@/context/UIContext";
import clsx from "clsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Summary from "../ui/Summary";

const TabTypes = Object.keys(ptypeConfig).sort((a, b) => {
  return (
    ptypeConfig[a as keyof typeof ptypeConfig].priority -
    ptypeConfig[b as keyof typeof ptypeConfig].priority
  );
});

const AccordionPanelItem = ({ loc }: { loc: string }) => {
  const { highlightedType, highlightedLocation } = useContext(HighlightContext);
  const { context, posts, focusMode } = useContext(DataContext);
  const [localFocusMode, setLocalFocusMode] = useState(focusMode);

  useEffect(() => {
    if (localFocusMode !== focusMode) setLocalFocusMode(focusMode);
  }, [focusMode]);

  const postToDisplay = Object.values(posts).filter(
    (p) =>
      p.tweet_type === highlightedType &&
      p.is_branch &&
      (p.location === loc || (!p.location && loc === "General"))
  );

  const postToRender = (
    localFocusMode
      ? postToDisplay.filter(
          (p) =>
            p.thread_score && p.thread_score > FOCUS_THRESHOLD(highlightedType)
        )
      : postToDisplay
  ).sort((a, b) => {
    const score_diff = b.thread_score - a.thread_score;
    if (score_diff !== 0) return score_diff;
    return b.favorite_count - a.favorite_count;
  });

  return (
    <AccordionItem value={loc} className="mt-3 border-none">
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
          className="text-stone-600 px-2 py-3"
          type={highlightedType}
          loc={loc}
        />
        {postToRender.map((post) => (
          <Thread post={post} key={post.id_str} />
        ))}
        {localFocusMode && postToDisplay.length > postToRender.length ? (
          <div className="bg-stone-100 px-3 ml-1 w-[28rem] py-2 rounded-xl mt-2">
            <div className="text-stone-600 w-full text-base">
              You are in focus mode. We've hidden{" "}
              <b className="text-pink-600">
                {postToDisplay.length - postToRender.length}
              </b>{" "}
              discussions that could be distracting. Click to see more.
            </div>
            <ReadMore onClick={() => setLocalFocusMode(false)} />
          </div>
        ) : null}
      </AccordionContent>
    </AccordionItem>
  );
};

const AccordionPanel = () => {
  const { highlightedType, highlightedLocation, setHighlightedLocation } =
    useContext(HighlightContext);
  const { summaries, posts, focusMode } = useContext(DataContext);
  const locationList = Object.keys(summaries[highlightedType] || {});
  const [localFocusMode, setLocalFocusMode] = useState(focusMode);

  useEffect(() => {
    if (localFocusMode !== focusMode) setLocalFocusMode(focusMode);
  }, [focusMode]);

  const postToDisplay = Object.values(posts).filter(
    (p) => p.tweet_type === highlightedType && p.is_branch
  );

  const postToRender = (
    localFocusMode
      ? postToDisplay.filter(
          (p) =>
            p.thread_score && p.thread_score > FOCUS_THRESHOLD(highlightedType)
        )
      : postToDisplay
  ).sort((a, b) => {
    const score_diff = b.thread_score - a.thread_score;
    if (score_diff !== 0) return score_diff;
    return b.favorite_count - a.favorite_count;
  });

  return highlightedType === "Overview" ? (
    postToRender.map((post) => <Thread post={post} key={post.id_str} />)
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
        <AccordionPanelItem key={i} loc={loc} />
      ))}
    </Accordion>
  );
};

export default function Social() {
  const { setHighlightedType, highlightedType } = useContext(HighlightContext);
  const { sidebarOpen, setSidebarOpen } = useContext(UIContext);
  const { focusMode, setFocusMode } = useContext(DataContext);

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
              {getIcon(type)} {type}
            </Button>
          ))}
          <div
            className={clsx(
              "items-center px-5 h-9 border border-stone-700 rounded-full",
              sidebarOpen ? "inline-flex" : "hidden",
              focusMode ? "bg-lime-100" : "bg-pink-100"
            )}
          >
            <div className="flex flex-col mr-4">
              <Label htmlFor="#focus-mode-switch" className="text-[1rem]">
                {focusMode ? "Focus Mode" : "Social Mode "}
              </Label>
              {/* <div className="text-stone-600 text-xs whitespace-nowrap">
                {focusMode ? "Key discussions only" : "Show more interactions"}
              </div> */}
            </div>
            <Switch
              id="focus-mode-switch"
              checked={focusMode}
              onClick={() => setFocusMode(!focusMode)}
            />
          </div>
        </div>
        <Separator className="mt-1" />
      </div>

      <div
        className="h-full"
        data-theme="light"
        style={{
          display: sidebarOpen ? "block" : "none",
        }}
      >
        <HideScroll paddingLeft={0.8} paddingRight={0.8} paddingBottom={7.2}>
          <AccordionPanel />
        </HideScroll>
      </div>
    </div>
  );
}
