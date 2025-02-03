import {
  ptypeConfig,
  TweetActions,
  TweetBody,
  TweetContainer,
  TweetHeader,
  TweetMedia,
} from "../post/src";
import { Button } from "../ui/button";
import { useState } from "react";
import { SIDEBAR_WIDTH } from "../ui/sidebar";
import { Card, CardHeader } from "../ui/card";
import HideScroll from "../ui/HideScroll";
import { ArrowLeft, ChevronsUpDown } from "lucide-react";
import { getColor } from "@/context/ColorManager";
import s from "./Thread.module.css";
import { TPost } from "../types";

type TThread = {
  post: TPost;
  getReplies: (id: string) => TPost[];
  location: string;
};

const flattenSelfThreads = (
  tail: TPost,
  getReplies: (id: string) => TPost[],
  ret: TPost[] = []
) => {
  const replies = getReplies(tail.id_str);
  const selfThread = replies.find((r) => r.tweetDisplayType === "SelfThread");
  if (!selfThread) return ret;
  return flattenSelfThreads(selfThread, getReplies, [...ret, selfThread]);
};

const Post = ({ post, children }: TThread & { children: React.ReactNode }) => {
  return (
    <TweetContainer>
      <TweetHeader tweet={post} />
      <TweetBody tweet={post} />
      {post.mediaDetails?.length ? <TweetMedia tweet={post} /> : null}
      {children}
    </TweetContainer>
  );
};

// Thread is the root post of a thread
export default function Thread({ getReplies, post, location }: TThread) {
  const selfThreads = flattenSelfThreads(post, getReplies);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Post post={post} getReplies={getReplies} location={location}>
      {selfThreads.length ? (
        <Button
          className="w-full rounded-full font-semibold font-mono text-[1rem] bg-stone-100 hover:bg-stone-200 mt-3 flex justify-between"
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ChevronsUpDown />
          (🧵1/{selfThreads.length + 1}) Expand Thread
          <ChevronsUpDown />
        </Button>
      ) : (
        <TweetActions tweet={post} />
      )}
      {isExpanded ? (
        <SelfThread
          post={post}
          onClick={() => setIsExpanded(false)}
          selfThreads={selfThreads}
          location={location}
        />
      ) : null}
      {post.tweet_type && (
        <div className={s.tagContainer}>
          <div
            className={`rounded-tl-xl rounded-tr-xl px-4 pt-[0.2rem] text-lg flex items-center font-mono cursor-pointer ${s.tag}`}
            style={{
              backgroundColor: getColor(location),
            }}
          >
            <ArrowLeft className={`${s.arrowIcon} mt-0.5 mr-3`} />
            <span className="mt-0.5 mr-1.5">
              {ptypeConfig[post.tweet_type as keyof typeof ptypeConfig].icon}
            </span>
            {post.tweet_type}
          </div>
        </div>
      )}
    </Post>
  );
}

const SelfThread = ({
  post,
  onClick,
  selfThreads,
  location,
}: {
  post: TPost;
  onClick: () => void;
  selfThreads: TPost[];
  location: string;
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
      <HideScroll paddingLeft={4} paddingRight={4} paddingBottom={56}>
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
