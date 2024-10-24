import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarHeader } from "../ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { MouseEvent, useContext, useState } from "react";
import { faArrowUpWideShort } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import { TPostData } from "../types";
import { HighlightContext } from "@/context/HighlightContext";
import { EmbedPost } from "./Post";
import { getColorForGroup } from "@/context/ColorManager";

const TabTypes = ["all", "author", "tl;dr", "q&a", "critic", "opinion"];
const FilterTypes = ["time", "location", "popularity"];

export default function Social({
  data,
  rootPosts,
}: {
  data: TPostData;
  rootPosts: string[];
}) {
  const { highlightedLocation } = useContext(HighlightContext);
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("time");

  const getReplies = (id: string) => {
    return data[id]?.replies?.map((replyId) => data[replyId]).filter(Boolean);
  };

  const getQuote = (id: string) => {
    if (data[id]?.["quoted_status_id_str"]) {
      return data[data[id]?.["quoted_status_id_str"]];
    }
    return undefined;
  };

  const postToDisplay = rootPosts
    .filter(
      (id) =>
        !!data[id] &&
        (highlightedLocation === null ||
          data[id].locations?.has(highlightedLocation)) &&
        (filterType === "all" || data[id]?.tweet_type === filterType)
    )
    .map((id) => data[id])
    .sort((a, b) => {
      if (sortBy === "time") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      } else if (sortBy === "popularity") {
        return b.favorite_count - a.favorite_count;
      }
      return Array.from(a.locations || [])
        .sort()[0]
        .localeCompare(Array.from(b.locations || []).sort()[0]);
    });

  const jumpToLocation = (e: MouseEvent) => {
    e.stopPropagation();
    const quoteId = (e.target as HTMLElement).id.split(";loc_")[1];
    const element = document.getElementById(`highlight_${quoteId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <Sidebar variant="sidebar" className="p-0 z-50">
      <SidebarHeader className="flex items-center mt-3 mb-1 flex-row px-4">
        <Tabs
          defaultValue="all"
          className="flex-grow mr-3"
          onValueChange={setFilterType}
        >
          <TabsList className="grid w-full grid-cols-6 h-full bg-zinc-200 rounded-2xl">
            {TabTypes.map((type) => (
              <TabsTrigger
                key={type}
                value={type}
                className="text-lg font-semibold h-full rounded-2xl"
              >
                {type}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-zinc-200 h-full rounded-xl hover:bg-zinc-300 focus-visible:ring-transparent">
              <FontAwesomeIcon
                icon={faArrowUpWideShort}
                className="text-zinc-500"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {FilterTypes.map((type) => (
              <DropdownMenuItem
                key={type}
                onClick={() => setSortBy(type)}
                className={
                  type === sortBy ? "font-bold capitalize" : "capitalize"
                }
              >
                {type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>
      <SidebarContent
        data-theme="light"
        className="pl-6 pr-5"
        style={{ direction: "rtl" }}
      >
        <AnimatePresence>
          {postToDisplay.map(({ locations, ...res }) => (
            <motion.div
              key={res.id_str}
              className="relative pr-5"
              layout
              initial={{ opacity: 0, x: 64 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 64 }}
              transition={{ duration: 0.2, type: "just", ease: "easeOut" }}
              style={{ direction: "ltr" }}
            >
              <EmbedPost
                key={res.id_str}
                {...res}
                getReplies={getReplies}
                getQuote={getQuote}
              />
              <div className="absolute top-0 left-[calc(100%-1.25rem)] flex flex-col space-y-3 h-full py-8">
                {locations &&
                  Array.from(locations)?.map((loc) => (
                    <div
                      key={loc}
                      style={{
                        backgroundColor: getColorForGroup(loc),
                        height: `${100 / locations.size}%`,
                      }}
                      id={`post_${res.id_str};loc_${loc}`}
                      onClick={jumpToLocation}
                      className={`hover:w-7 w-4 transition-translate transition-width duration-200 cursor-pointer max-h-40 rounded-r-2xl`}
                    />
                  ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </SidebarContent>
    </Sidebar>
  );
}
