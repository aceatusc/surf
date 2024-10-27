import { useEffect } from "react";
import { Sidebar, SidebarContent, useSidebar } from "../ui/sidebar";
import {
  deleteBrowserScript,
  loadBrowserScript,
} from "../pdf/src/utils/browserScripts";
import s from "./Note.module.css";
import { Button } from "../ui/button";

const HYPOTHESIS_CLIENT_SCRIPT_URL = "https://hypothes.is/embed.js";

export default function Note() {
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    // @ts-expect-error - Hypothesis is loaded in the global scope
    window.hypothesisConfig = () => ({
      externalContainerSelector: "#hypothesis-root",
      sideBySide: {
        mode: "manual",
        // isActive: () => true,
      },
    });
    loadBrowserScript(HYPOTHESIS_CLIENT_SCRIPT_URL);

    return () => {
      deleteBrowserScript(HYPOTHESIS_CLIENT_SCRIPT_URL);
      console.log("Destroying Hypothesis client");
      const annotatorLink = document.querySelector(
        'link[type="application/annotator+html"]'
      );
      if (annotatorLink) {
        // Dispatch a 'destroy' event which is handled by the code in
        // annotator/main.js to remove the client.
        const destroyEvent = new Event("destroy");
        annotatorLink.dispatchEvent(destroyEvent);
      }
    };
  }, []);

  return (
    <Sidebar variant="floating">
      <SidebarContent id="hypothesis-root" className={s.hypothesis_container} />
      <Button
        className="absolute -right-12 top-6 w-10 h-11 p-0 hover:bg-transparent ring-0"
        variant="ghost"
        onClick={toggleSidebar}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%" }}
        >
          <path fill="#fff" d="M3.886 3.945H21.03v16.047H3.886z"></path>
          <path
            d="M0 2.005C0 .898.897 0 2.005 0h19.99C23.102 0 24 .897 24 2.005v19.99A2.005 2.005 0 0 1 21.995 24H2.005A2.005 2.005 0 0 1 0 21.995V2.005ZM9 24l3 4 3-4H9ZM7.008 4H4v16h3.008v-4.997C7.008 12.005 8.168 12.01 9 12c1 .007 2.019.06 2.019 2.003V20h3.008v-6.891C14.027 10 12 9.003 10 9.003c-1.99 0-2 0-2.992 1.999V4ZM19 19.987c1.105 0 2-.893 2-1.994A1.997 1.997 0 0 0 19 16c-1.105 0-2 .892-2 1.993s.895 1.994 2 1.994Z"
            fill="#3f3f3f"
            fill-rule="evenodd"
          ></path>
        </svg>
      </Button>
    </Sidebar>
  );
}
