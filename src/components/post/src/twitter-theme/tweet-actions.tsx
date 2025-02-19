import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EnrichedTweet, formatNumber } from "../utils.js";
import s from "./tweet-actions.module.css";
import { TweetInfo } from "./tweet-info.js";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../ui/tooltip.jsx";

export const TweetActions = ({
  tweet,
  onClickDiscussion,
  inThread = false,
}: {
  tweet: EnrichedTweet;
  onClickDiscussion?: (event: React.MouseEvent) => void;
  inThread?: Boolean;
}) => {
  const favoriteCount = formatNumber(tweet.favorite_count);

  return (
    <div className={s.actions} data-in-thread={inThread}>
      <a
        className={s.like}
        href={tweet.like_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Like. This Tweet has ${favoriteCount} likes`}
      >
        <div className={s.likeIconWrapper}>
          <svg viewBox="0 0 24 24" className={s.likeIcon} aria-hidden="true">
            <g>
              <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
            </g>
          </svg>
        </div>
        <span className={s.likeCount}>{favoriteCount}</span>
      </a>
      <TooltipProvider>
        <Tooltip delayDuration={160}>
          <TooltipTrigger>
            <div
              className={clsx(s.reply, "cursor-pointer")}
              onClick={onClickDiscussion}
            >
              <div className={s.replyIconWrapper}>
                <svg
                  viewBox="0 0 24 24"
                  className={s.replyIcon}
                  aria-hidden="true"
                >
                  <g>
                    <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01z"></path>
                  </g>
                </svg>
              </div>
              <span
                className={s.replyText}
                data-pid={tweet.id_str}
                data-name={tweet.user.screen_name}
              >
                {tweet.reply_count}{" "}
                {tweet.reply_count > 1 ? "Replies" : "Reply"}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="text-md">
            Click to view or hide replies
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className={clsx(s.reply, "cursor-pointer")}>
        <div className={s.replyIconWrapper}>
          <FontAwesomeIcon
            icon={faReply}
            className="text-zinc-400"
            style={{
              width: inThread ? "1.25rem" : "1.4rem",
              height: inThread ? "1.25rem" : "1.4rem",
            }}
          />
        </div>
        <span className={s.replyText}>Reply</span>
      </div>
      <TweetInfo
        tweet={tweet}
        style={{ marginLeft: "auto", marginRight: "0.4rem" }}
      />
    </div>
  );
};
