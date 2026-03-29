import { useState, useEffect } from "react";
import { MapEditor } from "./editor";
import { MapViewer } from "./viewer";
import { sampleMap } from "./sample-data/sample-map";
import type { FloorPlanData } from "./types";

type Route = "editor" | "viewer";

function getRoute(): Route {
  const hash = window.location.hash.replace("#", "");
  return hash === "viewer" ? "viewer" : "editor";
}

function loadViewerData(): FloorPlanData | null {
  try {
    const raw = localStorage.getItem("map-editor:floorplan");
    if (!raw) return null;
    return JSON.parse(raw) as FloorPlanData;
  } catch {
    return null;
  }
}

function ViewerRoute() {
  const data = loadViewerData() ?? sampleMap;
  return <MapViewer data={data} />;
}

function App() {
  const [route, setRoute] = useState<Route>(getRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <nav className="flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-xs shrink-0">
        <a
          href="#editor"
          className={`px-3 py-1 rounded transition-colors ${
            route === "editor"
              ? "bg-white/15 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Editor
        </a>
        <a
          href="#viewer"
          className={`px-3 py-1 rounded transition-colors ${
            route === "viewer"
              ? "bg-white/15 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Viewer
        </a>
      </nav>
      <div className="flex-1 overflow-hidden">
        {route === "editor" && (
          <MapEditor initialData={sampleMap} persist />
        )}
        {route === "viewer" && <ViewerRoute />}
      </div>
    </div>
  );
}

export default App;
