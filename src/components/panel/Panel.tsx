import { MouseEvent, useContext, useState } from "react";
import { HighlightContext } from "../../context/HighlightContext";
import HideScroll from "../ui/HideScroll";
import { getColorForGroup } from "../../context/ColorManager";
import { EmbeddedTweet, EmbeddedTweetReply } from "../post/src";
import { TPost, TPostData } from "../types";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "../ui/badge";
import { getStylesForLocation } from "../ui/Utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpWideShort } from "@fortawesome/free-solid-svg-icons";

type TPostEmbed = TPost & {
  getQuote: (id: string) => TPost | undefined;
  getReplies: (id: string) => TPost[];
  onClickReply?: (event: MouseEvent) => void;
};

export const EmbedPost = ({ getQuote, getReplies, ...post }: TPostEmbed) => {
  const Embed = post?.is_reply ? EmbeddedTweetReply : EmbeddedTweet;
  const replies = getReplies(post.id_str);
  post.quoted_tweet = getQuote(post.id_str);
  post.conversation_count = replies?.length || 0;

  return (
    <Embed
      tweet={post}
      id={`post-${post.id_str}`}
      onClickReply={post.onClickReply}
    >
      {replies &&
        replies.length > 0 &&
        replies.map((reply) => (
          <EmbedPost
            key={reply.id_str}
            {...reply}
            is_reply
            getQuote={getQuote}
            getReplies={getReplies}
          />
        ))}
    </Embed>
  );
};

const TabTypes = ["all", "author", "tl;dr", "q&a", "critic", "opinion"];
const FilterTypes = ["time", "location", "popularity"];

export default function Panel({
  data,
  rootPosts,
}: {
  data: TPostData;
  rootPosts: string[];
}) {
  const { highlightedLocation, setHighlightedLocation } =
    useContext(HighlightContext);

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
    <HideScroll
      data-theme="light"
      paddingX={16}
      paddingY={4}
      className="w-2/5 min-w-[42rem] h-full bg-zinc-50 bg-opacity-85 backdrop-blur-3xl fixed z-40 top-0 right-0 rounded-tl-3xl rounded-bl-3xl shadow-2xl"
    >
      <div className="w-full flex items-center mt-4 h-11">
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
      </div>

      {highlightedLocation !== null && (
        <Badge
          style={getStylesForLocation(highlightedLocation)}
          className="mt-5 text-md rounded-full py-1 pl-4 pr-2 cursor-pointer"
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
            <div className="absolute top-0 left-0 flex flex-col space-y-3 z-[-1] h-full pt-8 pb-8">
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
                    className={`hover:-translate-x-3 transition-transform duration-200 w-12 cursor-pointer max-h-40 rounded-tl-2xl rounded-bl-2xl`}
                  />
                ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </HideScroll>
  );
}
