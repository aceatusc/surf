import clsx from "clsx";
import type { EnrichedTweet } from "../utils.js";
import type { TwitterComponents } from "./types.jsx";
import { AvatarImg } from "./avatar-img.jsx";
import s from "./tweet-header.module.css";
import { VerifiedBadge } from "./verified-badge.jsx";

type Props = {
  tweet: EnrichedTweet;
  components?: TwitterComponents;
};

export const ptypeConfig = {
  "Related Work": { icon: "📖", priority: 5 },
  Perspective: { icon: "💬", priority: 4 },
  Critique: { icon: "❗", priority: 3 },
  Overview: { icon: "🧵", priority: 1 },
  Viral: { icon: "🔥", priority: 7 },
  "Q&A": { icon: "❓", priority: 2 },
  Resource: { icon: "🔗", priority: 6 },
  Author: { icon: "✍️", priority: 0 },
};

export const TweetHeader = ({ tweet, components }: Props) => {
  const Img = components?.AvatarImg ?? AvatarImg;
  const { user, is_reply: is_reply } = tweet;

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
    </div>
  );
};
