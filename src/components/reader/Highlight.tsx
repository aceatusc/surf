import { MouseEvent, useCallback, useContext, useState } from "react";
import { Position } from "react-pdf-highlighter";
import { getColorForGroup } from "@/context/ColorManager";
import { ReaderContext } from "@/context/ReaderContext";

export default function Highlight({
  position,
  id,
}: {
  position: Position;
  id: string;
}) {
  const { rects } = position;
  const color = getColorForGroup(id);
  const { setSelectedHighlight, selectedHighlight } = useContext(ReaderContext);

  const handleMouseEnter = (e: MouseEvent) => {
    const quoteId = (e.target as HTMLElement).id.split(";")[0].split("_")[1];
    setSelectedHighlight(quoteId);
  };

  const handleMouseLeave = () => {
    setSelectedHighlight(null);
  };

  console.log(selectedHighlight);

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {rects.map((rect, i) => {
        return (
          <div
            key={i}
            id={`highlight_${id};part_${i}`}
            className="transform transition-transform duration-200 hover:scale-x-[1.2] rounded-lg absolute z-[21] cursor-pointer"
            style={{
              backgroundColor: color,
              left:
                rect.left > rect.width
                  ? rect.left + rect.width + 4
                  : rect.left - 12,
              top: rect.top,
              width: 8,
              height: rect.height,
            }}
          />
        );
      })}
    </div>
  );
}
