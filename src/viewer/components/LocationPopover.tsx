import { useEffect, useRef } from "react";

interface LocationPopoverProps {
  name: string;
  type: "session_area" | "meeting_room";
  x: number;
  y: number;
  onClose: () => void;
  onGetDirections?: () => void;
}

const TYPE_LABEL: Record<LocationPopoverProps["type"], string> = {
  session_area: "Session Area",
  meeting_room: "Meeting Room",
};

export function LocationPopover({ name, type, x, y, onClose, onGetDirections }: LocationPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-[9999] min-w-[180px]"
      style={{ left: x + 12, top: y - 20 }}
    >
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {TYPE_LABEL[type]}
      </div>
      <div className="mt-1 text-sm font-medium text-gray-900">
        {name}
      </div>
      {onGetDirections && (
        <button
          onClick={onGetDirections}
          className="mt-2 w-full text-xs font-medium text-blue-600 hover:bg-blue-50 rounded px-2 py-1.5 cursor-pointer transition-colors text-left"
        >
          Get directions to here
        </button>
      )}
    </div>
  );
}
