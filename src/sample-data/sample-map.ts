import type { FloorPlanData } from "../types";

export const sampleMap: FloorPlanData = {
  version: "1.0",
  id: "EMP-sample-001",
  name: "Main Exhibition Hall",
  dimensions: {
    width: 1200,
    height: 800,
    unit: "ft",
    pixelsPerUnit: 1,
  },
  elements: [
    {
      id: "elem-001",
      type: "booth",
      geometry: { shape: "rect", x: 50, y: 50, width: 100, height: 80 },
      properties: {
        boothCode: "A101",
        name: "Booth A101",
        color: "#4A90D9",
        zIndex: 1,
        area: 100,
      },
    },
    {
      id: "elem-002",
      type: "booth",
      geometry: { shape: "rect", x: 170, y: 50, width: 100, height: 80 },
      properties: {
        boothCode: "A102",
        name: "Booth A102",
        color: "#4A90D9",
        zIndex: 1,
        area: 100,
      },
    },
    {
      id: "elem-003",
      type: "booth",
      geometry: { shape: "rect", x: 290, y: 50, width: 100, height: 80 },
      properties: {
        boothCode: "A103",
        name: "Booth A103",
        color: "#E74C3C",
        zIndex: 1,
        area: 100,
      },
    },
    {
      id: "elem-004",
      type: "booth",
      geometry: { shape: "rect", x: 50, y: 180, width: 100, height: 80 },
      properties: {
        boothCode: "B101",
        name: "Booth B101",
        color: "#4A90D9",
        zIndex: 1,
        area: 100,
      },
    },
    {
      id: "elem-005",
      type: "booth",
      geometry: { shape: "rect", x: 170, y: 180, width: 100, height: 80 },
      properties: {
        boothCode: "B102",
        name: "Booth B102",
        color: "#4A90D9",
        zIndex: 1,
        area: 100,
      },
    },
    {
      id: "elem-006",
      type: "session_area",
      geometry: { shape: "rect", x: 500, y: 50, width: 250, height: 200 },
      properties: {
        name: "Keynote Stage",
        color: "#27AE60",
        zIndex: 0,
        capacity: 500,
        sessionId: "TALK-001",
      },
    },
    {
      id: "elem-007",
      type: "meeting_room",
      geometry: { shape: "rect", x: 500, y: 300, width: 150, height: 120 },
      properties: {
        name: "Meeting Room 1",
        color: "#F39C12",
        zIndex: 0,
        capacity: 20,
        meetingRoomId: "ROOM-001",
      },
    },
    {
      id: "elem-008",
      type: "walkway",
      geometry: { shape: "rect", x: 410, y: 50, width: 40, height: 400 },
      properties: {
        name: "Main Aisle",
        color: "#ECF0F1",
        zIndex: -1,
      },
    },
  ],
  legend: {
    entries: [
      { label: "Available", color: "#4A90D9" },
      { label: "Reserved", color: "#E74C3C" },
      { label: "Session Area", color: "#27AE60" },
      { label: "Meeting Room", color: "#F39C12" },
    ],
    position: "bottom-right",
    visible: true,
  },
  metadata: {
    createdAt: "2026-03-29T12:00:00Z",
    updatedAt: "2026-03-29T12:00:00Z",
    scale: 1.0,
  },
};
