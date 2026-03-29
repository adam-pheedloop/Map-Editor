import { PiMapTrifold } from "react-icons/pi";

export function TopBar() {
  return (
    <div className="flex items-center bg-white border-b border-gray-200">
      <div className="flex items-center justify-center w-12 h-10 border-r border-gray-200 text-gray-400">
        <PiMapTrifold size={20} />
      </div>
      <span className="px-3 text-sm text-gray-400 cursor-default">File</span>
    </div>
  );
}
