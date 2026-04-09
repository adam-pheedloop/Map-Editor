import type { SessionLocation } from "../viewer/types";

/**
 * Sample SessionLocation records mirroring the PheedLoop DB.
 * id    → SessionLocation.id  (integer primary key)
 * title → SessionLocation.title  (unique per event)
 *
 * IDs are consistent across maps — if two maps reference sessionId: 1,
 * they both refer to the Keynote Stage.
 */
export const sampleSessionLocations: SessionLocation[] = [
  { id: 1, title: "Keynote Stage" },
  { id: 2, title: "Breakout Room A" },
  { id: 3, title: "Breakout Room B" },
  { id: 4, title: "Workshop Theatre" },
  { id: 5, title: "Workshop Room" },
  { id: 6, title: "Panel Room" },
  { id: 7, title: "Innovation Lab" },
  { id: 8, title: "Networking Lounge" },
];
