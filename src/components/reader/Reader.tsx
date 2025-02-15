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
export default function Reader({ url }: { url: string }) {
  const { numPages } = useContext(DocumentContext);
  const { locations } = useContext(DataContext);

  return (
    <div
      className={`ml-auto [&>*]:overflow-x-auto [&>*]:overflow-y-hidden`}
      style={{ direction: "rtl", maxWidth: "calc(100% - 42rem)" }}
    >
      <DocumentWrapper file={url} renderType={RENDER_TYPE.MULTI_CANVAS}>
        {Array.from({ length: numPages }).map((_, i) => (
          <PageWrapper
            key={i}
            pageIndex={i}
            renderType={RENDER_TYPE.MULTI_CANVAS}
          >
            <Overlay>
              {locations[i] && <Highlight data={locations[i]} />}
            </Overlay>
          </PageWrapper>
        ))}
      </DocumentWrapper>
    </div>
  );
}
