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
    <div className="rounded-b-2xl flex flex-row mx-auto w-48 justify-around items-center bg-[#f3f3f3] opacity-95 shadow-xl backdrop-blur-3xl">
      <ZoomOutButton className="text-3xl w-10 h-10 rounded-full cursor-pointer -mt-1 text-zinc-700" />
      <span className="font-semibold text-sm">{renderLabel()}</span>
      <ZoomInButton className="text-2xl w-10 h-10 rounded-full cursor-pointer -mt-1 text-zinc-700" />
    </div>
  );
}
