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
import styles from "./Reader.module.css";
import { HighlightProps } from "../types/reader";
import Highlight from "./Highlight";
import { TQuote } from "../types";

export type PageDataTypes = HighlightProps[];

export default function Reader({ data }: { data: TQuote[][] }) {
  const { numPages, pageDimensions } = useContext(DocumentContext);
  const { setScale } = useContext(TransformContext);
  const { setScrollRoot, resetScrollObservers, setScrollThreshold } =
    useContext(ScrollContext);
  const { isLoading } = useContext(UiContext);

  const samplePdfUrl = "/sample1.pdf";

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
      const newWidth = window.innerWidth * 0.6 - 48;
      setScale(Math.floor((newWidth / pageDimensions.width) * 10) / 10);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pageDimensions]);

  return (
    <DocumentWrapper
      className={styles.reader_container}
      file={samplePdfUrl}
      renderType={RENDER_TYPE.SINGLE_CANVAS}
    >
      {Array.from({ length: numPages }).map((_, i) => (
        <PageWrapper
          key={i}
          pageIndex={i}
          renderType={RENDER_TYPE.SINGLE_CANVAS}
        >
          {i < numPages && data[i] && data[i].length ? (
            <Overlay>
              <Highlight pageData={data[i]} pageIndex={i} />
            </Overlay>
          ) : undefined}
        </PageWrapper>
      ))}
    </DocumentWrapper>
  );
}
