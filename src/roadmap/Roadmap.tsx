import { useState } from "react";
import { PiCheckCircleFill, PiCircleDashed, PiSpinnerGap, PiCaretRight } from "react-icons/pi";
import phasesData from "../data/phases.json";

type PhaseStatus = "done" | "in-progress" | "planned";

interface Phase {
  id: number;
  title: string;
  summary: string;
  status: PhaseStatus;
  tasks: string[];
}

const statusConfig: Record<
  PhaseStatus,
  { icon: typeof PiCheckCircleFill; label: string; color: string; bg: string }
> = {
  done: {
    icon: PiCheckCircleFill,
    label: "Done",
    color: "text-emerald-600",
    bg: "bg-emerald-50 text-emerald-700",
  },
  "in-progress": {
    icon: PiSpinnerGap,
    label: "In Progress",
    color: "text-amber-500",
    bg: "bg-amber-50 text-amber-700",
  },
  planned: {
    icon: PiCircleDashed,
    label: "Planned",
    color: "text-gray-400",
    bg: "bg-gray-100 text-gray-500",
  },
};

function PhaseRow({ phase }: { phase: Phase }) {
  const [open, setOpen] = useState(false);
  const config = statusConfig[phase.status];
  const Icon = config.icon;

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <button
        className="w-full flex items-start gap-3 py-3 px-4 text-left hover:bg-gray-50 transition-colors rounded-lg"
        onClick={() => setOpen((o) => !o)}
      >
        <div className={`mt-0.5 ${config.color}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 font-mono shrink-0">
              {String(phase.id).padStart(2, "0")}
            </span>
            <span className="text-sm font-medium text-gray-700 truncate">
              {phase.title}
            </span>
            <span
              className={`text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded ${config.bg} shrink-0`}
            >
              {config.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            {phase.summary}
          </p>
        </div>
        <PiCaretRight
          size={14}
          className={`mt-1 shrink-0 text-gray-400 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>

      {open && (
        <ul className="pb-3 px-4 ml-8 flex flex-col gap-1 border-t border-gray-100 pt-2">
          {phase.tasks.map((task) => (
            <li key={task} className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
              {task}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Roadmap() {
  const phases = phasesData.phases as Phase[];
  const done = phases.filter((p) => p.status === "done").length;
  const inProgress = phases.filter((p) => p.status === "in-progress").length;
  const planned = phases.filter((p) => p.status === "planned").length;

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-gray-800">
            EventMaps 2.0 Roadmap
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Last updated {phasesData.lastUpdated}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-gray-200">
            {done > 0 && (
              <div
                className="bg-emerald-500 rounded-full transition-all"
                style={{ width: `${(done / phases.length) * 100}%` }}
              />
            )}
            {inProgress > 0 && (
              <div
                className="bg-amber-400 rounded-full transition-all"
                style={{ width: `${(inProgress / phases.length) * 100}%` }}
              />
            )}
          </div>
          <div className="flex gap-4 mt-2 text-[11px] text-gray-500">
            <span>
              <span className="text-emerald-600 font-medium">{done}</span> done
            </span>
            <span>
              <span className="text-amber-500 font-medium">{inProgress}</span>{" "}
              in progress
            </span>
            <span>
              <span className="text-gray-500 font-medium">{planned}</span>{" "}
              planned
            </span>
          </div>
        </div>

        {/* Phase list */}
        <div className="flex flex-col gap-2">
          {phases.map((phase) => (
            <PhaseRow key={phase.id} phase={phase} />
          ))}
        </div>
      </div>
    </div>
  );
}
