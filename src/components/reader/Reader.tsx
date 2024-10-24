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
import { useContext, useEffect } from "react";
import Highlight from "./Highlight";
import { THighlightData } from "../types";

export default function Reader({
  pdfUrl,
  highlightData,
}: {
  pdfUrl: string;
  highlightData: THighlightData;
}) {
  const { numPages, pageDimensions } = useContext(DocumentContext);
  const { setScale } = useContext(TransformContext);
  const { setScrollRoot, resetScrollObservers, setScrollThreshold } =
    useContext(ScrollContext);
  const { isLoading } = useContext(UiContext);

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
        window.innerWidth < 768
          ? window.innerWidth - 48
          : Math.max(window.innerWidth - 420, 0.75 * window.innerHeight) - 64;
      setScale(Math.floor((newWidth / pageDimensions.width) * 10) / 10);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pageDimensions]);

  return (
    <DocumentWrapper
      className="w-fit my-0 mx-auto"
      file={pdfUrl}
      renderType={RENDER_TYPE.SINGLE_CANVAS}
    >
      {Array.from({ length: numPages }).map((_, i) => (
        <PageWrapper
          key={i}
          pageIndex={i}
          renderType={RENDER_TYPE.SINGLE_CANVAS}
        >
          <Overlay>
            {highlightData[i] && <Highlight data={highlightData[i]} />}
          </Overlay>
        </PageWrapper>
      ))}
    </DocumentWrapper>
  );
}
