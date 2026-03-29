import type { FloorPlanData } from "../types";
import bgImage from "./Empty Exhibit Hall.png";

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
    // Row A — right side, top
    {
      id: "elem-001",
      type: "booth",
      geometry: { shape: "rect", x: 758, y: 86, width: 80, height: 64 },
      properties: { boothCode: "A101", name: "Booth A101", color: "#4A90D9", zIndex: 1, area: 5120 },
    },
    {
      id: "elem-002",
      type: "booth",
      geometry: { shape: "rect", x: 842, y: 86, width: 80, height: 64 },
      properties: { boothCode: "A102", name: "Booth A102", color: "#4A90D9", zIndex: 1, area: 5120 },
    },
    {
      id: "elem-003",
      type: "booth",
      geometry: { shape: "rect", x: 926, y: 86, width: 80, height: 64 },
      properties: { boothCode: "A103", name: "Booth A103", color: "#E74C3C", zIndex: 1, area: 5120 },
    },
    // Row B — middle, top
    {
      id: "elem-004",
      type: "booth",
      geometry: { shape: "rect", x: 498, y: 86, width: 80, height: 64 },
      properties: { boothCode: "B101", name: "Booth B101", color: "#4A90D9", zIndex: 1, area: 5120 },
    },
    {
      id: "elem-005",
      type: "booth",
      geometry: { shape: "rect", x: 582, y: 86, width: 80, height: 64 },
      properties: { boothCode: "B102", name: "Booth B102", color: "#4A90D9", zIndex: 1, area: 5120 },
    },
    // Row C — left side, row 1
    {
      id: "elem-009",
      type: "booth",
      geometry: { shape: "rect", x: 194, y: 171, width: 80, height: 64 },
      properties: { boothCode: "C101", name: "Booth C101", color: "#4A90D9", zIndex: 1, area: 5120 },
    },
    {
      id: "elem-010",
      type: "booth",
      geometry: { shape: "rect", x: 278, y: 171, width: 80, height: 64 },
      properties: { boothCode: "C102", name: "Booth C102", color: "#4A90D9", zIndex: 1, area: 5120 },
    },
    {
      id: "elem-011",
      type: "booth",
      geometry: { shape: "rect", x: 362, y: 171, width: 80, height: 64 },
      properties: { boothCode: "C103", name: "Booth C103", color: "#E74C3C", zIndex: 1, area: 5120 },
    },
    // Row C — left side, row 2
    {
      id: "elem-012",
      type: "booth",
      geometry: { shape: "rect", x: 194, y: 239, width: 80, height: 64 },
      properties: { boothCode: "C104", name: "Booth C104", color: "#4A90D9", zIndex: 1, area: 5120 },
    },
    {
      id: "elem-013",
      type: "booth",
      geometry: { shape: "rect", x: 278, y: 239, width: 80, height: 64 },
      properties: { boothCode: "C105", name: "Booth C105", color: "#4A90D9", zIndex: 1, area: 5120 },
    },
    // Row D — left side, row 3
    {
      id: "elem-014",
      type: "booth",
      geometry: { shape: "rect", x: 114, y: 335, width: 80, height: 64 },
      properties: { boothCode: "D101", name: "Booth D101", color: "#4A90D9", zIndex: 1, area: 5120 },
    },
    {
      id: "elem-015",
      type: "booth",
      geometry: { shape: "rect", x: 198, y: 335, width: 80, height: 64 },
      properties: { boothCode: "D102", name: "Booth D102", color: "#E74C3C", zIndex: 1, area: 5120 },
    },
    {
      id: "elem-016",
      type: "booth",
      geometry: { shape: "rect", x: 282, y: 335, width: 80, height: 64 },
      properties: { boothCode: "D103", name: "Booth D103", color: "#4A90D9", zIndex: 1, area: 5120 },
    },
    // Row D — left side, row 4
    {
      id: "elem-017",
      type: "booth",
      geometry: { shape: "rect", x: 114, y: 403, width: 80, height: 64 },
      properties: { boothCode: "D104", name: "Booth D104", color: "#4A90D9", zIndex: 1, area: 5120 },
    },
    {
      id: "elem-018",
      type: "booth",
      geometry: { shape: "rect", x: 198, y: 403, width: 80, height: 64 },
      properties: { boothCode: "D105", name: "Booth D105", color: "#4A90D9", zIndex: 1, area: 5120 },
    },
    // Non-booth elements
    {
      id: "elem-006",
      type: "session_area",
      geometry: { shape: "rect", x: 100, y: 500, width: 326, height: 202, rotation: 0 },
      properties: { name: "Keynote Stage", color: "#27AE60", zIndex: 0, capacity: 500, sessionId: "TALK-001" },
    },
    {
      id: "elem-007",
      type: "meeting_room",
      geometry: { shape: "rect", x: 514, y: 374, width: 273, height: 106, rotation: 0 },
      properties: { name: "Meeting Room 1", color: "#F39C12", zIndex: 0, capacity: 20, meetingRoomId: "ROOM-001" },
    },
    {
      id: "elem-008",
      type: "walkway",
      geometry: { shape: "rect", x: 426, y: 363, width: 72, height: 337, rotation: 0 },
      properties: { name: "Main Aisle", color: "#ECF0F1", zIndex: -1 },
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
  backgroundImage: {
    url: bgImage,
    width: 1200,
    height: 800,
    opacity: 0.42,
  },
  metadata: {
    createdAt: "2026-03-29T12:00:00Z",
    updatedAt: "2026-03-29T12:00:00Z",
    scale: 1.0,
  },
};
