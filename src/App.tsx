import Reader from "./components/reader/Reader";
import { useContext, useEffect, useState } from "react";
import { DevContext } from "./context/DevContext";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
  Navigate,
  useLocation,
} from "react-router-dom";
import { SidebarProvider } from "./components/ui/sidebar";
import Social from "./components/social/Panel";
import Note from "./components/note/Note";
import { DataContext } from "./context/DataContext";

const examples = [
  {
    id: "arxiv:2303.15343",
    url: "https://arxiv.org/pdf/2303.15343",
    title: "Sigmoid Loss for Language Image Pre-Training",
    data: "/2303.15343.json",
  },
  {
    id: "arxiv:2401.13782",
    url: "https://arxiv.org/pdf/2401.13782",
    title: "Position: AI/ML Influencers Have a Place in the Academic Process",
    data: "/2401.13782.json",
  },
  {
    id: "arxiv:2401.01335",
    url: "https://arxiv.org/pdf/2401.01335",
    title:
      "Self-Play Fine-Tuning Converts Weak Language Models to Strong Language Models",
    data: "/2401.01335.json",
  },
  // {
  //   id: "arxiv:2309.17453",
  //   url: "https://arxiv.org/pdf/2309.17453",
  //   title: "Efficient Streaming Language Models with Attention Sinks",
  //   postData: "/2309.17453_posts.json",
  //   locationData: "/2309.17453_highlights.json",
  // },
  // {
  //   id: "arxiv:2310.06816",
  //   url: "https://arxiv.org/pdf/2310.06816",
  //   title: "Text Embeddings Reveal (Almost) As Much As Text",
  //   postData: "/2310.06816_posts.json",
  //   locationData: "/2310.06816_highlights.json",
  // },
  // {
  //   id: "arxiv:2306.04634",
  //   url: "https://arxiv.org/pdf/2306.04634",
  //   title: "[NLP] On the Reliability of Watermarks for Large Language Models",
  //   postData: "/2306.04634_posts.json",
  //   locationData: null,
  //   annotated: false,
  // },
  // {
  //   id: "arxiv:2303.15343",
  //   url: "https://arxiv.org/pdf/2303.15343",
  //   title: "Sigmoid Loss for Language Image Pre-Training",
  //   postData: "/2303.15343_posts.json",
  //   locationData: "/2303.15343_highlights.json",
  //   phase: "formative",
  // },
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
            {example.title}{" "}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AppContent() {
  const { id } = useParams();
  const paper = examples.find((example) => example.id === id);
  const { setPosts, setLocations, setSummaries, setContext } =
    useContext(DataContext);
  const [loading, setLoading] = useState(true);
  const { setStudyPhase } = useContext(DevContext);

  const urlLocation = useLocation();
  const studyPhase = urlLocation.hash?.slice(1) || "formative";

  useEffect(() => {
    setStudyPhase(studyPhase);
  }, [studyPhase]);

  useEffect(() => {
    if (!paper) return;
    document.title = `${paper.title} - SURF Reader`;

    const fetchData = async () => {
      try {
        const { posts, locations, summaries, context } = await fetch(
          paper.data
        ).then((res) => res.json());
        setPosts(posts);
        setLocations(locations);
        setSummaries(summaries);
        setContext(context);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <SidebarProvider
      className="flex flex-row"
      style={
        {
          "--sidebar-width": "max(30rem, 16vw)",
          "--sidebar-width-mobile": "30rem",
        } as React.CSSProperties
      }
      defaultOpen={false}
    >
      <Note />
      <Reader url={paper.url} />
      <Social />
    </SidebarProvider>
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
