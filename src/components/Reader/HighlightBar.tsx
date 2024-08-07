import { useCallback, useContext } from "react";
import { HighlightProps } from "./Reader";
import { HighlightContext } from "../../context/HighlightContext";
import {
  computeBoundingBoxStyle,
  computePageStyle,
  DocumentContext,
  TransformContext,
} from "@allenai/pdf-components";

type HighlightBarProps = {
  pageData: HighlightProps[];
};

export default function HighlightBarOverlay({ pageData }: HighlightBarProps) {
  const { setHighlightedBlock } = useContext(HighlightContext);
  const { pageDimensions } = useContext(DocumentContext);
  const { rotation, scale } = useContext(TransformContext);

  const getPageStyle = useCallback(() => {
    return computePageStyle(pageDimensions, rotation, scale);
  }, [pageDimensions, rotation, scale]);

  return (
    <div style={getPageStyle()}>
      {pageData.map(({ bbox, pgroup, color }) => (
        <div
          key={`highlight-bar-group-${pgroup}`}
          style={{
            backgroundColor: color,
            borderRadius: 5,
            cursor: "pointer",
            position: "absolute",
            zIndex: 100,
            ...computeBoundingBoxStyle(
              { top: bbox[0], left: bbox[1], width: 10, height: bbox[2] },
              pageDimensions,
              rotation,
              scale
            ),
          }}
          onMouseEnter={() => setHighlightedBlock(pgroup)}
          onMouseLeave={() => setHighlightedBlock(null)}
        />
      ))}
    </div>
  );
}
