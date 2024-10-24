import { useEffect, useState } from "react";
import { getScrollbarWidth, scrollbarWidth } from "./Scrollbar";

type Props = {
  children: React.ReactNode;
  className?: string;
  paddingLeft?: number;
  paddingRight?: number;
  paddingY?: number;
  scrollRef?: React.RefObject<HTMLDivElement>;
  direction?: "ltr" | "rtl";
};

export default function HideScroll({
  children,
  className,
  paddingLeft,
  paddingRight,
  paddingY,
  scrollRef,
  direction = "ltr",
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
      className={`overflow-hidden overscroll-none ${
        className || "relative w-full h-full"
      }`}
    >
      <div
        className="absolute top-0 bottom-0 left-0 overflow-y-scroll"
        ref={scrollRef}
        style={{
          top: `${paddingY || 0}px`,
          bottom: `${paddingY || 0}px`,
          left: direction === "rtl" ? `-${sbWidth}px` : undefined,
          right: direction === "ltr" ? `-${sbWidth}px` : undefined,
        }}
      >
        <div
          {...props}
          style={{
            paddingLeft: `${paddingLeft || 0}px`,
            paddingRight: `${paddingRight || 0}px`,
            overflow: "hidden",
            height: "fit-content",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
