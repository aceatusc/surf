import "react-pdf-highlighter/dist/style.css";
import { PdfHighlighter, PdfLoader } from "react-pdf-highlighter";
import { useContext, useEffect } from "react";
import { ReaderContext } from "@/context/ReaderContext";
import { THighlight } from "../types";
import Highlight from "./Highlight";

export default function Reader({
  url,
  highlights,
}: {
  url: string;
  highlights: THighlight[];
}) {
  const { scale, setScale } = useContext(ReaderContext);

  useEffect(() => {
    const handleResize = () => {
      const newWidth =
        window.innerWidth < 768
          ? window.innerWidth
          : Math.min(window.innerWidth - 420, 0.7 * window.innerWidth) - 48;
      setScale(Math.floor((newWidth / 700) * 10) / 10);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <PdfLoader url={url} beforeLoad={<div>Loading...</div>}>
      {(pdfDocument) => (
        <PdfHighlighter
          pdfDocument={pdfDocument}
          highlights={highlights}
          pdfScaleValue={scale.toString()}
          highlightTransform={(
            highlight,
            index,
            setTip,
            hideTip,
            viewportToScaled,
            screenshot,
            isScrolledTo
          ) => <Highlight {...highlight} />}
        />
      )}
    </PdfLoader>
  );
}
