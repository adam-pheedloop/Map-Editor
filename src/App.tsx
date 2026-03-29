import { useState, useEffect } from "react";
import { PiDesktop, PiDeviceMobile } from "react-icons/pi";
import { MapEditor } from "./editor";
import { MapViewer } from "./viewer";
import { sampleMap } from "./sample-data/sample-map";
import { sampleExhibitors } from "./sample-data/sample-exhibitors";
import type { FloorPlanData } from "./types";

type Route = "editor" | "viewer";
type Viewport = "desktop" | "mobile";

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

function ViewerRoute({ viewport }: { viewport: Viewport }) {
  const data = loadViewerData() ?? sampleMap;
  const viewer = <MapViewer data={data} exhibitors={sampleExhibitors} />;

  if (viewport === "mobile") {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-800 overflow-hidden">
        <div
          className="bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-gray-700"
          style={{ width: 390, height: 844 }}
        >
          {viewer}
        </div>
      </div>
    );
  }

  return viewer;
}

function App() {
  const [route, setRoute] = useState<Route>(getRoute);
  const [viewport, setViewport] = useState<Viewport>("desktop");

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

        {route === "viewer" && (
          <>
            <div className="w-px h-4 bg-gray-700 mx-1" />
            <button
              onClick={() => setViewport("desktop")}
              className={`p-1 rounded cursor-pointer transition-colors ${
                viewport === "desktop" ? "text-white" : "text-gray-500 hover:text-gray-300"
              }`}
              title="Desktop"
            >
              <PiDesktop size={16} />
            </button>
            <button
              onClick={() => setViewport("mobile")}
              className={`p-1 rounded cursor-pointer transition-colors ${
                viewport === "mobile" ? "text-white" : "text-gray-500 hover:text-gray-300"
              }`}
              title="Mobile (390×844)"
            >
              <PiDeviceMobile size={16} />
            </button>
          </>
        )}
      </nav>
      <div className="flex-1 overflow-hidden flex">
        {route === "editor" && (
          <MapEditor initialData={sampleMap} persist />
        )}
        {route === "viewer" && <ViewerRoute viewport={viewport} />}
      </div>
    </div>
  );
}

export default App;
