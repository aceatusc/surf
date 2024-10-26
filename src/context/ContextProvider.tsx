import { DevContext, useDevContextProps } from "./DevContext";
import { ReaderContext, useReaderContextProps } from "./ReaderContext";

export default function ContextProvider({
  children,
}: {
  children?: React.ReactElement | Array<React.ReactElement>;
}) {
  const devProps = useDevContextProps();
  const readerProps = useReaderContextProps();

  return (
    <DevContext.Provider value={devProps}>
      <ReaderContext.Provider value={readerProps}>
        {children}
      </ReaderContext.Provider>
    </DevContext.Provider>
  );
}
