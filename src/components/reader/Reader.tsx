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
export default function Reader({ url }: { url: string }) {
  const { numPages } = useContext(DocumentContext);
  const { locations, summaries } = useContext(DataContext);
  const { sidebarOpen } = useContext(UIContext);

  return (
    <div
      className={`ml-auto [&>*]:overflow-x-auto [&>*]:overflow-y-hidden`}
      style={{
        direction: "rtl",
        maxWidth: sidebarOpen ? "calc(100% - 42rem)" : "100%",
        transition: "max-width 0.2s",
        paddingTop: "2.4rem",
      }}
    >
      <DocumentWrapper file={url} renderType={RENDER_TYPE.SINGLE_CANVAS}>
        {Array.from({ length: numPages }).map((_, i) => (
          <PageWrapper
            key={i}
            pageIndex={i}
            renderType={RENDER_TYPE.SINGLE_CANVAS}
          >
            <Overlay>
              {locations[i] && (
                <Highlight data={locations[i]} summaries={summaries} />
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
    </div>
  );
}
