import { MapEditor } from "./editor";
import { sampleMap } from "./sample-data/sample-map";

function App() {
  return (
    <div className="h-screen flex flex-col">
      <header className="px-4 py-3 bg-white border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-800">
          EventMaps Editor
        </h1>
      </header>
      <main className="flex-1 overflow-hidden">
        <MapEditor initialData={sampleMap} />
      </main>
    </div>
  );
}

export default App;
