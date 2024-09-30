import {
  PercentFormatter,
  TransformContext,
  ZoomInButton,
  ZoomOutButton,
} from "../pdf";
import { useCallback, useContext } from "react";

export default function ZoomControl() {
  const { scale } = useContext(TransformContext);
  const renderLabel = useCallback(() => {
    return <div>{PercentFormatter.format(scale)}</div>;
  }, [scale]);

  return (
    <div className="fixed left-6 bottom-3 flex flex-col text-lg items-center z-50 bg-opacity-85 backdrop-blur-3xl rounded-full">
      <ZoomOutButton className="text-2xl hover:bg-zinc-200 w-12 h-12 rounded-full cursor-pointer m-1 mb-2" />
      {renderLabel()}
      <ZoomInButton className="text-xl hover:bg-zinc-200 w-12 h-12 rounded-full cursor-pointer m-1 mt-2" />
    </div>
  );
}
