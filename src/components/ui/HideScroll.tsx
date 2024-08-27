import { useEffect, useState } from "react";
import s from "./HideScroll.module.css";
import { getScrollbarWidth, scrollbarWidth } from "./Scrollbar";

type Props = {
  children: React.ReactNode;
  className?: string;
  paddingX?: number;
  paddingY?: number;
  scrollRef?: React.RefObject<HTMLDivElement>;
};

export default function HideScroll({
  children,
  className,
  paddingX,
  paddingY,
  scrollRef,
  ...props
}: Props) {
  const [sbWidth, setSbWidth] = useState<number>(0);

  useEffect(() => {
    setSbWidth(
      scrollbarWidth === undefined ? getScrollbarWidth() : scrollbarWidth
    );
  }, []);

  return (
    <div className={`${s.parent} ${className || s.parent_default}`}>
      <div
        className={s.child}
        ref={scrollRef}
        style={{
          top: `${paddingY || 0}px`,
          bottom: `${paddingY || 0}px`,
          right: `-${sbWidth}px`,
        }}
      >
        <div
          {...props}
          style={{
            paddingLeft: `${paddingX || 0}px`,
            paddingRight: `${paddingX || 0}px`,
            overflowY: "auto",
            height: "fit-content",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
