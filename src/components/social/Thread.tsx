import {
  TweetActions,
  TweetBody,
  TweetContainer,
  TweetHeader,
  TweetMedia,
  EnrichedTweet,
} from "../post/src";
import { Button } from "../ui/button";
import { Fragment, MouseEvent, useContext, useEffect, useState } from "react";
import { SIDEBAR_WIDTH } from "../ui/sidebar";
import { Card, CardHeader } from "../ui/card";
import HideScroll from "../ui/HideScroll";
import { ArrowLeft, ChevronsUpDown } from "lucide-react";
import { getColor } from "@/context/ColorManager";
import { ptypeConfig } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleDown,
  faClose,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import s from "./Thread.module.css";
import { DataContext } from "@/context/DataContext";

const jumpToLocation = (event: MouseEvent) => {
  event.preventDefault();
  const locID = event.currentTarget.getAttribute("data-id");
  if (!locID) return;
  const locEle = document.getElementById(locID);
  if (locEle) {
    locEle.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};

// Thread is the root post of a thread
export default function Thread({ post }: { post: EnrichedTweet }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { posts } = useContext(DataContext);

  const previewThread = post.thread_posts && posts[post.thread_posts[1]];

  const replies = posts[post.id_str]?.replies
    ?.map((rid) => posts[rid])
    .sort((a, b) => (b.score || 0) - (a.score || 0));
  const previewReply =
    replies.length && (replies[0].score || 0) > 0.5 ? replies[0] : null;

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
          <ArrowLeft className={`${s.arrowIcon} hidden w-5 h-5`} />
          <div className="text-xl">
            {ptypeConfig[post.tweet_type as keyof typeof ptypeConfig].icon}
          </div>
          <div className="ml-[0.2rem]">{post.tweet_type}</div>
        </div>
      )}
      <TweetBody tweet={post} />
      {post.mediaDetails?.length ? <TweetMedia tweet={post} /> : null}
      <TweetActions
        tweet={post}
        onClickDiscussion={() => setIsExpanded(true)}
      />
      {previewThread ? (
        <div className="relative">
          <div
            className="flex-col mt-1 pointer-events-none max-h-48"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 0%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, transparent 100%)",
            }}
          >
            <TweetBody tweet={previewThread} />
            {previewThread.mediaDetails?.length ? (
              <TweetMedia tweet={previewThread} />
            ) : null}
          </div>
          <Button
            className="absolute bottom-0 left-1 right-0 mr-auto w-fit font-semibold text-base z-10 rounded-full h-10 px-8 hover:bg-zinc-50 text-stone-700 shadow-md bg-white"
            variant="ghost"
            onClick={() => setIsExpanded(true)}
          >
            <FontAwesomeIcon
              icon={faAngleDoubleDown}
              className="text-stone-600 mr-0.5"
            />
            Read more
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
          onClick={() => setIsExpanded(false)}
          selfThreads={post.thread_posts?.map((id) => posts[id]) || []}
        />
      ) : null}
    </TweetContainer>
  );
}

const PreviewReply = ({
  post,
  onClick,
}: {
  post: EnrichedTweet;
  onClick?: () => void;
}) => {
  return (
    <TweetContainer inThread>
      <TweetHeader tweet={post} inThread />
      <TweetBody tweet={post} inThread />
      <div
        className="mt-1 text-[#006fd6] cursor-pointer hover:text-pink-600 inline-block font-semibold"
        onClick={onClick}
      >
        Read more
      </div>
    </TweetContainer>
  );
};

