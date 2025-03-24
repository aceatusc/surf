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
import examples from "./paper_data.json";
import { Card, CardContent, CardHeader } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";

function SelectExample() {
  const navigate = useNavigate();
  const [isControl, setIsControl] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6 mt-12">Select a Sample Paper</h1>
      <div className="flex-col space-x-4 items-center">
        <Switch
          id="condition"
          onClick={() => setIsControl(!isControl)}
          checked={!isControl}
        />
        <Label htmlFor="condition" className="text-lg font-mono">
          {isControl ? "Control" : "Treatment"}
        </Label>
      </div>

      <div className="grid grid-cols-3 gap-4 p-6">
        {examples.map((example) => (
          <Card
            key={example.id}
            onClick={() => {
              if (isControl) {
                window.open(`${example.url}`, "_blank");
              } else {
                navigate(`/${example.id}`);
              }
            }}
            className="hover:bg-slate-100 cursor-pointer"
          >
            <CardHeader className="text-2xl">
              <Badge className="inline w-fit bg-slate-300 text-slate-900 text-xl rounded-full">
                {example.conference}
              </Badge>
              <span>{example.title}</span>
            </CardHeader>
            <CardContent>
              <div className="space-x-4">
                {example.subject?.map((sub) => (
                  <Badge key={sub} className="text-xl">
                    {sub}
                  </Badge>
                ))}
              </div>
              <div className="mt-3 text-lg">{example.abstract}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AppContent() {
  const { id } = useParams();
  const paper = examples.find((example) => example.id === id);
  const {
    setPosts,
    setLocations,
    setSummaries,
    setContext,
    setQuality,
    setTitles,
  } = useContext(DataContext);
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
        const { posts, locations, summaries, context, quality, titles } =
          await fetch(paper.data).then((res) => res.json());
        setPosts(posts);
        setLocations(locations);
        setSummaries(summaries);
        setContext(context);
        setQuality(quality);
        setTitles(titles);
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
      className="flex flex-row overflow-hidden"
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
