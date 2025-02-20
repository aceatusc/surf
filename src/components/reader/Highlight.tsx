import { Fragment, MouseEvent, useCallback, useContext, useState } from "react";
import { HighlightContext } from "../../context/HighlightContext";
import { DocumentContext, TransformContext } from "../pdf";
import { TLocation, TSummaryData, ptypeConfig } from "../types";
import { Button } from "../ui/button";
import { getColor } from "../../context/ColorManager";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import Summary from "../ui/Summary";

export default function Highlight({
  data,
  summaries,
}: {
  data: TLocation[];
  summaries: TSummaryData;
}) {
  const { setHighlightedLocation, setHighlightedType } =
    useContext(HighlightContext);
  const { pageDimensions } = useContext(DocumentContext);
  const { scale } = useContext(TransformContext);

  const handleClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    const eleId = (e.target as HTMLElement).id;
    const [location, type] = eleId.split("$%^");
    setHighlightedLocation(location);
    setHighlightedType(type);
  }, []);

  return (
    <Fragment>
      {data.map(({ title, box, types, dimensions }, i) => {
        const [page, left, right, top] = box;
        const isLeft = dimensions.width / left > 2;
        const color = getColor(title);
        const pageScale = (scale * pageDimensions.width) / dimensions.width;

        return (
          <div
            id={`highlight_${title}`}
            className="absolute z-[21] flex flex-col"
            style={{
              left: isLeft ? (left - 24) * pageScale : (right + 4) * pageScale,
              top: top * pageScale,
            }}
            key={i}
          >
            {types?.map((type) => (
              <HoverCard key={type} openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <Button
                    key={type}
                    id={`${title}$%^${type}`}
                    onClick={handleClick}
                    className="rounded-full transition-all duration-100 opacity-60 hover:opacity-100"
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
                </HoverCardTrigger>
                {summaries[title]?.[type] ? (
                  <HoverCardContent
                    className="py-1 px-2 relative z-10 w-[24rem]"
                    side={isLeft ? "left" : "right"}
                  >
                    <Summary raw={summaries[title]?.[type]} />
                  </HoverCardContent>
                ) : null}
              </HoverCard>
            ))}
          </div>
        );
      })}
    </Fragment>
  );
}
