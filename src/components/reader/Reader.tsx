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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../ui/alert-dialog";
import {
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogTitle,
} from "../ui/alert-dialog";

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
  const [warning, setWarning] = useState(false);

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
      if (window.innerWidth < 768) {
        setWarning(true);
      } else {
        setWarning(false);
        setScale(
          Math.floor(
            (Math.min(window.innerWidth - 420, 0.7 * window.innerWidth) /
              pageDimensions.width) *
              10
          ) / 10
        );
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pageDimensions]);

  console.log(warning);

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
      {warning && (
        <AlertDialog open={warning} onOpenChange={setWarning}>
          <AlertDialogContent className="select-none">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl">
                Incompatible Screen Resolution
              </AlertDialogTitle>
              <AlertDialogDescription className="text-md">
                This app requires a screen width of at least 768px to function
                properly. Some features may not be available on smaller screens,
                but you can still view the PDF.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>I Understand</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
