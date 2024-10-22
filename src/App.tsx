import Reader from "./components/reader/Reader";
import Panel from "./components/panel/Panel";
import ZoomControl from "./components/reader/ZoomControl";
import SamplePosts from "./assets/examples/sample_posts.json";
import SampleLocations from "./assets/examples/sample_quotes.json";
import { TPostData, TlocationData } from "./components/types";
import { Fragment } from "react/jsx-runtime";
import { useContext } from "react";
import { DevContext } from "./context/DevContext";
// import Note from "./components/note/Note";

const postData = SamplePosts as TPostData;
const locationData = SampleLocations as TlocationData;
const ANNOTATION_MODE = false;

export default function App() {
  const { setAnnotationMode } = useContext(DevContext);
  setAnnotationMode(ANNOTATION_MODE);

  const rootPosts = new Set<string>();
  Object.values(locationData)
    .flat()
    .forEach((loc) => {
      loc.posts.forEach((post) => {
        postData[post].locations = postData[post].locations || new Set();
        postData[post].locations.add(loc.id);
        rootPosts.add(post);
      });
    });

  return (
    <Fragment>
      {/* <Note /> */}
      <main className="w-[min(60%,calc(100%-42rem))] flex flex-row">
        <Reader data={locationData} />
        <ZoomControl />
      </main>
      <Panel data={postData} rootPosts={Array.from(rootPosts)} />
    </Fragment>
  );
}
