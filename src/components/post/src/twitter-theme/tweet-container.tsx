import type { ReactNode } from "react";
import clsx from "clsx";
import s from "./tweet-container.module.css";
import "./theme.css";

type Props = {
  className?: string;
  children: ReactNode;
  inThread?: boolean;
  id?: string;
  style?: React.CSSProperties;
};

export const TweetContainer = ({
  className,
  children,
  inThread,
  id,
  style,
}: Props) => (
  <div
    className={clsx("react-tweet-theme", s.root, className)}
    data-in-thread={inThread}
    id={id}
    style={style}
  >
    <article className={s.article}>{children}</article>
  </div>
);
