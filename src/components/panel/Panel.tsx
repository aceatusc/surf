import { MouseEvent, useContext, useState } from "react";
import { HighlightContext } from "../../context/HighlightContext";
import HideScroll from "../ui/HideScroll";
import { getColorForGroup } from "../../context/ColorManager";
import {
  EmbeddedTweet,
  EmbeddedTweetReply,
  TweetNotFound,
  TweetSkeleton,
  useTweet,
} from "../post/src";
import { TPost } from "../types";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "../ui/badge";
import { getStylesForQuote } from "../ui/Utils";
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

type EmbedPostprops = TPost & {
  apiUrl?: string;
  is_reply?: boolean;
  onClickReply?: (event: MouseEvent) => void;
};

export const EmbedPost = ({
  pid,
  ptype,
  replies,
  apiUrl,
  is_reply,
  onClickReply,
}: EmbedPostprops) => {
  const { data, error, isLoading } = useTweet(pid, apiUrl);
  if (isLoading) return <TweetSkeleton />;
  if (error || !data) return <TweetNotFound error={error} />;

  data.is_reply = is_reply;
  data.tweet_type = ptype;
  const Embed = is_reply ? EmbeddedTweetReply : EmbeddedTweet;

  return (
    <Embed
      tweet={data}
      id={`post-${pid}`}
      className="relative z-10"
      onClickReply={onClickReply}
    >
      {replies &&
        replies.length > 0 &&
        replies.map((reply) => (
          <EmbedPost key={reply.pid} {...reply} apiUrl={apiUrl} is_reply />
        ))}
    </Embed>
  );
};

const TabTypes = ["all", "author", "tl;dr", "question", "critic", "opinion"];

export default function Panel({ data }: { data: TPost[] }) {
  const { highlightedQuote, setHighlightedQuote } =
    useContext(HighlightContext);

  const [filterType, setFilterType] = useState("all");
  // const [sortBy, setSortBy] = useState("time");

  const postToDisplay = data.filter(
    (post) =>
      (highlightedQuote === null || post.quotes?.includes(highlightedQuote)) &&
      (filterType === "all" || post.ptype === filterType)
  );

  const jumpToQuote = (e: MouseEvent) => {
    e.stopPropagation();
    const quoteId = (e.target as HTMLElement).id.split("quote_")[1];
    const element = document.getElementById(`highlight_${quoteId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <HideScroll
      data-theme="light"
      paddingX={16}
      paddingY={8}
      className="w-2/5 min-w-[42rem] h-full bg-zinc-50 bg-opacity-85 backdrop-blur-3xl fixed z-40 top-0 right-0 rounded-tl-3xl rounded-bl-3xl shadow-2xl overflow-y-auto"
    >
      <div className="w-full flex items-center mt-2 h-11">
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
            <DropdownMenuItem>Time</DropdownMenuItem>
            <DropdownMenuItem>Popularity</DropdownMenuItem>
            <DropdownMenuItem>Author</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {highlightedQuote !== null && (
        <Badge
          style={getStylesForQuote(highlightedQuote)}
          className="mt-5 text-md rounded-full py-1 pl-4 pr-2 cursor-pointer"
          onClick={() => setHighlightedQuote(null)}
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
              stroke-width="2"
            />
            <path
              d="M9 9L15 15M15 9L9 15"
              stroke="#27272a"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </Badge>
      )}

      <AnimatePresence>
        {postToDisplay.map(({ quotes, ...res }) => (
          <motion.div
            key={res.pid}
            className="relative pl-4"
            layout
            initial={{ opacity: 0, x: 64 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 64 }}
            transition={{ duration: 0.2, type: "just", ease: "easeOut" }}
          >
            <EmbedPost key={res.pid} {...res} />
            <div className="absolute top-0 left-0 flex flex-col space-y-3 z-0 h-full pt-8 pb-8">
              {quotes?.map((quote) => (
                <div
                  key={quote}
                  style={{
                    backgroundColor: getColorForGroup(quote),
                    height: `${100 / quotes.length}%`,
                  }}
                  id={`post_${res.pid}-quote_${quote}`}
                  onClick={jumpToQuote}
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
