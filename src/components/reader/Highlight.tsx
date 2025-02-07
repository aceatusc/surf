import { Fragment, MouseEvent, useCallback, useContext, useState } from "react";
import { HighlightContext } from "../../context/HighlightContext";
import { DocumentContext, TransformContext } from "../pdf";
import { TLocation } from "../types";
import { Button } from "../ui/button";
import { getColor } from "../../context/ColorManager";
import { ptypeConfig } from "../post/src/twitter-theme/tweet-header";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function Highlight({ data }: { data: TLocation[] }) {
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
      {data.map(({ title, box, types, dimensions }, i) => {
        const [page, left, top, width, height] = box;
        const isLeft = dimensions.width / left > 2;
        const newLeft = isLeft ? left - 24 : left + width + 8;
        const color = getColor(title);
        const pageScale = (scale * pageDimensions.width) / dimensions.width;
        return (
          <div
            id={`highlight_${title}`}
            className="absolute z-[21] flex flex-col"
            style={{
              left: newLeft * pageScale,
              top: (top - 4) * pageScale,
              maxHeight: height * pageScale,
            }}
            key={i}
          >
            {types?.map((type) => (
              <TooltipProvider key={type}>
                <Tooltip delayDuration={120}>
                  <TooltipTrigger asChild>
                    <Button
                      key={type}
                      id={`highlight_${title}_${type}`}
                      onClick={handleClick}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      className="rounded-full hover:scale-110 transition-transform duration-100"
                      style={{
                        backgroundColor: color,
                        width: `${20 * scale}px`,
                        height: `${20 * scale}px`,
                        fontSize: `${13 * scale}px`,
                        padding: `${12 * scale}px`,
                        marginBottom: `${5 * scale}px`,
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
        );
      })}
    </Fragment>
  );
}
