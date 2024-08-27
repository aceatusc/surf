import { Fragment, MouseEvent, useCallback, useContext } from "react";
import { HighlightContext } from "../../context/HighlightContext";
import {
  computeBoundingBoxStyle,
  // computePageStyle,
  DocumentContext,
  TransformContext,
  BoundingBox,
} from "../pdf";
import { getColorForGroup } from "../../context/ColorManager";
import { HighlightProps } from "../types/reader";

export default function Highlight({ pageData, pageIndex }: HighlightProps) {
  const { setHighlightedBlock } = useContext(HighlightContext);
  const { pageDimensions } = useContext(DocumentContext);
  const { rotation, scale } = useContext(TransformContext);

  const handleClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    const quoteId = (e.target as HTMLElement).id.split("_")[1];
    setHighlightedBlock(parseInt(quoteId));
  }, []);

  const handleMouseEnter = useCallback((e: MouseEvent) => {
    const quoteId = (e.target as HTMLElement).id.split("_")[1];
    const element = document.getElementById(`quote-${quoteId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  // const getPageStyle = useCallback(() => {
  //   return computePageStyle(pageDimensions, rotation, scale);
  // }, [pageDimensions, rotation, scale]);

  return (
    <Fragment>
      {pageData.map(({ qid, bbox, qtype }, i) => {
        const [left, top, width, height] = bbox;
        const newLeft =
          pageDimensions.width / left > 2 ? left - 14.4 : left + width + 6;
        const color = getColorForGroup(qid);
        return (
          <div key={i} onClick={handleClick} onMouseEnter={handleMouseEnter}>
            <div
              id={`highlight_${qid}`}
              style={{
                backgroundColor: color,
                borderRadius: 5,
                cursor: "pointer",
                position: "absolute",
                zIndex: 100,
                ...computeBoundingBoxStyle(
                  { left: newLeft, top, width: 9, height },
                  pageDimensions,
                  rotation,
                  scale
                ),
              }}
            />
            {qtype === "text" && (
              <BoundingBox
                id={`highlight_${qid}_text`}
                isHighlighted={true}
                page={pageIndex}
                top={top}
                left={left}
                height={height}
                width={width}
                color={color}
              />
            )}
          </div>
        );
      })}
    </Fragment>
  );
}
