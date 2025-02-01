import { Fragment, MouseEvent, useCallback, useContext, useState } from "react";
import { HighlightContext } from "../../context/HighlightContext";
import { BoundingBox, DocumentContext, TransformContext } from "../pdf";
import { THighlight } from "../types";
import { Button } from "../ui/button";
import { getColor } from "../../context/ColorManager";
import { ptypeConfig } from "../post/src/twitter-theme/tweet-header";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function Highlight({ data }: { data: THighlight[] }) {
  const { setHighlightedLocation, setHighlightedType } =
    useContext(HighlightContext);
  const { pageDimensions } = useContext(DocumentContext);
  const { scale } = useContext(TransformContext);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback((e: MouseEvent) => {
    const eleId = (e.target as HTMLElement).id;
    const quoteId = eleId.split("_")[1];
    const type = eleId.split("_")[2];
    setHighlightedLocation(quoteId);
    setHighlightedType(type);
    setIsHovered(true);
  }, []);

  const handleMouseLeave = () => {
    if (isHovered) {
      setHighlightedLocation(null);
      setHighlightedType(null);
    }
  };

  return (
    <Fragment>
      {data.map(({ id, bbox, type, types }, i) => {
        const [page, left, top, width, height] = bbox;
        const isLeft = pageDimensions.width / left > 2;
        const newLeft = isLeft ? left - 32 : left + width + 8;
        const color = getColor(id);
        return (
          <Fragment key={i + page}>
            <div
              id={`highlight_${id}`}
              className="absolute z-[21] flex flex-col"
              style={{
                left: newLeft * scale,
                top: top * scale,
                maxHeight: height * scale,
              }}
            >
              {types?.map((type) => (
                <TooltipProvider key={type}>
                  <Tooltip delayDuration={120}>
                    <TooltipTrigger asChild>
                      <Button
                        key={type}
                        id={`highlight_${id}_${type}`}
                        onClick={handleClick}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className="rounded-full hover:scale-110 transition-transform duration-100"
                        style={{
                          backgroundColor: color,
                          width: `${20 * scale}px`,
                          height: `${20 * scale}px`,
                          fontSize: `${12 * scale}px`,
                          padding: `${12 * scale}px`,
                          marginBottom: `${6 * scale}px`,
                        }}
                      >
                        {ptypeConfig[type as keyof typeof ptypeConfig].icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      className="py-1 px-2 font-mono"
                      side={isLeft ? "left" : "right"}
                    >
                      {type}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            {type === "sentence" && (
              <BoundingBox
                id={`highlight_${id}_text`}
                isHighlighted={true}
                page={page}
                top={top}
                left={left}
                height={height}
                width={width}
                color={color}
              />
            )}
          </Fragment>
        );
      })}
    </Fragment>
  );
}
