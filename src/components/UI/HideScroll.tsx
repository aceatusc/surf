import { useEffect, useState } from "react";
import s from "./HideScroll.module.css";

type Props = {
  children: React.ReactNode;
  className?: string;
  paddingX?: number;
  paddingY?: number;
};

let scrollbarWidth: number | undefined;

export function getScrollbarWidth() {
  if (scrollbarWidth !== undefined) {
    return scrollbarWidth;
  }

  const container = document.createElement("div");
  document.body.appendChild(container);

  container.style.overflow = "scroll";
  container.style.width = "30px";
  container.style.height = "1px";

  const inner = document.createElement("div");
  inner.style.width = "100%";
  inner.style.height = "100%";
  container.appendChild(inner);

  scrollbarWidth = container.offsetWidth - inner.offsetWidth;
  document.body.removeChild(container);

  return scrollbarWidth;
}

export default function HideScroll({
  children,
  className,
  paddingX,
  paddingY,
  ...props
}: Props) {
  const [sbWidth, setSbWidth] = useState<number>(0);

  useEffect(() => {
    setSbWidth(
      scrollbarWidth === undefined ? getScrollbarWidth() : scrollbarWidth
    );
  }, [scrollbarWidth]);

  return (
    <div className={`${s.parent} ${className || s.parent_default}`}>
      <div
        className={s.child}
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
