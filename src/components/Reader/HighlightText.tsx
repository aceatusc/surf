import { Fragment } from "react/jsx-runtime";
import { HighlightProps } from "./Reader";
import { BoundingBox } from "@allenai/pdf-components";
import { useContext } from "react";
import { HighlightContext } from "../../context/HighlightContext";

type HighlightTextProps = {
  pageData: HighlightProps[];
  pageIndex: number;
};

export default function HighlightText({
  pageData,
  pageIndex,
}: HighlightTextProps) {
  const { setHighlightedBlock } = useContext(HighlightContext);
  return (
    <Fragment>
      {pageData.map(({ bbox, pgroup }, i) => {
        const [top, left, height, width] = bbox;
        return (
          <div
            onMouseEnter={() => setHighlightedBlock(pgroup)}
            onMouseLeave={() => setHighlightedBlock(null)}
          >
            <BoundingBox
              key={i}
              isHighlighted={true}
              page={pageIndex}
              top={top}
              left={left}
              height={height}
              width={width}
            />
          </div>
        );
      })}
    </Fragment>
  );
}
