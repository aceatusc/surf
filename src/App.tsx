import Reader from "./components/reader/Reader";
import ContextProvider from "./context/ContextProvider";
import styles from "./App.module.css";
import Panel from "./components/panel/Panel";
import ZoomControl from "./components/reader/ZoomControl";
import SampleData from "./assets/examples/sample1.json";
import { DataType } from "./components/types";

const data: DataType = SampleData;

export default function App() {
  return (
    <ContextProvider>
      <main className={styles.main_container}>
        <Reader data={data} />
        <ZoomControl />
      </main>
      <Panel data={data} />
    </ContextProvider>
  );
}
