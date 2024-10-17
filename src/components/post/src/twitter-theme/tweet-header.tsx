import clsx from "clsx";
import type { EnrichedTweet } from "../utils.js";
import type { TwitterComponents } from "./types.jsx";
import { AvatarImg } from "./avatar-img.jsx";
import s from "./tweet-header.module.css";
import { VerifiedBadge } from "./verified-badge.jsx";
import { Badge } from "../../../ui/badge";

type Props = {
  tweet: EnrichedTweet;
  components?: TwitterComponents;
};

export const ptypeConfig = {
  all: { backgroundColor: "#002d9c", color: "#F4F1DE", icon: "🔎" },
  author: { backgroundColor: "#198038", color: "#F4F1DE", icon: "✍️" },
  opinion: { backgroundColor: "#1192e8", color: "#F4F1DE", icon: "🧠" },
  critic: { backgroundColor: "#570408", color: "#F4F1DE", icon: "🧐" },
  "tl;dr": { backgroundColor: "#72383d", color: "#F4F1DE", icon: "🎯" },
  question: { backgroundColor: "#6929c4", color: "#F4F1DE", icon: "🙋" },
};

export const TweetHeader = ({ tweet, components }: Props) => {
  const Img = components?.AvatarImg ?? AvatarImg;
  const { user, tweet_type, is_reply: is_reply } = tweet;

  const userUrl = `https://twitter.com/${user.screen_name}`;
  const avatarSize = is_reply ? 20 : 32;

  return (
    <div className={s.header} data-in-thread={is_reply}>
      <a
        href={userUrl}
        className={s.avatar}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div
          className={clsx(
            s.avatarOverflow,
            user.profile_image_shape === "Square" && s.avatarSquare
          )}
        >
          <Img
            src={user.profile_image_url_https}
            alt={user.name}
            width={avatarSize}
            height={avatarSize}
          />
        </div>
        <div className={s.avatarOverflow}>
          <div className={s.avatarShadow}></div>
        </div>
      </a>
      <div className={s.author}>
        <a
          href={userUrl}
          className={s.authorLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={s.authorLinkText}>
            <span title={user.name}>{user.name}</span>
          </div>
          <VerifiedBadge user={user} className={s.authorVerified} />
        </a>
        {!tweet.is_reply && (
          <div className={s.authorMeta}>
            <a
              href={userUrl}
              className={s.username}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span title={`@${user.screen_name}`}>@{user.screen_name}</span>
            </a>
            <div className={s.authorFollow}>
              <span className={s.separator}>·</span>
              <a
                href={user.follow_url}
                className={s.follow}
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow
              </a>
            </div>
          </div>
        )}
      </div>
      {tweet_type && (
        <Badge className="ml-auto px-3 py-1 rounded-full bg-zinc-200 text-zinc-800 hover:bg-zinc-300">
          <div
            className={`mr-1.5 ${is_reply ? "text-[1.2rem]" : "text-[1.6rem]"}`}
          >
            {ptypeConfig[tweet_type].icon}
          </div>
          <span className={is_reply ? "text-[1rem]" : "text-lg"}>
            {tweet_type}
          </span>
        </Badge>
      )}
    </div>
  );
};
