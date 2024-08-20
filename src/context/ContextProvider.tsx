import { ContextProvider as BaseContextProvider } from "@allenai/pdf-components";
import { HighlightContext, useHighlightContextProps } from "./HighlightContext";

export default function ContextProvider({
  children,
}: {
  children?: React.ReactElement | Array<React.ReactElement>;
}) {
  const highlightProps = useHighlightContextProps();
  return (
    <BaseContextProvider>
      <HighlightContext.Provider value={highlightProps}>
        {children}
      </HighlightContext.Provider>
    </BaseContextProvider>
  );
}
