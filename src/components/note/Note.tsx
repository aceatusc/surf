import { useEffect } from "react";
import { Sidebar, SidebarContent, SidebarHeader } from "../ui/sidebar";
import { loadBrowserScript } from "../pdf/src/utils/browserScripts";

export default function Note() {
  useEffect(() => {
    loadBrowserScript("https://hypothes.is/embed.js");
    window.hypothesisConfig = function () {
      return {
        externalContainerSelector: "#note-content",
      };
    };
  });

  return (
    <Sidebar>
      <SidebarHeader>hello</SidebarHeader>
      <SidebarContent id="note-content" />
    </Sidebar>
  );
}
