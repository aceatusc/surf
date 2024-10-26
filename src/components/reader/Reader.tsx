import "react-pdf-highlighter/dist/style.css";
import { Highlight, PdfHighlighter, PdfLoader } from "react-pdf-highlighter";
import { useContext, useEffect } from "react";
import { ReaderContext } from "@/context/ReaderContext";

const highlights = [
  {
    content: {
      text: "We consider a minimal subset of JavaScript that includes functions, mutable variables, primitivevalues and records",
    },
    position: {
      boundingRect: {
        x1: 75.578125,
        y1: 1039.3125,
        x2: 733.607421875,
        y2: 1079.234375,
        width: 809.9999999999999,
        height: 1200,
        pageNumber: 4,
      },
      rects: [
        {
          x1: 75.578125,
          y1: 1039.3125,
          x2: 733.607421875,
          y2: 1059.3125,
          width: 809.9999999999999,
          height: 1200,
          pageNumber: 4,
        },
        {
          x1: 75.953125,
          y1: 1059.234375,
          x2: 206.6217041015625,
          y2: 1079.234375,
          width: 809.9999999999999,
          height: 1200,
          pageNumber: 4,
        },
      ],
      pageNumber: 4,
    },
    comment: {
      text: "",
      emoji: "",
    },
    id: "32839601376722394",
  },
];

export default function Reader({ url }: { url: string }) {
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
          ) => {
            console.log(highlight.position.rects);
            return highlight.position.rects.map((rect, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "red",
                  position: "absolute",
                  ...rect,
                }}
              />
            ));
          }}
        />
      )}
    </PdfLoader>
  );
}
