import { useEffect, useState } from "react";
import { getScrollbarWidth, scrollbarWidth } from "./Scrollbar";

type Props = {
  children: React.ReactNode;
  className?: string;
  paddingLeft?: number;
  paddingRight?: number;
  paddingY?: number;
  paddingBottom?: number;
  scrollRef?: React.RefObject<HTMLDivElement>;
  direction?: "ltr" | "rtl";
  fullHeight?: boolean;
};

export default function HideScroll({
  children,
  className,
  paddingLeft,
  paddingRight,
  paddingY,
  paddingBottom,
  scrollRef,
  direction = "ltr",
  fullHeight = false,
  ...props
}: Props) {
  const [sbWidth, setSbWidth] = useState<number>(0);

  useEffect(() => {
    setSbWidth(
      scrollbarWidth === undefined ? getScrollbarWidth() : scrollbarWidth
    );
  }, []);

  return (
    <div
      className={`overflow-hidden overscroll-contain ${
        className || "relative w-full h-full"
      }`}
    >
      <div
        className="absolute top-0 bottom-0 left-0 overflow-y-scroll overflow-x-visible overscroll-contain"
        data-hide-scroll
        ref={scrollRef}
        style={{
          top: `${paddingY || 0}rem`,
          bottom: `${paddingY || paddingBottom || 0}rem`,
          left: direction === "rtl" ? `-${sbWidth || 16}px` : undefined,
          right: direction === "ltr" ? `-${sbWidth || 16}px` : undefined,
          paddingLeft: direction === "rtl" && !sbWidth ? "16px" : undefined,
          paddingRight: direction === "ltr" && !sbWidth ? "16px" : undefined,
        }}
      >
        <div
          {...props}
          style={{
            paddingLeft: `${paddingLeft || 0}rem`,
            paddingRight: `${paddingRight || 0}rem`,
            overflowY: "hidden",
            overflowX: "visible",
            height: "fit-content",
            minHeight: fullHeight ? "100%" : undefined,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
