import {
  DocumentContext,
  DocumentWrapper,
  Overlay,
  PageWrapper,
  RENDER_TYPE,
  ScrollContext,
  TransformContext,
} from "../PdfRender";
import { useContext, useEffect } from "react";
import sampleBarBboxData from "../../assets/examples/sample1_bar_bbox.json";
import sampleTextBboxData from "../../assets/examples/sample1_text_bbox.json";
import styles from "./Reader.module.css";
import { HighlightBar, HighlightText } from "./Highlight";

export interface HighlightProps {
  bbox: number[];
  pgroup: number;
}

export type PageDataTypes = HighlightProps[];
const sampleBarBbox = sampleBarBboxData as PageDataTypes[];
const sampleTextBbox = sampleTextBboxData as PageDataTypes[];

export default function Reader() {
  const { numPages, pageDimensions } = useContext(DocumentContext);
  const { setScale } = useContext(TransformContext);
  const { setScrollRoot } = useContext(ScrollContext);

  const samplePdfUrl = "/sample1.pdf";

  useEffect(() => {
    setScrollRoot(null);
  }, []);

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
          <Overlay>
            {i < sampleBarBbox.length ? (
              <HighlightBar pageData={sampleBarBbox[i]} pageIndex={i} />
            ) : (
              <span />
            )}
            {i < sampleTextBbox.length ? (
              <HighlightText pageData={sampleTextBbox[i]} pageIndex={i} />
            ) : (
              <span />
            )}
          </Overlay>
        </PageWrapper>
      ))}
    </DocumentWrapper>
  );
}
