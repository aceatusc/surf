import {
  ComponentType,
  Fragment,
  MouseEvent,
  useCallback,
  useContext,
} from "react";
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
import { getColorForGroup } from "../../context/ColorManager";

interface HighlightCompProps {
  pageIndex: number;
  groupData: HighlightProps;
  pageDimensions: Dimensions;
  rotation: PageRotation;
  scale: number;
  id: string;
}

interface HighlightHandlerProps {
  pageData: HighlightProps[];
  pageIndex: number;
}

const withHighlightHandlers = (
  WrappedComponent: ComponentType<HighlightCompProps>
) => {
  return ({ pageData, pageIndex }: HighlightHandlerProps) => {
    const { setHighlightedBlock } = useContext(HighlightContext);
    const { pageDimensions } = useContext(DocumentContext);
    const { rotation, scale } = useContext(TransformContext);

    const handleClick = useCallback((e: MouseEvent) => {
      e.stopPropagation();
      const groupId = (e.target as HTMLElement).id.split("_")[0].slice(1);
      setHighlightedBlock(parseInt(groupId));
    }, []);

    const handleMouseEnter = useCallback((e: MouseEvent) => {
      const groupId = (e.target as HTMLElement).id.split("_")[0].slice(1);
      const element = document.getElementById(`pgroup-${groupId}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, []);

    const getPageStyle = useCallback(() => {
      return computePageStyle(pageDimensions, rotation, scale);
    }, [pageDimensions, rotation, scale]);

    return (
      <div style={getPageStyle()}>
        {pageData.map((pg, i) => {
          return (
            <div key={i} onClick={handleClick} onMouseEnter={handleMouseEnter}>
              <WrappedComponent
                pageIndex={pageIndex}
                groupData={pg}
                pageDimensions={pageDimensions}
                rotation={rotation}
                scale={scale}
                id={`g${pg.pgroup}_p${pageIndex}_i${i}`}
              />
            </div>
          );
        })}
      </div>
    );
  };
};

function HighlightBarComp({
  groupData: { pgroup, bbox },
  pageDimensions,
  rotation,
  scale,
  id,
}: HighlightCompProps) {
  return (
    <div
      id={id}
      style={{
        backgroundColor: getColorForGroup(pgroup),
        borderRadius: 5,
        cursor: "pointer",
        position: "absolute",
        zIndex: 100,
        ...computeBoundingBoxStyle(
          { left: bbox[0], top: bbox[1], width: 9, height: bbox[2] },
          pageDimensions,
          rotation,
          scale
        ),
      }}
    />
  );
}

function HighlightTextComp({
  groupData: { pgroup, bbox },
  pageIndex,
  id,
  ...props
}: HighlightCompProps) {
  const [left, top, width, height] = bbox;
  const barBbox = [
    props.pageDimensions.width / left > 2 ? left - 13.8 : left + width + 5,
    top,
    height,
  ];
  return (
    <Fragment>
      <HighlightBarComp
        groupData={{ pgroup, bbox: barBbox }}
        {...props}
        id={`${id}_bar`}
        pageIndex={pageIndex}
      />
      <BoundingBox
        id={`${id}_text`}
        isHighlighted={true}
        page={pageIndex}
        top={top}
        left={left}
        height={height}
        width={width}
        color={getColorForGroup(pgroup)}
      />
    </Fragment>
  );
}

export const HighlightText = withHighlightHandlers(HighlightTextComp);
export const HighlightBar = withHighlightHandlers(HighlightBarComp);
