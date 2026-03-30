import type { IconType } from "react-icons";
import {
  PiToilet, PiWheelchair, PiElevator, PiStairs, PiCar, PiDoor,
  PiFirstAid, PiFireExtinguisher, PiWarning, PiShield,
  PiInfo, PiCamera, PiForkKnife, PiCoffee, PiWifiHigh, PiPlug, PiMicrophone,
  PiArrowRight, PiMapPin, PiStar, PiFlag, PiSignpost,
  PiSquare, PiCircle, PiTriangle, PiHeart, PiDiamond,
  PiTicket, PiGift, PiPhone, PiEnvelope, PiPrinter,
  PiTrash, PiRecycle, PiTree, PiFlower, PiDog,
  PiLock, PiKey, PiClock, PiCalendar, PiBell,
  PiLightning, PiCarBattery, PiThermometer, PiDrop,
  PiMusicNote, PiSpeakerHigh, PiMonitor, PiPresentation,
} from "react-icons/pi";

export interface IconEntry {
  id: string;
  label: string;
  category: string;
  keywords: string[];
  component: IconType;
}

export const iconRegistry: IconEntry[] = [
  // Facilities
  { id: "PiToilet", label: "Toilet", category: "Facilities", keywords: ["restroom", "bathroom", "wc", "washroom"], component: PiToilet },
  { id: "PiWheelchair", label: "Wheelchair", category: "Facilities", keywords: ["accessible", "disability", "handicap"], component: PiWheelchair },
  { id: "PiElevator", label: "Elevator", category: "Facilities", keywords: ["lift"], component: PiElevator },
  { id: "PiStairs", label: "Stairs", category: "Facilities", keywords: ["steps", "staircase"], component: PiStairs },
  { id: "PiCar", label: "Parking", category: "Facilities", keywords: ["car", "vehicle", "garage"], component: PiCar },
  { id: "PiDoor", label: "Door", category: "Facilities", keywords: ["entrance", "exit", "entry"], component: PiDoor },
  { id: "PiTrash", label: "Trash", category: "Facilities", keywords: ["garbage", "waste", "bin"], component: PiTrash },
  { id: "PiRecycle", label: "Recycle", category: "Facilities", keywords: ["recycling", "green"], component: PiRecycle },

  // Safety
  { id: "PiFirstAid", label: "First Aid", category: "Safety", keywords: ["medical", "health", "cross", "emergency"], component: PiFirstAid },
  { id: "PiFireExtinguisher", label: "Fire Extinguisher", category: "Safety", keywords: ["fire", "safety", "emergency"], component: PiFireExtinguisher },
  { id: "PiWarning", label: "Warning", category: "Safety", keywords: ["caution", "danger", "alert"], component: PiWarning },
  { id: "PiShield", label: "Shield", category: "Safety", keywords: ["security", "protection", "guard"], component: PiShield },

  // Services
  { id: "PiInfo", label: "Information", category: "Services", keywords: ["info", "help", "desk"], component: PiInfo },
  { id: "PiCamera", label: "Camera", category: "Services", keywords: ["photo", "photography"], component: PiCamera },
  { id: "PiForkKnife", label: "Food & Drink", category: "Services", keywords: ["restaurant", "dining", "eat", "meal"], component: PiForkKnife },
  { id: "PiCoffee", label: "Coffee", category: "Services", keywords: ["cafe", "beverage", "drink", "tea"], component: PiCoffee },
  { id: "PiWifiHigh", label: "Wi-Fi", category: "Services", keywords: ["internet", "wireless", "network"], component: PiWifiHigh },
  { id: "PiPlug", label: "Power", category: "Services", keywords: ["electric", "charging", "outlet", "socket"], component: PiPlug },
  { id: "PiMicrophone", label: "Microphone", category: "Services", keywords: ["mic", "audio", "speaker", "stage"], component: PiMicrophone },
  { id: "PiPhone", label: "Phone", category: "Services", keywords: ["telephone", "call", "contact"], component: PiPhone },
  { id: "PiEnvelope", label: "Mail", category: "Services", keywords: ["email", "letter", "post"], component: PiEnvelope },
  { id: "PiPrinter", label: "Printer", category: "Services", keywords: ["print", "copy"], component: PiPrinter },
  { id: "PiTicket", label: "Ticket", category: "Services", keywords: ["registration", "pass", "admission"], component: PiTicket },
  { id: "PiGift", label: "Gift", category: "Services", keywords: ["prize", "present", "swag"], component: PiGift },

  // Navigation
  { id: "PiArrowRight", label: "Arrow", category: "Navigation", keywords: ["direction", "pointer", "right"], component: PiArrowRight },
  { id: "PiMapPin", label: "Map Pin", category: "Navigation", keywords: ["location", "marker", "pin", "place"], component: PiMapPin },
  { id: "PiStar", label: "Star", category: "Navigation", keywords: ["favorite", "featured", "important"], component: PiStar },
  { id: "PiFlag", label: "Flag", category: "Navigation", keywords: ["marker", "checkpoint", "milestone"], component: PiFlag },
  { id: "PiSignpost", label: "Sign", category: "Navigation", keywords: ["direction", "signpost", "wayfinding"], component: PiSignpost },

  // Nature
  { id: "PiTree", label: "Tree", category: "Nature", keywords: ["outdoor", "garden", "plant", "park"], component: PiTree },
  { id: "PiFlower", label: "Flower", category: "Nature", keywords: ["garden", "plant", "floral"], component: PiFlower },
  { id: "PiDog", label: "Pet", category: "Nature", keywords: ["pet", "animal", "dog", "cat"], component: PiDog },
  { id: "PiDrop", label: "Water", category: "Nature", keywords: ["drop", "fountain", "hydration"], component: PiDrop },

  // Tech & AV
  { id: "PiMusicNote", label: "Music", category: "Tech & AV", keywords: ["audio", "sound", "concert"], component: PiMusicNote },
  { id: "PiSpeakerHigh", label: "Speaker", category: "Tech & AV", keywords: ["audio", "sound", "volume"], component: PiSpeakerHigh },
  { id: "PiMonitor", label: "Monitor", category: "Tech & AV", keywords: ["screen", "display", "tv"], component: PiMonitor },
  { id: "PiPresentation", label: "Projector", category: "Tech & AV", keywords: ["presentation", "screen", "display"], component: PiPresentation },
  { id: "PiLightning", label: "Lightning", category: "Tech & AV", keywords: ["power", "electric", "energy"], component: PiLightning },
  { id: "PiCarBattery", label: "Battery", category: "Tech & AV", keywords: ["power", "charge", "energy"], component: PiCarBattery },
  { id: "PiThermometer", label: "Thermometer", category: "Tech & AV", keywords: ["temperature", "climate", "hvac"], component: PiThermometer },

  // General
  { id: "PiSquare", label: "Square", category: "General", keywords: ["shape", "box"], component: PiSquare },
  { id: "PiCircle", label: "Circle", category: "General", keywords: ["shape", "round"], component: PiCircle },
  { id: "PiTriangle", label: "Triangle", category: "General", keywords: ["shape"], component: PiTriangle },
  { id: "PiHeart", label: "Heart", category: "General", keywords: ["love", "favorite", "like"], component: PiHeart },
  { id: "PiDiamond", label: "Diamond", category: "General", keywords: ["shape", "gem"], component: PiDiamond },
  { id: "PiLock", label: "Lock", category: "General", keywords: ["security", "private", "restricted"], component: PiLock },
  { id: "PiKey", label: "Key", category: "General", keywords: ["access", "unlock"], component: PiKey },
  { id: "PiClock", label: "Clock", category: "General", keywords: ["time", "schedule", "hours"], component: PiClock },
  { id: "PiCalendar", label: "Calendar", category: "General", keywords: ["date", "schedule", "event"], component: PiCalendar },
  { id: "PiBell", label: "Bell", category: "General", keywords: ["notification", "alert", "ring"], component: PiBell },
];

// Lookup by id
const iconMap = new Map(iconRegistry.map((entry) => [entry.id, entry]));

export function getIconEntry(id: string): IconEntry | undefined {
  return iconMap.get(id);
}

// Get unique categories in order
export function getCategories(): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const entry of iconRegistry) {
    if (!seen.has(entry.category)) {
      seen.add(entry.category);
      result.push(entry.category);
    }
  }
  return result;
}

// Search icons by label and keywords
export function searchIcons(query: string): IconEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return iconRegistry;
  return iconRegistry.filter(
    (entry) =>
      entry.label.toLowerCase().includes(q) ||
      entry.category.toLowerCase().includes(q) ||
      entry.keywords.some((kw) => kw.includes(q))
  );
}
