import { useState, useMemo, useCallback } from "react";
import type { FloorPlanData, FloorPlanElement } from "../../types";
import type { Exhibitor } from "../types";
import type { SearchResult } from "./useSearch";
import { findPath, smoothPath } from "../utils/pathfinding";
import {
  findNearestWalkableCell,
  resolveBoothToCell,
  resolveExhibitorToCell,
} from "../utils/snapToGrid";

export interface DirectionsLocation {
  type: "booth" | "exhibitor" | "point";
  /** Display label for the location */
  label: string;
  /** Booth code (for booth/exhibitor types) */
  boothCode?: string;
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

  // Build searchable entries (reuses same logic as useSearch)
  const searchEntries = useMemo(() => {
    return data.elements
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
  }, [data.elements, exhibitorsByBooth]);

  const searchLocations = useCallback(
    (query: string): SearchResult[] => {
      const q = query.trim().toLowerCase();
      if (!q) return [];
      return searchEntries.filter(
        (entry) =>
          entry.boothCode.toLowerCase().includes(q) ||
          entry.boothName.toLowerCase().includes(q) ||
          (entry.exhibitorName && entry.exhibitorName.toLowerCase().includes(q))
      );
    },
    [searchEntries]
  );

  /** Resolve a SearchResult into a DirectionsLocation */
  const locationFromResult = useCallback(
    (result: SearchResult): DirectionsLocation => {
      if (result.exhibitorName) {
        return {
          type: "exhibitor",
          label: result.exhibitorName,
          boothCode: result.boothCode,
        };
      }
      return {
        type: "booth",
        label: result.boothName || `Booth ${result.boothCode}`,
        boothCode: result.boothCode,
      };
    },
    []
  );

  // Compute route whenever both locations are set
  const { routePath, routeStatus } = useMemo(() => {
    if (!startLocation || !endLocation || !grid || !grid.enabled) {
      return { routePath: null, routeStatus: "idle" as RouteStatus };
    }

    // Check same location
    if (
      startLocation.boothCode &&
      endLocation.boothCode &&
      startLocation.boothCode === endLocation.boothCode
    ) {
      return { routePath: null, routeStatus: "same-location" as RouteStatus };
    }

    // Resolve to grid cells
    const resolveCell = (loc: DirectionsLocation) => {
      if (loc.type === "point" && loc.position) {
        return findNearestWalkableCell(grid, loc.position.x, loc.position.y);
      }
      if (loc.boothCode) {
        const booth = data.elements.find(
          (el) => el.type === "booth" && el.properties.boothCode === loc.boothCode
        );
        if (booth) return resolveBoothToCell(grid, booth);
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
      setEndLocation((end) => prev);
      return endLocation;
    });
  }, [endLocation]);

  /** Open directions with a pre-set destination (e.g. from booth popover) */
  const navigateTo = useCallback(
    (boothCode: string) => {
      const exhibitor = exhibitorsByBooth.get(boothCode);
      const booth = data.elements.find(
        (el) => el.type === "booth" && el.properties.boothCode === boothCode
      );
      const label = exhibitor?.name || booth?.properties.name || `Booth ${boothCode}`;
      setEndLocation({
        type: exhibitor ? "exhibitor" : "booth",
        label,
        boothCode,
      });
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
