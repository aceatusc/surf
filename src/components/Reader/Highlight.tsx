import { ComponentType, MouseEvent, useCallback, useContext } from "react";
import { HighlightContext } from "../../context/HighlightContext";
import {
  BoundingBox,
  computeBoundingBoxStyle,
  computePageStyle,
  Dimensions,
  DocumentContext,
  PageRotation,
  TransformContext,
} from "../PdfRender";
import { HighlightProps } from "./Reader";

interface HighlightHandlersProps {
  handleClick: (e: React.MouseEvent, groupId: number) => void;
  handleMouseEnter: (groupId: number) => void;
  getPageStyle: () => React.CSSProperties;
  pageDimensions: Dimensions;
  rotation: PageRotation;
  scale: number;
}

interface HighlightCompProps {
  pageData: HighlightProps[];
  pageIndex: number;
}

const withHighlightHandlers = (
  WrappedComponent: ComponentType<HighlightCompProps & HighlightHandlersProps>
) => {
  return (props: HighlightCompProps) => {
    const { setHighlightedBlock } = useContext(HighlightContext);
    const { pageDimensions } = useContext(DocumentContext);
    const { rotation, scale } = useContext(TransformContext);

    const handleClick = useCallback((e: MouseEvent, groupId: number) => {
      e.stopPropagation();
      setHighlightedBlock(groupId);
    }, []);

    const handleMouseEnter = useCallback((groupId: number) => {
      const element = document.getElementById(`pgroup-${groupId}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, []);

    const getPageStyle = useCallback(() => {
      return computePageStyle(pageDimensions, rotation, scale);
    }, [pageDimensions, rotation, scale]);

    return (
      <WrappedComponent
        {...props}
        handleClick={handleClick}
        handleMouseEnter={handleMouseEnter}
        getPageStyle={getPageStyle}
        pageDimensions={pageDimensions}
        rotation={rotation}
        scale={scale}
      />
    );
  };
};

function HighlightTextComp({
  pageData,
  pageIndex,
  handleClick,
  handleMouseEnter,
  getPageStyle,
}: HighlightCompProps & HighlightHandlersProps) {
  return (
    <div style={getPageStyle()}>
      {pageData.map(({ bbox, pgroup, color }, i) => {
        const [left, top, width, height] = bbox;
        return (
          <div
            key={`highlight-text-group-${pgroup}-${i}`}
            onMouseEnter={() => handleMouseEnter(pgroup)}
            onClick={(e: MouseEvent) => handleClick(e, pgroup)}
          >
            <BoundingBox
              key={i}
              isHighlighted={true}
              page={pageIndex}
              top={top}
              left={left}
              height={height}
              width={width}
              color={color}
            />
          </div>
        );
      })}
    </div>
  );
}

function HighlightBarComp({
  pageData,
  handleClick,
  handleMouseEnter,
  getPageStyle,
  pageDimensions,
  rotation,
  scale,
}: HighlightCompProps & HighlightHandlersProps) {
  return (
    <div style={getPageStyle()}>
      {pageData.map(({ bbox, pgroup, color }, i) => (
        <div
          key={`highlight-bar-group-${pgroup}-${i}`}
          style={{
            backgroundColor: color,
            borderRadius: 5,
            cursor: "pointer",
            position: "absolute",
            zIndex: 100,
            ...computeBoundingBoxStyle(
              { left: bbox[0], top: bbox[1], width: 10, height: bbox[2] },
              pageDimensions,
              rotation,
              scale
            ),
          }}
          onMouseEnter={() => handleMouseEnter(pgroup)}
          onClick={(e: React.MouseEvent) => handleClick(e, pgroup)}
        />
      ))}
    </div>
  );
}

export const HighlightText = withHighlightHandlers(HighlightTextComp);
export const HighlightBar = withHighlightHandlers(HighlightBarComp);
