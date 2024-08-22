import {
  DocumentContext,
  DocumentWrapper,
  Overlay,
  PageWrapper,
  RENDER_TYPE,
  ScrollContext,
  TransformContext,
} from "../pdf";
import { useContext, useEffect, useRef } from "react";
import styles from "./Reader.module.css";
import { HighlightProps } from "../types/reader";
import { DataType } from "../types";
import Highlight from "./Highlight";

export type PageDataTypes = HighlightProps[];

export default function Reader({ data }: { data: DataType }) {
  const { numPages, pageDimensions } = useContext(DocumentContext);
  const { setScale } = useContext(TransformContext);
  const { setScrollRoot } = useContext(ScrollContext);
  const docRef = useRef<HTMLDivElement>(null);

  const samplePdfUrl = "/sample1.pdf";

  useEffect(() => {
    if (!docRef.current) return;
    setScrollRoot(docRef.current);
  }, [docRef.current]);

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
      inputRef={docRef}
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
