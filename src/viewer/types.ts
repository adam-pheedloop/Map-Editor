export type ViewerMode = "attendee" | "exhibitor";

export interface Exhibitor {
  id: string;
  name: string;
  boothCode: string;
  logo?: string;
}

/**
 * Discriminated union representing any interactive map element.
 * elementId is always element.id (the stable UUID) — used for canvas highlight lookup.
 * Future: add | { type: "poi"; elementId: string } without structural changes.
 */
export type HoveredItem =
  | { type: "booth"; elementId: string; boothCode: string }
  | { type: "session_area"; elementId: string; sessionId?: string | null }
  | { type: "meeting_room"; elementId: string; meetingRoomId?: string | null };
