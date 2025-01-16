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
  useLocation,
} from "react-router-dom";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import Social from "./components/social/Panel";
import Note from "./components/note/Note";
import { Badge } from "./components/ui/badge";

const examples = [
  {
    id: "arxiv:2401.13782",
    url: "https://arxiv.org/pdf/2401.13782",
    title: "Position: AI/ML Influencers Have a Place in the Academic Process",
    postData: "/2401.13782_posts.json",
    locationData: "/2401.13782_highlights.json",
  },
  {
    id: "arxiv:2309.17453",
    url: "https://arxiv.org/pdf/2309.17453",
    title: "Efficient Streaming Language Models with Attention Sinks",
    postData: "/2309.17453_posts.json",
    locationData: "/2309.17453_highlights.json",
  },
  {
    id: "arxiv:2310.06816",
    url: "https://arxiv.org/pdf/2310.06816",
    title: "Text Embeddings Reveal (Almost) As Much As Text",
    postData: "/2310.06816_posts.json",
    locationData: "/2310.06816_highlights.json",
  },
  // {
  //   id: "arxiv:2306.04634",
  //   url: "https://arxiv.org/pdf/2306.04634",
  //   title: "[NLP] On the Reliability of Watermarks for Large Language Models",
  //   postData: "/2306.04634_posts.json",
  //   locationData: null,
  //   annotated: false,
  // },
  {
    id: "arxiv:2303.15343",
    url: "https://arxiv.org/pdf/2303.15343",
    title: "Sigmoid Loss for Language Image Pre-Training",
    postData: "/2303.15343_posts.json",
    locationData: "/2303.15343_highlights.json",
    phase: "formative",
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
            {!example.locationData && (
              <Badge className="px-1 py-0.5 mr-1.5">For Annotators</Badge>
            )}
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
  const [postData, setPostData] = useState<TPostData>({});
  const [locationData, setLocationData] = useState<THighlightData>({});
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

  const rootPosts = new Set<string>();
  if (studyPhase === "probe1") {
    if (paper.id === "arxiv:2309.17453") {
      [
        "1708947543890317413",
        "1708950271064449273",
        "1708950466514854372",
        "1708953190291632432",
        "1708954711930650866",
        "1708973460612125021",
      ].forEach((id) => {
        if (!postData[id]) return;
        rootPosts.add(id);
        postData[id].quoted_status_id_str =
          postData[id].in_reply_to_status_id_str;
      });
    }
  }
  // if (paper.id === "arxiv:2310.06816") {
  //   [
  //     "1712559476157648999",
  //     "1712559478946566190",
  //     "1712559480779792870",
  //     "1712596420187074888",
  //   ].forEach((id) => {
  //     if (!postData[id]) return;
  //     rootPosts.add(id);
  //     postData[id].quoted_status_id_str =
  //       postData[id].in_reply_to_status_id_str;
  //   });
  // }
  if (paper.locationData) {
    Object.values(locationData)
      .flat()
      .forEach((loc) => {
        loc.posts.forEach((post) => {
          if (
            postData[post].in_reply_to_status_id_str &&
            studyPhase !== "usability"
          ) {
            return;
          }
          postData[post].locations = postData[post].locations || new Set();
          postData[post].locations.add(loc.id);
          rootPosts.add(post);
        });
      });
  }
  Object.values(postData).forEach((post) => {
    if (post.quoted_tweet || !post.in_reply_to_status_id_str) {
      rootPosts.add(post.id_str);
    }
  });

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
          <Reader
            url={paper.url}
            rootPosts={Array.from(rootPosts)}
            highlightData={locationData}
          />
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
