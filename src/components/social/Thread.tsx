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
import clsx from "clsx";
import { ThreadContext } from "@/context/ThreadContext";

const jumpToLocation = (event: MouseEvent) => {
  event.preventDefault();
  const locID = event.currentTarget.getAttribute("data-loc");
  if (!locID) return;
  const locEle = document.getElementById(locID);
  if (locEle) {
    locEle.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};

// Thread is the root post of a thread
export default function Thread({ post }: { post: EnrichedTweet }) {
  const { expandThread, setExpandThread } = useContext(ThreadContext);
  const { posts } = useContext(DataContext);

  const previewThread = post.in_thread && posts[post.in_thread[1]];

  const replies = posts[post.id_str]?.replies
    ?.map((rid) => posts[rid])
    .sort((a, b) => (b.score || 0) - (a.score || 0));
  const previewReply =
    replies.length && (replies[0].score || 0) > 0.5 ? replies[0] : null;

  return (
    <TweetContainer className={s.tag_parent}>
      <TweetHeader tweet={post} />
      {post.tweet_type && (
        <div
          data-loc={`${post.location}$%^${post.tweet_type}`}
          onClick={jumpToLocation}
          className={`rounded-full text-md font-mono flex items-center px-2 h-9 justify-center ${s.tag} hover:brightness-95 cursor-pointer text-stone-800 absolute -top-4 left-3 opacity-90 -z-0`}
          style={{ backgroundColor: getColor(post.location) }}
        >
          {post.location && (
            <div className="hidden">
              <ArrowLeft className={`${s.arrowIcon} w-5 h-5`} />
            </div>
          )}
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
        onClickDiscussion={() => setExpandThread(post.id_str)}
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
            onClick={() => setExpandThread(post.id_str)}
          >
            <FontAwesomeIcon
              icon={faAngleDoubleDown}
              className="text-stone-600 mr-0.5"
            />
            Read more
          </Button>
        </div>
      ) : previewReply ? (
        <PreviewReply
          post={previewReply}
          onClick={() => setExpandThread(post.id_str)}
        />
      ) : null}
      {expandThread === post.id_str && (post.in_thread || replies.length) ? (
        <ThreadView
          onClick={() => setExpandThread(null)}
          threads={post.in_thread?.map((id) => posts[id]) || [post, ...replies]}
          isSelf={!!previewThread}
        />
      ) : null}
    </TweetContainer>
  );
}

const ReadMore = ({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        "text-[#006fd6] cursor-pointer hover:text-pink-600 inline-block font-semibold",
        className
      )}
      onClick={onClick}
    >
      Read more
    </div>
  );
};

const PreviewReply = ({
  post,
  onClick,
}: {
  post: EnrichedTweet;
  onClick: () => void;
}) => {
  return (
    <TweetContainer inThread>
      <TweetHeader tweet={post} inThread />
      <TweetBody tweet={post} inThread>
        <ThreadTag post={post} />
      </TweetBody>
      <ReadMore onClick={onClick} />
    </TweetContainer>
  );
};

const ThreadTag = ({
  post,
  isSelf = false,
  idx,
  length,
}: {
  post: EnrichedTweet;
  isSelf?: boolean;
  idx?: number;
  length?: number;
}) => {
  return post.tweet_type ? (
    <div
      className={`absolute top-3 right-[100%] flex items-center justify-center rounded-l-full py-2 pl-3 ${
        isSelf ? "pr-1" : ""
      } transition-all ${
        post.location ? "cursor-pointer hover:pr-1.5 hover:pl-4" : ""
      } opacity-${isSelf ? "90" : "60"} hover:opacity-100`}
      style={{
        backgroundColor: getColor(post.location),
      }}
      onClick={jumpToLocation}
      data-loc={`${post.location}$%^${post.tweet_type}`}
    >
      {/* <ArrowLeft className="w-5 h-5" /> */}
      {isSelf ? (
        <div className="text-md whitespace-nowrap font-mono">
          <b className="underline">{idx}</b>
          <i className="text-sm">/{length}</i>
        </div>
      ) : post.tweet_type ? (
        <div
          className="rounded-full h-6 w-6"
          style={{ backgroundColor: getColor(post.location) }}
        >
          {ptypeConfig[post.tweet_type as keyof typeof ptypeConfig].icon}
        </div>
      ) : null}
    </div>
  ) : null;
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
  const { posts, focusMode } = useContext(DataContext);
  const [childExpand, setChildExpand] = useState(expand);
  const [childLayer, setChildLayer] = useState(layer);
  const [renderReplies, setRenderReplies] = useState<EnrichedTweet[]>([]);

  const replies = posts[post.id_str]?.replies
    ?.map((rid) => posts[rid])
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  useEffect(() => {
    // console.log(post.id_str, focusMode, replies.length, layer);
    if (focusMode && replies.length && layer == 3 && preview) {
      setRenderReplies(
        replies
          .filter((r) => (r.thread_score || r.score || 0) > 0.2)
          .sort(
            (a, b) =>
              (b.thread_score || b.score || 0) -
              (a.thread_score || a.score || 0)
          )
      );
    } else {
      setRenderReplies(replies);
    }
  }, []);

  const previewReply = replies.length
    ? (replies[0].score || 0) > 0.5
      ? replies[0]
      : null
    : null;

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
      {childExpand && childLayer ? (
        <Fragment>
          {(focusMode ? renderReplies : replies).map((reply) => (
            <TweetContainer key={reply.id_str} inThread>
              <TweetHeader tweet={reply} inThread />
              <TweetBody tweet={reply} inThread>
                <ThreadTag post={reply} />
              </TweetBody>
              {reply.mediaDetails?.length ? <TweetMedia tweet={reply} /> : null}
              <ThreadReply
                post={reply}
                expand={childExpand}
                layer={childLayer - 1}
              />
            </TweetContainer>
          ))}
          {focusMode && replies.length > renderReplies.length ? (
            <div className="bg-stone-100 px-3 ml-1 w-[28rem] py-2 rounded-xl mt-2">
              <div className="text-stone-600 w-full">
                You are in focus mode. We've hidden some discussions. Click here
                to see more.
              </div>
              <ReadMore onClick={() => setRenderReplies(replies)} />
            </div>
          ) : null}
        </Fragment>
      ) : preview && previewReply ? (
        <PreviewReply
          post={previewReply}
          onClick={() => setChildExpand((prev) => !prev)}
        />
      ) : !layer && replies.length ? (
        <ReadMore
          onClick={() => {
            setChildExpand(true);
            setChildLayer(100);
          }}
        />
      ) : null}
    </Fragment>
  );
};

