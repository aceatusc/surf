import Reader from "./components/reader/Reader";
import ContextProvider from "./context/ContextProvider";
import styles from "./App.module.css";
import Panel from "./components/panel/Panel";
import ZoomControl from "./components/reader/ZoomControl";
import SamplePosts from "./assets/examples/sample_posts.json";
import SampleQuotes from "./assets/examples/sample_quotes.json";
import { TPost, TQuote } from "./components/types";

const postData = SamplePosts as TPost[];
const quoteData = SampleQuotes as TQuote[][];

export default function App() {
  return (
    <ContextProvider>
      <main className={styles.main_container}>
        <Reader data={quoteData} />
        <ZoomControl />
      </main>
      <Panel data={postData} />
    </ContextProvider>
  );
}
