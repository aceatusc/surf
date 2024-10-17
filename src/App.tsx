import Reader from "./components/reader/Reader";
import ContextProvider from "./context/ContextProvider";
import Panel from "./components/panel/Panel";
import ZoomControl from "./components/reader/ZoomControl";
import SamplePosts from "./assets/examples/sample_posts.json";
import SampleQuotes from "./assets/examples/sample_quotes.json";
import { TPostData, TQuote } from "./components/types";
// import Note from "./components/note/Note";

const postData = SamplePosts as TPostData;
const quoteData = SampleQuotes as TQuote[][];

export default function App() {
  return (
    <ContextProvider>
      {/* <Note /> */}
      <main className="w-[min(60%,calc(100%-42rem))] flex flex-row">
        <Reader data={quoteData} />
        <ZoomControl />
      </main>
      <Panel data={postData} />
    </ContextProvider>
  );
}
