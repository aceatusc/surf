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

export function AppLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-[92rem] mx-auto px-[8vw] py-20 lg:px-0">
        {/* Header */}
        <div className="text-center mb-16 border-b border-black pb-12">
          <h1 className="text-[4.5vw] leading-[5vw] lg:text-7xl font-light tracking-tight mb-12 text-black">
            Beyond the Page: Enriching{" "}
            <u className="decoration-dotted decoration-2 underline-offset-4">
              Academic Paper
            </u>{" "}
            Reading with{" "}
            <u className="decoration-dotted decoration-2 underline-offset-4">
              Social Media
            </u>{" "}
            Discussions
          </h1>
          <div className="text-2xl text-gray-800 mb-9 font-mono">
            <a href="https://huang.run" className="text-gray-800">
              Run Huang
            </a>{" "}
            · Anna Katherine Zhao · Zeinabsadat Saghi ·{" "}
            <a href="" className="text-gray-800">
              Sadra Sabouri
            </a>{" "}
            ·{" "}
            <a href="https://aceatusc.github.io" className="text-gray-800">
              Souti Chattopadhyay
            </a>
          </div>
          <div className="flex justify-center gap-6 mt-8">
            <a
              href="https://dl.acm.org/doi/10.1145/3746059.3747647"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 border-2 border-black text-black hover:bg-black hover:text-white transition-colors font-mono text-sm"
            >
              Paper
            </a>
            <a
              href="https://www.youtube.com/watch?v=phB5t6gshWA"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 border-2 border-black text-black hover:bg-black hover:text-white transition-colors font-mono text-sm"
            >
              Teaser
            </a>
            <a
              href="https://youtu.be/IvD3yzd0yio"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 border-2 border-black text-black hover:bg-black hover:text-white transition-colors font-mono text-sm"
            >
              Video
            </a>
          </div>
          <p className="mt-6 text-gray-600 font-mono">
            <b>UIST 2025</b>, ACM Symposium on User Interface Software and
            Technology
          </p>
        </div>

        <div className="mb-16 border-2 border-black">
          <div className="border-b-2 border-black bg-black text-white px-6 py-4">
            <h2 className="text-2xl font-light tracking-wide">ABSTRACT</h2>
          </div>
          <div className="px-6 py-4 leading-relaxed text-lg text-black font-light">
            <p>
              Researchers actively engage in informal discussions about academic
              papers on social media. They share insights, promote papers, and
              discuss emerging ideas in an engaging and accessible way. Yet,
              this rich source of scholarly discourse is often isolated from the
              paper reading process and remains underutilized.
            </p>

            <p className="py-4 italic">
              What if we bring these peer discussions on social media into the
              reading experience? <br />
              What might be the benefits of reading research papers alongside
              informal social insights?{" "}
            </p>

            <p>
              We introduce <b>SURF</b>, a novel reading interface that enriches
              academic papers with Social Understanding of Research Findings.{" "}
              <b>SURF</b> organizes social media clutter into digestible threads
              and presents them contextually within the paper, allowing readers
              to seamlessly access peer insights without disrupting their
              reading process.{" "}
            </p>

            <p className="py-2">
              In a within-subjects usability study (N=18), participants achieved
              significantly deeper comprehension and higher self-efficacy with{" "}
              <b>SURF</b>, while reporting lower cognitive load. They also noted{" "}
              <b>SURF</b>’s various benefits beyond paper reading, such as
              facilitating literature review and fostering social engagement
              within the academic community. Some participants envisioned{" "}
              <b>SURF</b> and academic social media as a potential supplement to
              the traditional peer‑review process.
            </p>
          </div>
        </div>

        {/* Example Papers Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-light tracking-wide text-center mb-4 text-black">
            Try the System
          </h2>
          <p className="text-center text-gray-600 mb-12 font-light">
            Select a paper below to experience the SURF reading interface
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((example) => (
            <div
              key={example.id}
              onClick={() => navigate(`/${example.id}`)}
              className="border-2 border-black hover:bg-black hover:text-white transition-all cursor-pointer group"
            >
              <div className="p-6">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 border border-black group-hover:border-white text-xs font-mono mb-4">
                    {example.conference}
                  </span>
                </div>
                <h3 className="text-lg font-light leading-tight mb-4">
                  {example.title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {example.subject?.map((sub, index) => (
                    <span key={sub} className="text-xs font-mono opacity-60">
                      {sub}
                      {index < example.subject.length - 1 && " | "}
                    </span>
                  ))}
                </div>
                <p className="text-sm font-light line-clamp-3 opacity-80">
                  {example.abstract}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* BibTeX Citation Section */}
        <div className="mt-20 border-2 border-black">
          <div className="border-b-2 border-black bg-black text-white px-6 py-4">
            <h2 className="text-2xl font-light tracking-wide">CITATION</h2>
          </div>
          <div className="px-6 py-8">
            <p className="text-base mb-4 text-black font-light">
              If you find our work useful, please consider citing:
            </p>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto border border-gray-300">
              <code>{`@inproceedings{10.1145/3746059.3747647,
author = {Huang, Run and Zhao, Anna Katherine and Saghi, Zeinabsadat and Sabouri, Sadra and Chattopadhyay, Souti},
title = {Beyond the Page: Enriching Academic Paper Reading with Social Media Discussions},
year = {2025},
publisher = {Association for Computing Machinery},
doi = {10.1145/3746059.3747647},
booktitle = {Proceedings of the 38th Annual ACM Symposium on User Interface Software and Technology},
series = {UIST '25}
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLanding />} />
        <Route path="/:id" element={<AppContent />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
