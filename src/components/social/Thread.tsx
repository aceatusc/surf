import {
  TweetActions,
  TweetBody,
  TweetContainer,
  TweetHeader,
  TweetMedia,
  EnrichedTweet,
} from "../post/src";
import { Button } from "../ui/button";
import { MouseEvent, useContext, useState } from "react";
import { SIDEBAR_WIDTH } from "../ui/sidebar";
import { Card, CardHeader } from "../ui/card";
import HideScroll from "../ui/HideScroll";
import { ArrowLeft, ChevronsUpDown } from "lucide-react";
import { getColor } from "@/context/ColorManager";
import { ptypeConfig } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import s from "./Thread.module.css";
import { DataContext } from "@/context/DataContext";

const flattenSelfThreads = (
  tail: EnrichedTweet,
  getReplies: (id: string) => EnrichedTweet[],
  ret: EnrichedTweet[] = []
) => {
  const replies = getReplies(tail.id_str);
  const selfThread = replies.find((r) => r?.in_thread);
  if (!selfThread) return ret;
  return flattenSelfThreads(selfThread, getReplies, [...ret, selfThread]);
};

export const LocationTag = ({
  location,
  tweet_type,
  className,
}: {
  location: string;
  tweet_type: string;
  className?: string;
}) => {
  return (
    <div
      className={`rounded-l-xl mr-2 text-center overflow-hidden text-2xl font-mono cursor-pointer hover:brightness-90 ${className} ${s.tag} py-2`}
      style={{
        backgroundColor: getColor(location),
        width: "2rem",
        // height: `6rem`,
      }}
    >
      <ArrowLeft
        className={`text-stone-600 hidden`}
        // style={{
        //   height: `${tagSize / 1.8}rem`,
        //   width: `${tagSize / 1.8}rem`,
        // }}
      />
      <span>{ptypeConfig[tweet_type as keyof typeof ptypeConfig].icon}</span>
    </div>
  );
};

// Thread is the root post of a thread
export default function Thread({ post }: { post: EnrichedTweet }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { posts } = useContext(DataContext);

  // const selfThreads = flattenSelfThreads(post, getReplies);
  // const previewThread = selfThreads.length ? selfThreads[0] : null;

  const replies = posts[post.id_str]?.replies
    ?.map((rid) => posts[rid])
    .sort((a, b) => (b.score || 0) - (a.score || 0));
  const previewReply =
    replies.length && (replies[0].score || 0) > 0.5 ? replies[0] : null;

  const jumpToLocation = (event: MouseEvent) => {
    event.preventDefault();
    const locID = event.currentTarget.getAttribute("data-id");
    if (!locID) return;
    const locEle = document.getElementById(locID);
    if (locEle) {
      locEle.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <TweetContainer className={s.tag_parent}>
      <TweetHeader tweet={post} />
      {post.location && post.tweet_type && (
        <div
          data-id={`${post.location}$%^${post.tweet_type}`}
          onClick={jumpToLocation}
          className={`rounded-full text-md font-mono flex items-center px-2 h-9 justify-center ${s.tag} hover:brightness-95 cursor-pointer text-stone-800 absolute -top-4 left-3 opacity-90 -z-0`}
          style={{ backgroundColor: getColor(post.location) }}
        >
          {/* <ArrowLeft className={`${s.arrowIcon} h-4 w-4 -ml-[0.12rem]`} /> */}
          <div className="text-xl">
            {ptypeConfig[post.tweet_type as keyof typeof ptypeConfig].icon}
          </div>
          <div className="ml-[0.2rem]">{post.tweet_type}</div>
        </div>
      )}
      <TweetBody tweet={post} />
      {post.mediaDetails?.length ? <TweetMedia tweet={post} /> : null}
      <TweetActions tweet={post} />
      {/* {previewThread ? (
        <div className="relative overflow-hidden">
          <div
            className="flex-col mt-1 pointer-events-none max-h-64"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 0%, transparent 96%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, transparent 96%)",
            }}
          >
            <TweetBody tweet={previewThread} />
            {previewThread.mediaDetails?.length ? (
              <TweetMedia tweet={previewThread} />
            ) : null}
          </div>
          <Button
            className="absolute bottom-[20%] left-0 right-0 mx-auto w-fit font-semibold text-base z-50 rounded-full h-10 px-8 bg-zinc-100 shadow-md hover:bg-zinc-200 text-stone-700"
            variant="secondary"
            onClick={() => setIsExpanded(true)}
          >
            Read full thread
          </Button>
        </div>
      ) : previewReply ? (
        <TweetContainer inThread>
          <TweetHeader tweet={previewReply} />
          <TweetBody tweet={previewReply} />
        </TweetContainer>
      ) : null}
      {isExpanded ? (
        <SelfThread
          post={post}
          onClick={() => setIsExpanded(false)}
          selfThreads={selfThreads}
        />
      ) : null} */}
    </TweetContainer>
  );
}

const SelfThread = ({
  post,
  onClick,
  selfThreads,
}: {
  post: EnrichedTweet;
  onClick: () => void;
  selfThreads: EnrichedTweet[];
}) => {
  return (
    <Card
      className="fixed top-8 bottom-2 right-3 z-50 rounded-2xl overflow-hidden"
      style={{
        width: `calc(${SIDEBAR_WIDTH} - 16px)`,
      }}
    >
      <CardHeader className="sticky top-0 left-0 w-full flex-row justify-between pt-4 bg-white border-b border-stone-200 pb-0 z-50 mb-1">
        <TweetHeader tweet={post} />
        <Button
          variant="secondary"
          className="absolute top-3 right-4 rounded-full text-lg font-mono bg-stone-100 w-10 h-10 hover:bg-stone-200"
          onClick={onClick}
        >
          x
        </Button>
      </CardHeader>
      <HideScroll paddingLeft={0.4} paddingRight={0.4} paddingBottom={4}>
        {[post, ...selfThreads].map((t) => (
          <div
            id={t.id_str}
            className="hover:bg-[#f8f8f8] px-3 rounded-2xl transition-colors pt-2 pb-0.5"
          >
            {/* <div className="w-full h-10 rounded-full bg-stone-200 mb-1.5 px-3 flex items-center cursor-pointer">
              <ArrowLeft className={`${s.arrowIcon} h-6 w-8`} />
            </div> */}
            <TweetBody tweet={t} />
            {t.mediaDetails?.length ? <TweetMedia tweet={t} /> : null}
            <TweetActions tweet={t} />
          </div>
        ))}
      </HideScroll>
    </Card>
  );
};
