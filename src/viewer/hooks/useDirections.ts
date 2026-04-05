import { useState, useMemo, useCallback } from "react";
import type { FloorPlanData } from "../../types";
import type { Exhibitor } from "../types";
import type { SearchResult } from "./useSearch";
import { findPath, smoothPath } from "../utils/pathfinding";
import {
  findNearestWalkableCell,
  resolveBoothToCell,
} from "../utils/snapToGrid";

export interface DirectionsLocation {
  type: "booth" | "exhibitor" | "session_area" | "meeting_room" | "point";
  // Future: add "poi" here without structural changes
  /** Display label for the location */
  label: string;
  /** Booth code (for booth/exhibitor types) */
  boothCode?: string;
  /** Element UUID (for session_area / meeting_room / future poi) */
  elementId?: string;
  /** Canvas coordinates (for point type) */
  position?: { x: number; y: number };
}

export type RouteStatus = "idle" | "ready" | "no-route" | "same-location";

export function useDirections(
  data: FloorPlanData,
  exhibitors: Exhibitor[]
) {
  const [active, setActive] = useState(false);
  const [startLocation, setStartLocation] = useState<DirectionsLocation | null>(null);
  const [endLocation, setEndLocation] = useState<DirectionsLocation | null>(null);

  const grid = data.walkableLayer;
  const hasGrid = !!grid && grid.enabled;

  const exhibitorsByBooth = useMemo(() => {
    const map = new Map<string, Exhibitor>();
    for (const ex of exhibitors) map.set(ex.boothCode, ex);
    return map;
  }, [exhibitors]);

  // Build searchable entries for all interactive element types
  const searchEntries = useMemo(() => {
    const entries: SearchResult[] = [];

    for (const el of data.elements) {
      if (el.type === "booth" && el.properties.boothCode) {
        const code = el.properties.boothCode;
        const exhibitor = exhibitorsByBooth.get(code);
        entries.push({
          elementId: el.id,
          elementType: "booth",
          name: el.properties.name || `Booth ${code}`,
          code,
          exhibitorName: exhibitor?.name ?? null,
        } satisfies SearchResult);
      } else if (el.type === "session_area") {
        entries.push({
          elementId: el.id,
          elementType: "session_area",
          name: el.properties.name || "Session Area",
          code: el.properties.sessionId ?? null,
        } satisfies SearchResult);
      } else if (el.type === "meeting_room") {
        entries.push({
          elementId: el.id,
          elementType: "meeting_room",
          name: el.properties.name || "Meeting Room",
          code: el.properties.meetingRoomId ?? null,
        } satisfies SearchResult);
      }
    }

    return entries;
  }, [data.elements, exhibitorsByBooth]);

  const searchLocations = useCallback(
    (query: string): SearchResult[] => {
      const q = query.trim().toLowerCase();
      if (!q) return [];
      return searchEntries.filter(
        (entry) =>
          entry.name.toLowerCase().includes(q) ||
          (entry.code && entry.code.toLowerCase().includes(q)) ||
          (entry.exhibitorName && entry.exhibitorName.toLowerCase().includes(q))
      );
    },
    [searchEntries]
  );

  /** Resolve a SearchResult into a DirectionsLocation */
  const locationFromResult = useCallback(
    (result: SearchResult): DirectionsLocation => {
      if (result.elementType === "booth") {
        if (result.exhibitorName) {
          return {
            type: "exhibitor",
            label: result.exhibitorName,
            boothCode: result.code ?? undefined,
            elementId: result.elementId,
          };
        }
        return {
          type: "booth",
          label: result.name,
          boothCode: result.code ?? undefined,
          elementId: result.elementId,
        };
      }
      return {
        type: result.elementType,
        label: result.name,
        elementId: result.elementId,
      };
    },
    []
  );

  // Compute route whenever both locations are set
  const { routePath, routeStatus } = useMemo(() => {
    if (!startLocation || !endLocation || !grid || !grid.enabled) {
      return { routePath: null, routeStatus: "idle" as RouteStatus };
    }

    // Check same location — compare by elementId when available, fall back to boothCode
    const sameById =
      startLocation.elementId &&
      endLocation.elementId &&
      startLocation.elementId === endLocation.elementId;
    const sameByBoothCode =
      !startLocation.elementId &&
      startLocation.boothCode &&
      endLocation.boothCode &&
      startLocation.boothCode === endLocation.boothCode;
    if (sameById || sameByBoothCode) {
      return { routePath: null, routeStatus: "same-location" as RouteStatus };
    }

    // Resolve to grid cells
    const resolveCell = (loc: DirectionsLocation) => {
      if (loc.type === "point" && loc.position) {
        return findNearestWalkableCell(grid, loc.position.x, loc.position.y);
      }
      // elementId-based lookup (session_area, meeting_room, and booths with elementId)
      if (loc.elementId) {
        const el = data.elements.find((e) => e.id === loc.elementId);
        if (el) return resolveBoothToCell(grid, el);
      }
      // Legacy boothCode-based lookup
      if (loc.boothCode) {
        const el = data.elements.find(
          (e) => e.type === "booth" && e.properties.boothCode === loc.boothCode
        );
        if (el) return resolveBoothToCell(grid, el);
      }
      return null;
    };

    const startCell = resolveCell(startLocation);
    const endCell = resolveCell(endLocation);

    if (!startCell || !endCell) {
      return { routePath: null, routeStatus: "no-route" as RouteStatus };
    }

    const path = findPath(grid, startCell, endCell);
    if (!path) {
      return { routePath: null, routeStatus: "no-route" as RouteStatus };
    }

    const smoothed = smoothPath(grid, path);
    return { routePath: smoothed, routeStatus: "ready" as RouteStatus };
  }, [startLocation, endLocation, grid, data.elements]);

  const open = useCallback(() => setActive(true), []);

  const close = useCallback(() => {
    setActive(false);
    setStartLocation(null);
    setEndLocation(null);
  }, []);

  const swap = useCallback(() => {
    setStartLocation((prev) => {
      setEndLocation(prev);
      return endLocation;
    });
  }, [endLocation]);

  /** Open directions with a pre-set destination (e.g. from a popover) */
  const navigateTo = useCallback(
    (elementId: string) => {
      const el = data.elements.find((e) => e.id === elementId);
      if (!el) return;

      let location: DirectionsLocation;
      if (el.type === "booth" && el.properties.boothCode) {
        const exhibitor = exhibitorsByBooth.get(el.properties.boothCode);
        location = {
          type: exhibitor ? "exhibitor" : "booth",
          label: exhibitor?.name || el.properties.name || `Booth ${el.properties.boothCode}`,
          boothCode: el.properties.boothCode,
          elementId: el.id,
        };
      } else if (el.type === "session_area") {
        location = {
          type: "session_area",
          label: el.properties.name || "Session Area",
          elementId: el.id,
        };
      } else if (el.type === "meeting_room") {
        location = {
          type: "meeting_room",
          label: el.properties.name || "Meeting Room",
          elementId: el.id,
        };
      } else {
        return;
      }

      setEndLocation(location);
      setStartLocation(null);
      setActive(true);
    },
    [exhibitorsByBooth, data.elements]
  );

  return {
    active,
    hasGrid,
    startLocation,
    endLocation,
    routePath,
    routeStatus,
    searchLocations,
    locationFromResult,
    setStartLocation,
    setEndLocation,
    open,
    close,
    swap,
    navigateTo,
  };
}
