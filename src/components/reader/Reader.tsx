import {
  DocumentContext,
  DocumentWrapper,
  Overlay,
  PageWrapper,
  RENDER_TYPE,
} from "../pdf";
import { useContext } from "react";
import Highlight from "./Highlight";
import { DataContext } from "@/context/DataContext";
import { UIContext } from "@/context/UIContext";
import ZoomControl from "./ZoomControl";
import { ScrollArea } from "../ui/scroll-area";
export default function Reader({ url }: { url: string }) {
  const { numPages } = useContext(DocumentContext);
  const { locations, summaries, quality } = useContext(DataContext);
  const { sidebarOpen } = useContext(UIContext);

  return (
    <ScrollArea
      className={`ml-auto overscroll-contain`}
      style={{
        maxWidth: sidebarOpen ? "calc(100% - 42rem)" : "100%",
        transition: "max-width 0.2s",
        paddingTop: "2.4rem",
        height: "100vh",
      }}
    >
      <DocumentWrapper file={url} renderType={RENDER_TYPE.MULTI_CANVAS}>
        {Array.from({ length: numPages }).map((_, i) => (
          <PageWrapper
            key={i}
            pageIndex={i}
            renderType={RENDER_TYPE.MULTI_CANVAS}
          >
            <Overlay>
              {locations[i] && (
                <Highlight
                  data={locations[i]}
                  summaries={summaries}
                  quality={quality}
                />
              )}
            </Overlay>
          </PageWrapper>
        ))}
      </DocumentWrapper>
      <div
        className="fixed top-2 z-20 overflow-visible shadow-md rounded-xl"
        style={{
          left: sidebarOpen
            ? "calc(calc(100% - 53rem) / 2)"
            : "calc(50% - 5rem)",
          transition: "left 0.2s",
        }}
      >
        <ZoomControl />
      </div>
    </ScrollArea>
  );
}
