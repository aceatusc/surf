import { ContextProvider as BaseContextProvider } from "../components/pdf";
import { DataContext, useDataContextProps } from "./DataContext";
import { DevContext, useDevContextProps } from "./DevContext";
import { HighlightContext, useHighlightContextProps } from "./HighlightContext";

export default function ContextProvider({
  children,
}: {
  children?: React.ReactElement | Array<React.ReactElement>;
}) {
  const highlightProps = useHighlightContextProps();
  const devProps = useDevContextProps();
  return (
    <BaseContextProvider>
      <DevContext.Provider value={devProps}>
        <HighlightContext.Provider value={highlightProps}>
          <DataContext.Provider value={useDataContextProps()}>
            {children}
          </DataContext.Provider>
        </HighlightContext.Provider>
      </DevContext.Provider>
    </BaseContextProvider>
  );
}
