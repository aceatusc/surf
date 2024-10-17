import { Fragment, MouseEvent, useCallback, useContext, useState } from "react";
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
  const { setHighlightedLocation } = useContext(HighlightContext);
  const { pageDimensions } = useContext(DocumentContext);
  const { rotation, scale } = useContext(TransformContext);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback((e: MouseEvent) => {
    const quoteId = (e.target as HTMLElement).id.split("_")[1];
    setHighlightedLocation(parseInt(quoteId));
    setIsHovered(true);
  }, []);

  const handleMouseLeave = () => {
    if (isHovered) {
      setHighlightedLocation(null);
    }
  };

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
          <div
            key={i}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              id={`highlight_${qid}`}
              className="transform transition-transform duration-200 hover:scale-y-[1.1] rounded-lg absolute z-[21] cursor-pointer"
              style={{
                backgroundColor: color,
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