const ThreadItem = ({
  post,
  idx,
  length,
  isSelf = false,
}: {
  post: EnrichedTweet;
  idx: number;
  length: number;
  isSelf?: boolean;
}) => {
  return (
    <div
      id={post.id_str}
      className="hover:bg-[#f8f8f8] px-3 rounded-2xl transition-colors pt-2 pb-0.5 relative"
    >
      {isSelf ? null : <TweetHeader tweet={post} inThread />}
      <TweetBody tweet={post} inThread>
        <ThreadTag post={post} idx={idx} length={length} isSelf={isSelf} />
      </TweetBody>
      {post.mediaDetails?.length ? <TweetMedia tweet={post} /> : null}
      {(idx > 1 || isSelf) && (
        <ThreadReply post={post} expand={!isSelf} preview={isSelf} />
      )}
    </div>
  );
};

const ThreadView = ({
  onClick,
  threads,
  isSelf = false,
}: {
  onClick: () => void;
  threads: EnrichedTweet[];
  isSelf?: boolean;
}) => {
  const { focusMode } = useContext(DataContext);
  if (focusMode && !isSelf) {
    threads = threads.filter((t) => (t.thread_score || t.score || 0) > 0.2);
  }
  return (
    <div
      className="fixed top-8 bottom-1 z-50 overflow-hidden w-[44rem] 2xl:w-[45rem]"
      style={{
        // left: "calc(min(calc(50% + 20rem), calc(100% - 41.4rem)) - 3rem)",
        marginLeft: "-4.5rem",
      }}
    >
      <div className="flex justify-between bg-white border-b border-stone-200 pt-2.5 pl-2 pr-1 pb-0 ml-[3.2rem] rounded-t-3xl shadow-md h-[4.8rem]">
        {isSelf ? (
          <TweetHeader tweet={threads[0]} />
        ) : (
          <div className="flex flex-row items-center">
            <div
              className="w-12 h-12 text-3xl ml-1 rounded-full flex items-center justify-center"
              style={{ backgroundColor: getColor(threads[0].location) }}
            >
              {
                ptypeConfig[threads[0].tweet_type as keyof typeof ptypeConfig]
                  .icon
              }
            </div>
            <div className="text-xl ml-3 font-mono">
              {threads[0].tweet_type}
            </div>
          </div>
        )}
        <Button
          variant="secondary"
          className="rounded-full w-10 h-10 bg-stone-200 hover:bg-stone-300 text-stone-600 mt-2.5"
          onClick={onClick}
        >
          <FontAwesomeIcon icon={faClose} />
        </Button>
      </div>
      <HideScroll
        paddingLeft={3.2}
        paddingBottom={4.8}
        className="relative w-full h-full shadow-xl rounded-b-3xl"
        fullHeight
      >
        <div className="bg-white shadow-md rounded-b-3xl border-l border-r border-b min-h-[calc(100vh-8rem)]">
          {threads.map((t, idx) => (
            <ThreadItem
              key={t.id_str}
              post={t}
              idx={idx + 1}
              length={threads.length}
              isSelf={isSelf}
            />
          ))}
        </div>
      </HideScroll>
    </div>
  );
};
