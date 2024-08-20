import {
  PercentFormatter,
  TransformContext,
  ZoomInButton,
  ZoomOutButton,
} from "@allenai/pdf-components";
import { useCallback, useContext } from "react";

import styles from "./ZoomControl.module.css";

export default function ZoomControl() {
  const { scale } = useContext(TransformContext);
  const renderLabel = useCallback(() => {
    return <div>{PercentFormatter.format(scale)}</div>;
  }, [scale]);

  return (
    <div className={styles.zc_container}>
      <ZoomOutButton />
      {renderLabel()}
      <ZoomInButton />
    </div>
  );
}
