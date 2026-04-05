import { useState, useMemo } from "react";
import type { FloorPlanElement } from "../../types";
import type { Exhibitor } from "../types";

export interface SearchResult {
  elementId: string;           // element.id UUID — use as React key and for canvas highlight lookup
  elementType: "booth" | "session_area" | "meeting_room";
  name: string;                // primary display name
  code?: string | null;        // boothCode (EXHBOT...) / meetingRoomId (MEL...) / sessionId (numeric)
  exhibitorName?: string | null;
}

export function useSearch(
  elements: FloorPlanElement[],
  exhibitors: Exhibitor[]
) {
  const [query, setQuery] = useState("");

  const exhibitorsByBooth = useMemo(() => {
    const map = new Map<string, Exhibitor>();
    for (const ex of exhibitors) {
      map.set(ex.boothCode, ex);
    }
    return map;
  }, [exhibitors]);

  // Build searchable entries from booth elements
  const allBooths = useMemo(() => {
    return elements
      .filter((el) => el.type === "booth" && el.properties.boothCode)
      .map((el) => {
        const code = el.properties.boothCode!;
        const exhibitor = exhibitorsByBooth.get(code);
        return {
          boothCode: code,
          boothName: el.properties.name || "",
          exhibitorName: exhibitor?.name ?? null,
        } satisfies SearchResult;
      });
  }, [elements, exhibitorsByBooth]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return allBooths.filter(
      (booth) =>
        booth.boothCode.toLowerCase().includes(q) ||
        booth.boothName.toLowerCase().includes(q) ||
        (booth.exhibitorName && booth.exhibitorName.toLowerCase().includes(q))
    );
  }, [query, allBooths]);

  // Set of booth codes that match the search (for canvas highlighting)
  const matchedBoothCodes = useMemo(
    () => new Set(results.map((r) => r.boothCode)),
    [results]
  );

  return {
    query,
    setQuery,
    results,
    matchedBoothCodes,
    isSearching: query.trim().length > 0,
  };
}
