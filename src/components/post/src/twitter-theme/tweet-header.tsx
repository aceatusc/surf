import clsx from "clsx";
import type { EnrichedTweet } from "../utils.js";
import { AvatarImg } from "./avatar-img.jsx";
import s from "./tweet-header.module.css";
import { VerifiedBadge } from "./verified-badge.jsx";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../../ui/hover-card.jsx";
import { Separator } from "../../../ui/separator.jsx";
import { Fragment, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { Toggle } from "../../../ui/toggle.jsx";
import { Button } from "../../../ui/button.jsx";
import { ptypeConfig } from "../../../types/index.js";
import { getColor } from "../../../../context/ColorManager.jsx";
import { ArrowLeft } from "lucide-react";

type Props = {
  tweet: EnrichedTweet;
  component?: ReactNode;
  inThread?: boolean;
};

export const TweetHeader = ({ tweet, component, inThread = false }: Props) => {
  const { user } = tweet;
  const userUrl = `https://twitter.com/${user.screen_name}`;

  return (
    <div className={s.header} data-in-thread={inThread}>
      {component}
      <HoverCard openDelay={360} closeDelay={100}>
        <HoverCardTrigger
          href={userUrl}
          className={`${s.avatar} relative z-10`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div
            className={clsx(
              s.avatarOverflow,
              user.profile_image_shape === "Square" && s.avatarSquare
            )}
          >
            <img src={user.profile_image_url_https} alt={user.name} />
          </div>
          <div className={s.avatarOverflow}>
            <div className={s.avatarShadow}></div>
          </div>
        </HoverCardTrigger>
        <div className={s.author}>
          <HoverCardTrigger
            href={userUrl}
            className={s.authorLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={s.authorLinkText}>
              <span title={user.name}>{user.name}</span>
            </div>
            <VerifiedBadge user={user} className={s.authorVerified} />
          </HoverCardTrigger>
          {!inThread && (
            <div className={s.authorMeta}>
              <HoverCardTrigger
                href={userUrl}
                className={s.username}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span title={`@${user.screen_name}`}>@{user.screen_name}</span>
              </HoverCardTrigger>
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
        <HoverCardContent
          className="max-w-[20rem] rounded-2xl w-full"
          sideOffset={8}
        >
          <div className="text-center">
            <span className="text-xl font-bold block">
              {user.followers_count || 0}
            </span>
            <span className="text-stone-600 text-lg block">Followers</span>
          </div>
          <Separator className="mt-1 mb-3" />
          <div className="whitespace-pre-wrap break-words text-lg leading-6 mb-2">
            {user.description ? (
              user.description.split(/[\s,.!?]+/).map((word, index) =>
                word.startsWith("@") && word.length > 1 ? (
                  <Fragment key={index}>
                    <a href={`https://twitter.com/${word.slice(1)}`}>{word}</a>{" "}
                  </Fragment>
                ) : (
                  <Fragment key={index}>{word} </Fragment>
                )
              )
            ) : (
              <span>
                <i className=" text-stone-600">{user.name}</i> has no bio
              </span>
            )}
          </div>
          <div className="flex-col">
            {user.entities?.url?.urls?.map(
              ({
                display_url,
                expanded_url,
              }: {
                display_url: string;
                expanded_url: string;
              }) => (
                <div key={expanded_url}>
                  🔗
                  <a
                    href={expanded_url}
                    className="text-lg ml-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {display_url}
                  </a>
                </div>
              )
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};
