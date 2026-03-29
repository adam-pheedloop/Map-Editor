import { MapEditor } from "./editor";
import { sampleMap } from "./sample-data/sample-map";

function App() {
  return (
    <div className="h-screen">
      <MapEditor initialData={sampleMap} persist />
    </div>
  );
}

export default App;
