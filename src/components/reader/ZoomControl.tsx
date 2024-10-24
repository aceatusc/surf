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
    <div className="fixed z-40 right-24 top-0 px-3 w-48 flex flex-row items-center py-0 rounded-b-3xl bg-stone-200 justify-between">
      <ZoomOutButton className="text-4xl w-12 h-12 rounded-full cursor-pointer" />
      {renderLabel()}
      <ZoomInButton className="text-3xl w-12 h-12 rounded-full cursor-pointer" />
    </div>
  );
}
