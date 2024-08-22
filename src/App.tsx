import Reader from "./components/reader/Reader";
import ContextProvider from "./context/ContextProvider";
import styles from "./App.module.css";
import Panel from "./components/panel/Panel";
import ZoomControl from "./components/reader/ZoomControl";
import HideScroll from "./components/ui/HideScroll";
import SampleData from "./assets/examples/sample1.json";
import { DataType } from "./components/types";

const data: DataType = SampleData;

export default function App() {
  return (
    <ContextProvider>
      <HideScroll className={styles.main_container}>
        <div className={styles.reader_container}>
          <Reader data={data} />
          <ZoomControl />
        </div>
      </HideScroll>
      <Panel data={data} />
    </ContextProvider>
  );
}
