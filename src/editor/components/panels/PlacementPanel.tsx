import { useState } from "react";
import {
  PiCaretDown,
  PiCaretUp,
  PiSparkle,
  PiMagnifyingGlass,
  PiFunnel,
  PiPlus,
} from "react-icons/pi";
import type { PlacementRecords, PlacedRecord } from "../../hooks/usePlacementRecords";
import type { ExhibitorBooth, SessionLocation, MeetingRoom } from "../../../viewer/types";

// ---------------------------------------------------------------------------
// Placement record data transfer
// ---------------------------------------------------------------------------

export type PlacementRecordRef =
  | { type: "booth"; id: string }
  | { type: "session_area"; id: string }
  | { type: "meeting_room"; id: string };

export const PLACEMENT_DRAG_TYPE = "application/x-placement-record";

// ---------------------------------------------------------------------------
// Section component
// ---------------------------------------------------------------------------

interface SectionConfig {
  iconShape: "rect" | "oval";
  iconColor: string;
}

interface SectionProps extends SectionConfig {
  title: string;
  placed: number;
  unplaced: number;
  isOpen: boolean;
  onToggle: () => void;
  stub?: boolean;
  children?: React.ReactNode;
}

function Section({
  title,
  placed,
  unplaced,
  iconShape,
  iconColor,
  isOpen,
  onToggle,
  stub = false,
  children,
}: SectionProps) {
  const total = placed + unplaced;

  return (
    <div className="border-b border-gray-100 last:border-0">
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className={[
          "w-full flex items-center gap-2.5 py-2.5 text-left transition-colors border-l-2",
          isOpen
            ? "bg-primary-100 border-primary-500 px-[10px]"
            : "border-transparent px-3 hover:bg-gray-100",
        ].join(" ")}
      >
        {/* Shape icon */}
        <span
          className="shrink-0 w-4 h-4"
          style={{
            backgroundColor: iconColor,
            borderRadius: iconShape === "oval" ? "9999px" : "3px",
            opacity: 0.7,
          }}
        />

        {/* Title + counts */}
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-semibold text-gray-800 truncate">{title}</span>
          {!stub && (
            <span className="block text-xs text-gray-400 tabular-nums">
              Placed: {placed}&nbsp;&nbsp;|&nbsp;&nbsp;Unplaced: {unplaced}
            </span>
          )}
        </span>

        {/* Sparkle (auto-arrange — Phase 13) */}
        <span
          className="shrink-0 text-gray-300 hover:text-primary-400 transition-colors"
          title="Auto-arrange (coming soon)"
          onClick={(e) => e.stopPropagation()}
        >
          <PiSparkle size={14} />
        </span>

        {/* Chevron */}
        <span className="shrink-0 text-gray-400">
          {isOpen ? <PiCaretUp size={12} /> : <PiCaretDown size={12} />}
        </span>
      </button>

      {/* Body */}
      {isOpen && (
        <div>
          {stub ? (
            <p className="px-3 py-2.5 text-xs text-gray-400 italic">Coming soon</p>
          ) : total === 0 ? (
            <p className="px-3 py-2.5 text-xs text-gray-400 italic">No records found</p>
          ) : (
            <>
              {/* Filter bar */}
              <FilterBar />
              {children}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter bar (stub — wired in Step 5)
// ---------------------------------------------------------------------------

function FilterBar() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-gray-100 bg-white">
      <button
        type="button"
        className="flex items-center gap-1 text-xs text-gray-600 border border-gray-200 rounded px-1.5 py-0.5 hover:bg-gray-50 transition-colors"
      >
        <span className="inline-block w-2.5 h-2.5 rounded-sm bg-gray-300" />
        Rectangle
        <PiCaretDown size={10} className="text-gray-400" />
      </button>
      <div className="flex-1" />
      <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors p-0.5">
        <PiMagnifyingGlass size={13} />
      </button>
      <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors p-0.5">
        <PiFunnel size={13} />
      </button>
      <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors p-0.5">
        <PiPlus size={13} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Row components
// ---------------------------------------------------------------------------

function PlacementRow({
  isPlaced,
  dragRef,
  children,
}: {
  isPlaced: boolean;
  dragRef: PlacementRecordRef;
  children: React.ReactNode;
}) {
  const handleDragStart = (e: React.DragEvent) => {
    if (isPlaced) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData(PLACEMENT_DRAG_TYPE, JSON.stringify(dragRef));
    e.dataTransfer.setData("text/plain", JSON.stringify(dragRef));
  };

  return (
    <div
      draggable={!isPlaced}
      onDragStart={handleDragStart}
      className={[
        "flex items-center gap-3 px-3 py-2.5 border-b border-gray-50 text-sm transition-colors last:border-0",
        isPlaced
          ? "opacity-40 cursor-default"
          : "cursor-grab hover:bg-gray-50 active:cursor-grabbing",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function BoothRow({ record, isPlaced }: PlacedRecord<ExhibitorBooth>) {
  return (
    <PlacementRow isPlaced={isPlaced} dragRef={{ type: "booth", id: record.slug }}>
      <span className="flex-1 text-gray-700 truncate">Booth {record.code}</span>
      {isPlaced ? (
        <span className="shrink-0 text-xs font-medium text-green-600">Placed</span>
      ) : (
        <span className="shrink-0 text-xs font-medium text-amber-500">Unplaced</span>
      )}
    </PlacementRow>
  );
}

function SessionRow({ record, isPlaced }: PlacedRecord<SessionLocation>) {
  return (
    <PlacementRow isPlaced={isPlaced} dragRef={{ type: "session_area", id: String(record.id) }}>
      <span className="flex-1 text-gray-700 truncate">{record.title}</span>
      {isPlaced ? (
        <span className="shrink-0 text-xs font-medium text-green-600">Placed</span>
      ) : (
        <span className="shrink-0 text-xs font-medium text-amber-500">Unplaced</span>
      )}
    </PlacementRow>
  );
}

function MeetingRoomRow({ record, isPlaced }: PlacedRecord<MeetingRoom>) {
  return (
    <PlacementRow isPlaced={isPlaced} dragRef={{ type: "meeting_room", id: String(record.id) }}>
      <span className="flex-1 text-gray-700 truncate">
        {record.name}
        {record.capacity != null && (
          <span className="text-gray-400 ml-1 text-xs">· {record.capacity} cap.</span>
        )}
      </span>
      {isPlaced ? (
        <span className="shrink-0 text-xs font-medium text-green-600">Placed</span>
      ) : (
        <span className="shrink-0 text-xs font-medium text-amber-500">Unplaced</span>
      )}
    </PlacementRow>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface PlacementPanelProps {
  records: PlacementRecords;
}

type SectionId = "booths" | "sessions" | "meetingRooms" | "tables";

export function PlacementPanel({ records }: PlacementPanelProps) {
  const { booths, sessions, meetingRooms, boothCounts, sessionCounts, roomCounts } = records;
  const [openSection, setOpenSection] = useState<SectionId | null>(null);

  const toggle = (id: SectionId) =>
    setOpenSection((prev) => (prev === id ? null : id));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <Section
          title="Booths"
          placed={boothCounts.placed}
          unplaced={boothCounts.unplaced}
          iconShape="rect"
          iconColor="#3b82f6"
          isOpen={openSection === "booths"}
          onToggle={() => toggle("booths")}
        >
          {booths.map((r) => (
            <BoothRow key={r.record.slug} {...r} />
          ))}
        </Section>

        <Section
          title="Session Locations"
          placed={sessionCounts.placed}
          unplaced={sessionCounts.unplaced}
          iconShape="oval"
          iconColor="#8b5cf6"
          isOpen={openSection === "sessions"}
          onToggle={() => toggle("sessions")}
        >
          {sessions.map((r) => (
            <SessionRow key={r.record.id} {...r} />
          ))}
        </Section>

        <Section
          title="Meeting Rooms"
          placed={roomCounts.placed}
          unplaced={roomCounts.unplaced}
          iconShape="rect"
          iconColor="#f59e0b"
          isOpen={openSection === "meetingRooms"}
          onToggle={() => toggle("meetingRooms")}
        >
          {meetingRooms.map((r) => (
            <MeetingRoomRow key={r.record.id} {...r} />
          ))}
        </Section>

        <Section
          title="Tables"
          placed={0}
          unplaced={0}
          iconShape="rect"
          iconColor="#6b7280"
          isOpen={openSection === "tables"}
          onToggle={() => toggle("tables")}
          stub
        />
      </div>

      {/* Footer */}
      <div className="px-3 py-2.5 border-t border-gray-100 shrink-0 text-center">
        <button
          type="button"
          className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          Manage Seat Plan →
        </button>
      </div>
    </div>
  );
}
