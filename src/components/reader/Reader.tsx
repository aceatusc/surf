import {
  DocumentContext,
  DocumentWrapper,
  Overlay,
  PageWrapper,
  RENDER_TYPE,
  ScrollContext,
  TransformContext,
  UiContext,
} from "../pdf";
import { useContext, useEffect, useState } from "react";
import Highlight from "./Highlight";
import { THighlightData } from "../types";
import { useSidebar } from "../ui/sidebar";

export default function Reader({
  url,
  highlightData,
}: {
  url: string;
  highlightData: THighlightData;
}) {
  const { numPages, pageDimensions } = useContext(DocumentContext);
  const { setScale } = useContext(TransformContext);
  const { setScrollRoot, resetScrollObservers, setScrollThreshold } =
    useContext(ScrollContext);
  const { isLoading } = useContext(UiContext);
  const { open, isMobile } = useSidebar();

  useEffect(() => {
    if (isLoading) return;
    setScrollRoot(null);
    resetScrollObservers();
    setScrollThreshold(0.8);
  }, [isLoading]);

  useEffect(() => {
    if (pageDimensions.width == 0 || pageDimensions.height == 0) return;
    const handleResize = () => {
      if (pageDimensions.width === 0) return;
      const newWidth =
        (window.innerWidth < 768
          ? window.innerWidth
          : Math.min(window.innerWidth - 420, 0.7 * window.innerWidth)) - 48;
      setScale(Math.floor((newWidth / pageDimensions.width) * 10) / 10);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pageDimensions]);

  return (
    <div
      style={{
        width: isMobile
          ? "100%"
          : open
          ? "calc(100vw - max(42rem, 30vw))"
          : "100%",
        direction: "rtl",
      }}
      className="transition-all h-full overflow-auto"
    >
      <DocumentWrapper
        className="w-fit my-0 mx-auto"
        file={url}
        renderType={RENDER_TYPE.MULTI_CANVAS}
      >
        {Array.from({ length: numPages }).map((_, i) => (
          <PageWrapper
            key={i}
            pageIndex={i}
            renderType={RENDER_TYPE.MULTI_CANVAS}
          >
            <Overlay>
              {highlightData[i] && <Highlight data={highlightData[i]} />}
            </Overlay>
          </PageWrapper>
        ))}
      </DocumentWrapper>
    </div>
  );
}
