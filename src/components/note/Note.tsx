import { useEffect } from "react";
import { loadBrowserScript } from "../pdf/src/utils/browserScripts";

async function addHypothesis() {
  window.hypothesisConfig = function () {
    return {
      externalContainerSelector: "#hypothesis_root",
    };
  };
  await loadBrowserScript("https://hypothes.is/embed.js");
}

export default function Note() {
  useEffect(() => {
    addHypothesis();
  }, []);

  return (
    <div className="fixed left-0 top-0 h-full z-50">
      <div id="hypothesis_root" className="h-full" />
    </div>
  );
}