const ThreadReply = ({
  post,
  layer = 3,
  expand = false,
  preview = false,
}: {
  post: EnrichedTweet;
  layer?: number;
  expand: boolean;
  preview?: boolean;
}) => {
  const { posts } = useContext(DataContext);
  const [childExpand, setChildExpand] = useState(expand);
  const [childLayer, setChildLayer] = useState(layer);

  const replies = posts[post.id_str]?.replies
    ?.map((rid) => posts[rid])
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  const previewReply = replies.length
    ? (replies[0].score || 0) > 0.5
      ? replies[0]
      : null
    : null;
  replies.sort(
    (a, b) =>
      (b.thread_score || b.score || 0) - (a.thread_score || a.score || 0)
  );

  return (
    <Fragment>
      <TweetActions
        tweet={post}
        onClickDiscussion={() => {
          if (childLayer) setChildExpand((prev) => !prev);
          else {
            setChildExpand(true);
            setChildLayer(100);
          }
        }}
        inThread={!preview}
      />
      {childExpand && replies.length && childLayer ? (
        <Fragment>
          {replies.map((reply) => (
            <TweetContainer key={reply.id_str} inThread>
              <TweetHeader tweet={reply} inThread />
              <TweetBody tweet={reply} inThread />
              {reply.mediaDetails?.length ? <TweetMedia tweet={reply} /> : null}
              <ThreadReply
                post={reply}
                expand={childExpand}
                layer={childLayer - 1}
              />
            </TweetContainer>
          ))}
        </Fragment>
      ) : preview && previewReply ? (
        <PreviewReply
          post={previewReply}
          onClick={() => setChildExpand((prev) => !prev)}
        />
      ) : !layer && replies.length ? (
        <div
          className="text-[#006fd6] cursor-pointer hover:text-pink-600 inline-block font-semibold"
          onClick={() => {
            setChildExpand(true);
            setChildLayer(100);
          }}
        >
          Read more
        </div>
      ) : null}
    </Fragment>
  );
};

const SelfThreadItem = ({
  post,
  idx,
  length,
}: {
  post: EnrichedTweet;
  idx: number;
  length: number;
}) => {
  return (
    <div
      id={post.id_str}
      className="hover:bg-[#f8f8f8] px-3 rounded-2xl transition-colors pt-2 pb-0.5 relative"
    >
      <TweetBody tweet={post} inThread>
        <div
          className="absolute top-3 right-[100%] flex items-center justify-center rounded-l-full py-2 pl-3 pr-1 hover:pr-1.5 hover:pl-4 transition-all cursor-pointer opacity-90 hover:opacity-100"
          style={{
            backgroundColor: getColor(post.location),
          }}
          onClick={jumpToLocation}
          data-id={`${post.location}$%^${post.tweet_type}`}
        >
          {/* <ArrowLeft className="w-5 h-5" /> */}
          <div className="text-md whitespace-nowrap font-mono">
            <b className="underline">{idx}</b>
            <i className="text-sm">/{length}</i>
          </div>
        </div>
      </TweetBody>
      {post.mediaDetails?.length ? <TweetMedia tweet={post} /> : null}
      <ThreadReply post={post} expand={false} preview />
    </div>
  );
};

const SelfThread = ({
  onClick,
  selfThreads,
}: {
  onClick: () => void;
  selfThreads: EnrichedTweet[];
}) => {
  return (
    <div
      className="fixed top-8 bottom-1 z-50 overflow-hidden w-[44rem] 2xl:w-[45rem]"
      style={{
        // left: "calc(min(calc(50% + 20rem), calc(100% - 41.4rem)) - 3rem)",
        marginLeft: "-4.5rem",
      }}
    >
      <div className="flex justify-between bg-white border-b border-stone-200 pt-4 pl-2 pr-1 pb-0 ml-[3rem] rounded-t-3xl shadow-md h-[4.8rem]">
        <TweetHeader tweet={selfThreads[0]} />
        <Button
          variant="secondary"
          className="rounded-full font-mono w-10 h-10 bg-stone-200 hover:bg-stone-300 text-stone-600 mt-1"
          onClick={onClick}
        >
          <FontAwesomeIcon icon={faClose} />
        </Button>
      </div>
      <HideScroll
        paddingLeft={3}
        paddingBottom={4.8}
        className="relative w-full h-full shadow-xl rounded-b-3xl"
      >
        <div className="bg-white shadow-md rounded-b-3xl border-l border-r border-b">
          {selfThreads.map((t, idx) => (
            <SelfThreadItem
              key={t.id_str}
              post={t}
              idx={idx + 1}
              length={selfThreads.length}
            />
          ))}
        </div>
      </HideScroll>
    </div>
  );
};
