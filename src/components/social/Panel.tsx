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
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "../ui/sidebar";
import { MouseEvent, useContext, useState } from "react";
import { faArrowUpWideShort } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import { TPost, TPostData } from "../types";
import { HighlightContext } from "@/context/HighlightContext";
import { EmbedPost } from "./Post";
import { getColorForGroup } from "@/context/ColorManager";
import HideScroll from "../ui/HideScroll";
import { getStylesForLocation } from "../ui/Utils";
import { Badge } from "../ui/badge";

const TabTypes = [
  "Overview",
  "Insight",
  "Q&A",
  "Critique",
  "Perspective",
  "Related Work",
  "Resource",
];
const FilterTypes = ["Time", "Location", "Popularity"];

const getFirstLocation = (item: TPost) => {
  const locations = Array.from(item.locations || []);
  return locations.length > 0 ? locations.sort()[0] : undefined;
};

export default function Social({
  data,
  rootPosts,
}: {
  data: TPostData;
  rootPosts: string[];
}) {
  const { highlightedLocation, setHighlightedLocation } =
    useContext(HighlightContext);
  const [filterType, setFilterType] = useState("All");
  const [sortBy, setSortBy] = useState("Location");

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
        (filterType === "All" || data[id]?.tweet_type === filterType)
    )
    .map((id) => data[id])
    .sort((a, b) => {
      if (sortBy === "Popularity") {
        return b.favorite_count - a.favorite_count;
      }
      if (sortBy === "Time") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
      const aLoc = getFirstLocation(a);
      const bLoc = getFirstLocation(b);

      if (!aLoc && !bLoc) return b.favorite_count - a.favorite_count;
      if (!aLoc) return 1; // a has no location, move to end
      if (!bLoc) return -1; // b has no location, move to end
      return aLoc.localeCompare(bLoc) || b.favorite_count - a.favorite_count;
    });

  const jumpToLocation = (e: MouseEvent) => {
    e.stopPropagation();
    const quoteId = (e.target as HTMLElement).id.split(";loc_")[1];
    const element = document.getElementById(`highlight_${quoteId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <Sidebar variant="sidebar" className="p-0 z-50" side="right">
      <SidebarHeader className="my-2 px-3">
        <div className="text-lg font-semibold">
          <span className="mr-2">Filter by:</span>
          {TabTypes.map((type) => (
            <Button
              key={type}
              variant="secondary"
              onClick={() => {
                if (type === filterType) {
                  setFilterType("All");
                } else {
                  setFilterType(type);
                }
              }}
              className={`text-[1rem] rounded-3xl px-3 h-8 mb-2.5 mr-2.5 ${
                type === filterType
                  ? "bg-zinc-700 text-secondary hover:bg-zinc-600"
                  : "bg-zinc-200 hover:bg-zinc-400"
              }`}
            >
              {type}
            </Button>
          ))}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="text-primary font-semibold bg-zinc-200 h-full rounded-xl hover:bg-zinc-300 focus-visible:ring-transparent">
              <FontAwesomeIcon
                icon={faArrowUpWideShort}
                className="text-zinc-500"
              />{" "}
              Sort by: <span>{sortBy}</span>
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
      {highlightedLocation !== null && (
        <Badge
          style={getStylesForLocation(highlightedLocation)}
          className="mt-1 mb-2 mx-6 text-md rounded-full py-1 pl-4 pr-2 cursor-pointer w-fit"
          onClick={() => setHighlightedLocation(null)}
        >
          🔍 Showing Only Related Posts
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
      <SidebarContent data-theme="light">
        <HideScroll paddingLeft={12} paddingRight={10}>
          <AnimatePresence>
            {postToDisplay.map(({ locations, ...res }) => (
              <motion.div
                key={res.id_str}
                className="relative pl-4"
                layout
                initial={{ opacity: 0, x: 64 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 64 }}
                transition={{ duration: 0.2, type: "just", ease: "easeOut" }}
              >
                <EmbedPost
                  key={res.id_str}
                  {...res}
                  getReplies={getReplies}
                  getQuote={getQuote}
                />
                <div className="absolute top-0 left-0 flex flex-col space-y-3 h-full py-8">
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
                        className={`hover:-translate-x-3 hover:w-7 w-4 transition-translate transition-width duration-200 cursor-pointer max-h-40 rounded-l-2xl`}
                      />
                    ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </HideScroll>
      </SidebarContent>
      <SidebarTrigger className="absolute -left-12 top-5 w-10 h-10 [&_svg]:size-6 [&_svg]:text-zinc-600 rounded-lg" />
    </Sidebar>
  );
}
