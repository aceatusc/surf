import clsx from "clsx";
import type { EnrichedTweet } from "../utils.js";
import type { TwitterComponents } from "./types.js";
import { AvatarImg } from "./avatar-img.js";
import s from "./tweet-header.module.css";
import { VerifiedBadge } from "./verified-badge.js";

type Props = {
  tweet: EnrichedTweet;
  components?: TwitterComponents;
};

const ptypePalette = {
  Author: { backgroundColor: "#81b29a", color: "#2a2a2a" },
  Opinion: { backgroundColor: "#3D405B", color: "#F4F1DE" },
  Critic: { backgroundColor: "#E07A5F", color: "#F4F1DE" },
  "TL;DR": { backgroundColor: "#72383d", color: "#F4F1DE" },
};

export const TweetHeader = ({ tweet, components }: Props) => {
  const Img = components?.AvatarImg ?? AvatarImg;
  const { user, tweet_type, in_thread } = tweet;

  const userUrl = `https://twitter.com/${user.screen_name}`;
  const avatarSize = in_thread ? 20 : 32;

  return (
    <div className={s.header} data-in-thread={in_thread}>
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
        {!tweet.in_thread && (
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
      <div className={s.tag_container}>
        <div
          className={s.tag}
          style={ptypePalette[tweet_type as keyof typeof ptypePalette]}
        >
          {tweet_type}
        </div>
        {!in_thread && (
          <a
            href={tweet.url}
            className={s.brand}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on Twitter"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={s.twitterIcon}
            >
              <g>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </g>
            </svg>
          </a>
        )}
      </div>
    </div>
  );
};
