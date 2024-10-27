import Reader from "./components/reader/Reader";
import ZoomControl from "./components/reader/ZoomControl";
import { TPostData, THighlightData } from "./components/types";
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
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import Social from "./components/social/Panel";
import Note from "./components/note/Note";

const examples = [
  {
    id: "arxiv:2401.13782",
    url: "https://arxiv.org/pdf/2401.13782",
    title: "Position: AI/ML Influencers Have a Place in the Academic Process",
    postData: "/2401.13782_posts.json",
    locationData: "/2401.13782_highlights.json",
    annotated: true,
  },
  {
    id: "arxiv:2409.14586",
    url: "https://arxiv.org/pdf/2409.14586",
    title: "[For Annotaters] Backtracking Improves Generation Safety",
    postData: "/2409.14586_posts.json",
    locationData: null,
    annotated: false,
  },
  {
    id: "arxiv:2309.17453",
    url: "https://arxiv.org/pdf/2309.17453",
    title:
      "[For Annotaters] Efficient Streaming Language Models with Attention Sinks",
    postData: "/2309.17453_posts.json",
    locationData: null,
    annotated: false,
  },
  {
    id: "arxiv:2310.06816",
    url: "https://arxiv.org/pdf/2310.06816",
    title: "[For Annotaters] Text Embeddings Reveal (Almost) As Much As Text",
    postData: "/2310.06816_posts.json",
    locationData: null,
    annotated: false,
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
    document.title = `${paper.title} - SURF Reader`;

    const fetchData = async () => {
      try {
        const [postRes, locationRes] = await Promise.all(
          [paper.postData, paper.locationData].map((url) =>
            url ? fetch(url).then((res) => res.json()) : Promise.resolve({})
          )
        );

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

  setAnnotationMode(!paper.annotated);

  const rootPosts = new Set<string>();
  if (paper.annotated) {
    Object.values(locationData)
      .flat()
      .forEach((loc) => {
        loc.posts.forEach((post) => {
          postData[post].locations = postData[post].locations || new Set();
          postData[post].locations.add(loc.id);
          rootPosts.add(post);
        });
      });
  } else {
    Object.values(postData).forEach((post) => {
      if (post.quoted_tweet || !post.in_reply_to_status_id_str) {
        rootPosts.add(post.id_str);
      }
    });
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
      style={
        {
          "--sidebar-width": "max(30rem, 16vw)",
          "--sidebar-width-mobile": "30rem",
        } as React.CSSProperties
      }
      defaultOpen={false}
    >
      <Note />
      <SidebarProvider>
        <SidebarInset className="h-[100vh] overflow-hidden relative">
          <Reader url={paper.url} highlightData={locationData} />
          <div className="absolute w-full z-50">
            <ZoomControl />
          </div>
        </SidebarInset>
        <Social data={postData} rootPosts={Array.from(rootPosts)} />
      </SidebarProvider>
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
