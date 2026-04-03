import { useState } from "react";
import { PiWarningCircle, PiCheckCircleFill, PiBug, PiWrench, PiCaretRight } from "react-icons/pi";
import issuesData from "../data/known-issues.json";

type Severity = "minor" | "medium" | "tech-debt";
type Status = "open" | "fixed";

interface Issue {
  id: number;
  title: string;
  severity: Severity;
  area: string;
  description: string;
  status: Status;
}

const severityConfig: Record<Severity, { icon: typeof PiBug; label: string; color: string; bg: string }> = {
  minor: {
    icon: PiBug,
    label: "Minor",
    color: "text-blue-500",
    bg: "bg-blue-50 text-blue-700",
  },
  medium: {
    icon: PiWarningCircle,
    label: "Medium",
    color: "text-amber-500",
    bg: "bg-amber-50 text-amber-700",
  },
  "tech-debt": {
    icon: PiWrench,
    label: "Tech Debt",
    color: "text-purple-500",
    bg: "bg-purple-50 text-purple-700",
  },
};

function IssueRow({ issue }: { issue: Issue }) {
  const [open, setOpen] = useState(false);
  const isFixed = issue.status === "fixed";
  const config = severityConfig[issue.severity];
  const Icon = isFixed ? PiCheckCircleFill : config.icon;

  return (
    <div className={`rounded-lg border ${isFixed ? "border-gray-100 bg-gray-50" : "border-gray-200 bg-white"}`}>
      <button
        className="w-full flex items-start gap-3 py-3 px-4 text-left hover:bg-gray-50 transition-colors rounded-lg"
        onClick={() => setOpen((o) => !o)}
      >
        <div className={`mt-0.5 ${isFixed ? "text-emerald-500" : config.color}`}>
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${isFixed ? "text-gray-400 line-through" : "text-gray-700"} truncate`}>
              {issue.title}
            </span>
            {isFixed ? (
              <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 shrink-0">
                Fixed
              </span>
            ) : (
              <span className={`text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded ${config.bg} shrink-0`}>
                {config.label}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{issue.area}</p>
        </div>
        <PiCaretRight
          size={14}
          className={`mt-1 shrink-0 text-gray-400 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>

      {open && (
        <div className="pb-3 px-4 ml-8 border-t border-gray-100 pt-2">
          <p className="text-xs text-gray-500 leading-relaxed">{issue.description}</p>
        </div>
      )}
    </div>
  );
}

export function KnownIssues() {
  const issues = issuesData.issues as Issue[];
  const openIssues = issues.filter((i) => i.status === "open");
  const fixedIssues = issues.filter((i) => i.status === "fixed");

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-gray-800">Known Issues</h1>
          <p className="text-xs text-gray-400 mt-1">
            Last updated {issuesData.lastUpdated}
          </p>
        </div>

        <div className="flex gap-4 mb-6 text-[11px] text-gray-500">
          <span>
            <span className="text-amber-500 font-medium">{openIssues.length}</span> open
          </span>
          <span>
            <span className="text-emerald-600 font-medium">{fixedIssues.length}</span> fixed
          </span>
        </div>

        {openIssues.length > 0 && (
          <div className="flex flex-col gap-2 mb-6">
            {openIssues.map((issue) => (
              <IssueRow key={issue.id} issue={issue} />
            ))}
          </div>
        )}

        {fixedIssues.length > 0 && (
          <>
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-2">
              Resolved
            </div>
            <div className="flex flex-col gap-2">
              {fixedIssues.map((issue) => (
                <IssueRow key={issue.id} issue={issue} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
