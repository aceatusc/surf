import Reader from "./components/reader/Reader";
import Panel from "./components/panel/Panel";
import ZoomControl from "./components/reader/ZoomControl";
import { TPostData, THighlightData } from "./components/types";
import { Fragment } from "react/jsx-runtime";
import { useContext, useEffect, useState } from "react";
import { DevContext } from "./context/DevContext";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";

const ANNOTATION_MODE = false;

const examples = [
  {
    id: "arxiv:2401.13782",
    url: "https://arxiv.org/pdf/2401.13782",
    title: "Position: AI/ML Influencers Have a Place in the Academic Process",
    postData: "/2401.13782_posts.json",
    locationData: "/2401.13782_highlights.json",
  },
];

function SelectExample() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Select a Sample Paper</h1>
      <ul className="space-y-2">
        {examples.map((example) => (
          <li
            key={example.id}
            className="cursor-pointer hover:underline text-blue-500"
            onClick={() => navigate(`/${example.id}`)}
          >
            {example.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AppContent() {
  const { id } = useParams();
  const paper = examples.find((example) => example.id === id);
  const [postData, setPostData] = useState<TPostData>({});
  const [locationData, setLocationData] = useState<THighlightData>({});
  const [loading, setLoading] = useState(true);
  const { setAnnotationMode } = useContext(DevContext);

  useEffect(() => {
    if (!paper) return;
    const fetchData = async () => {
      try {
        const [postRes, locationRes] = await Promise.all([
          fetch(paper.postData).then((res) => res.json()),
          fetch(paper.locationData).then((res) => res.json()),
        ]);

        setPostData(postRes as TPostData);
        setLocationData(locationRes as THighlightData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [paper]);

  if (!paper) {
    return <Navigate to="/" replace />;
  }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Fragment>
      {/* <Note /> */}
      <main className="w-[min(60%,calc(100%-42rem))] flex flex-row">
        <Reader pdfUrl={paper.url} highlightData={locationData} />
        <ZoomControl />
      </main>
      <Panel data={postData} rootPosts={Array.from(rootPosts)} />
    </Fragment>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SelectExample />} />
        <Route path="/:id" element={<AppContent />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
