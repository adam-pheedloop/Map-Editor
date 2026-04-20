import { useMemo } from "react";
import type { FloorPlanData } from "../../types";
import type { ExhibitorBooth, SessionLocation, MeetingRoom } from "../../viewer/types";
import { conferenceExpoBooths } from "../../sample-data/sample-booths";
import { sampleSessionLocations } from "../../sample-data/sample-session-locations";
import { sampleMeetingRooms } from "../../sample-data/sample-meeting-rooms";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface PlacedRecord<T> {
  record: T;
  isPlaced: boolean;
}

export interface RecordCounts {
  placed: number;
  unplaced: number;
}

export interface PlacementRecords {
  booths: PlacedRecord<ExhibitorBooth>[];
  sessions: PlacedRecord<SessionLocation>[];
  meetingRooms: PlacedRecord<MeetingRoom>[];
  boothCounts: RecordCounts;
  sessionCounts: RecordCounts;
  roomCounts: RecordCounts;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Derives the placement record pool from sample data and marks each record
 * as placed or unplaced by scanning the current map's elements.
 *
 * Phase 15: swap the three sample imports for API calls without changing the
 * return shape — consumers are decoupled from the data source.
 */
export function usePlacementRecords(data: FloorPlanData): PlacementRecords {
  return useMemo(() => {
    const elements = data.elements;

    // Build O(1) lookup sets from placed element properties
    const placedBoothSlugs = new Set(
      elements
        .map((el) => el.properties.boothSlug)
        .filter((slug): slug is string => Boolean(slug))
    );

    const placedSessionIds = new Set(
      elements
        .map((el) => el.properties.sessionId)
        .filter((id): id is string => Boolean(id))
    );

    const placedRoomIds = new Set(
      elements
        .map((el) => el.properties.meetingRoomId)
        .filter((id): id is string => Boolean(id))
    );

    const booths: PlacedRecord<ExhibitorBooth>[] = conferenceExpoBooths.map((record) => ({
      record,
      isPlaced: placedBoothSlugs.has(record.slug),
    }));

    const sessions: PlacedRecord<SessionLocation>[] = sampleSessionLocations.map((record) => ({
      record,
      isPlaced: placedSessionIds.has(String(record.id)),
    }));

    const meetingRooms: PlacedRecord<MeetingRoom>[] = sampleMeetingRooms.map((record) => ({
      record,
      isPlaced: placedRoomIds.has(String(record.id)),
    }));

    const countOf = (arr: PlacedRecord<unknown>[]): RecordCounts => ({
      placed:   arr.filter((r) =>  r.isPlaced).length,
      unplaced: arr.filter((r) => !r.isPlaced).length,
    });

    return {
      booths,
      sessions,
      meetingRooms,
      boothCounts:   countOf(booths),
      sessionCounts: countOf(sessions),
      roomCounts:    countOf(meetingRooms),
    };
  }, [data.elements]);
}
