import Reader from "./components/reader/Reader";
import ContextProvider from "./context/ContextProvider";
import Panel from "./components/panel/Panel";
import ZoomControl from "./components/reader/ZoomControl";
import SamplePosts from "./assets/examples/sample_posts.json";
import SampleLocations from "./assets/examples/sample_quotes.json";
import { TPostData, TlocationData } from "./components/types";
// import Note from "./components/note/Note";

const postData = SamplePosts as TPostData;
const locationData = SampleLocations as TlocationData;

export default function App() {
  const rootPosts = new Set<string>();

  Object.values(locationData).forEach((page) => {
    page.forEach((loc) => {
      loc.posts.forEach((postId) => {
        rootPosts.add(postId);
        postData[postId].locations = postData[postId].locations || new Set();
        postData[postId].locations.add(loc.id);
      });
    });
  });

  return (
    <ContextProvider>
      {/* <Note /> */}
      <main className="w-[min(60%,calc(100%-42rem))] flex flex-row">
        <Reader data={locationData} />
        <ZoomControl />
      </main>
      <Panel data={postData} rootPosts={Array.from(rootPosts)} />
    </ContextProvider>
  );
}
