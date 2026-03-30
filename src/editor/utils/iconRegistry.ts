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
  // Additional icons
  PiBaby, PiBicycle, PiBus, PiTaxi, PiTrain, PiAirplaneTakeoff,
  PiHouse, PiBuildings, PiTent, PiPark,
  PiSun, PiMoon, PiCloudRain, PiSnowflake, PiWind,
  PiHandshake, PiUsers, PiUserCircle, PiMegaphone,
  PiShoppingCart, PiTShirt, PiBackpack, PiSuitcase,
  PiGameController, PiBalloon, PiConfetti, PiCrown,
  PiRocket, PiAlien, PiGhost, PiSkull, PiCat,
  PiHamburger, PiPizza, PiBeerBottle, PiWine, PiCookingPot,
  PiScissors, PiPaintBrush, PiPencil, PiNotebook,
  PiMedal, PiTrophy, PiTarget, PiSoccerBall,
  PiGlobe, PiCompass, PiBinoculars, PiMountains,
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

  // Transport
  { id: "PiBicycle", label: "Bicycle", category: "Transport", keywords: ["bike", "cycling", "ride"], component: PiBicycle },
  { id: "PiBus", label: "Bus", category: "Transport", keywords: ["shuttle", "transit", "public"], component: PiBus },
  { id: "PiTaxi", label: "Taxi", category: "Transport", keywords: ["cab", "rideshare", "uber"], component: PiTaxi },
  { id: "PiTrain", label: "Train", category: "Transport", keywords: ["rail", "subway", "metro"], component: PiTrain },
  { id: "PiAirplaneTakeoff", label: "Airplane", category: "Transport", keywords: ["flight", "airport", "travel"], component: PiAirplaneTakeoff },

  // Venues
  { id: "PiHouse", label: "House", category: "Venues", keywords: ["home", "building", "residence"], component: PiHouse },
  { id: "PiBuildings", label: "Buildings", category: "Venues", keywords: ["city", "office", "downtown"], component: PiBuildings },
  { id: "PiTent", label: "Tent", category: "Venues", keywords: ["camping", "outdoor", "festival"], component: PiTent },
  { id: "PiPark", label: "Park", category: "Venues", keywords: ["outdoor", "garden", "bench"], component: PiPark },

  // Weather
  { id: "PiSun", label: "Sun", category: "Weather", keywords: ["sunny", "bright", "outdoor"], component: PiSun },
  { id: "PiMoon", label: "Moon", category: "Weather", keywords: ["night", "evening"], component: PiMoon },
  { id: "PiCloudRain", label: "Rain", category: "Weather", keywords: ["weather", "wet", "umbrella"], component: PiCloudRain },
  { id: "PiSnowflake", label: "Snowflake", category: "Weather", keywords: ["cold", "winter", "ice"], component: PiSnowflake },
  { id: "PiWind", label: "Wind", category: "Weather", keywords: ["breeze", "air", "ventilation"], component: PiWind },

  // People
  { id: "PiBaby", label: "Baby", category: "People", keywords: ["child", "infant", "family", "changing"], component: PiBaby },
  { id: "PiHandshake", label: "Handshake", category: "People", keywords: ["meeting", "partnership", "deal"], component: PiHandshake },
  { id: "PiUsers", label: "Group", category: "People", keywords: ["team", "people", "crowd", "networking"], component: PiUsers },
  { id: "PiUserCircle", label: "Person", category: "People", keywords: ["user", "profile", "attendee"], component: PiUserCircle },
  { id: "PiMegaphone", label: "Megaphone", category: "People", keywords: ["announcement", "speaker", "broadcast"], component: PiMegaphone },

  // Shopping
  { id: "PiShoppingCart", label: "Shopping Cart", category: "Shopping", keywords: ["buy", "store", "retail", "merch"], component: PiShoppingCart },
  { id: "PiTShirt", label: "T-Shirt", category: "Shopping", keywords: ["clothing", "merch", "apparel", "swag"], component: PiTShirt },
  { id: "PiBackpack", label: "Backpack", category: "Shopping", keywords: ["bag", "storage", "coat check"], component: PiBackpack },
  { id: "PiSuitcase", label: "Suitcase", category: "Shopping", keywords: ["luggage", "travel", "baggage"], component: PiSuitcase },

  // Fun & Entertainment
  { id: "PiGameController", label: "Game Controller", category: "Fun", keywords: ["gaming", "play", "arcade", "entertainment"], component: PiGameController },
  { id: "PiBalloon", label: "Balloon", category: "Fun", keywords: ["party", "celebration", "festival"], component: PiBalloon },
  { id: "PiConfetti", label: "Confetti", category: "Fun", keywords: ["party", "celebration", "win"], component: PiConfetti },
  { id: "PiCrown", label: "Crown", category: "Fun", keywords: ["vip", "royalty", "premium", "king"], component: PiCrown },
  { id: "PiRocket", label: "Rocket", category: "Fun", keywords: ["launch", "startup", "space"], component: PiRocket },
  { id: "PiAlien", label: "Alien", category: "Fun", keywords: ["space", "extraterrestrial", "ufo"], component: PiAlien },
  { id: "PiGhost", label: "Ghost", category: "Fun", keywords: ["spooky", "halloween", "haunted"], component: PiGhost },
  { id: "PiSkull", label: "Skull", category: "Fun", keywords: ["danger", "pirate", "halloween"], component: PiSkull },
  { id: "PiCat", label: "Cat", category: "Fun", keywords: ["pet", "animal", "feline"], component: PiCat },

  // Food & Drink (expanded)
  { id: "PiHamburger", label: "Hamburger", category: "Food & Drink", keywords: ["burger", "fast food", "meal"], component: PiHamburger },
  { id: "PiPizza", label: "Pizza", category: "Food & Drink", keywords: ["food", "slice", "italian"], component: PiPizza },
  { id: "PiBeerBottle", label: "Beer", category: "Food & Drink", keywords: ["alcohol", "pub", "bar", "drink"], component: PiBeerBottle },
  { id: "PiWine", label: "Wine", category: "Food & Drink", keywords: ["alcohol", "glass", "bar", "drink"], component: PiWine },
  { id: "PiCookingPot", label: "Cooking Pot", category: "Food & Drink", keywords: ["kitchen", "catering", "chef"], component: PiCookingPot },

  // Creative
  { id: "PiScissors", label: "Scissors", category: "Creative", keywords: ["cut", "craft", "workshop"], component: PiScissors },
  { id: "PiPaintBrush", label: "Paint Brush", category: "Creative", keywords: ["art", "painting", "design"], component: PiPaintBrush },
  { id: "PiPencil", label: "Pencil", category: "Creative", keywords: ["write", "draw", "edit"], component: PiPencil },
  { id: "PiNotebook", label: "Notebook", category: "Creative", keywords: ["notes", "journal", "writing"], component: PiNotebook },

  // Sports & Awards
  { id: "PiMedal", label: "Medal", category: "Sports", keywords: ["award", "winner", "achievement"], component: PiMedal },
  { id: "PiTrophy", label: "Trophy", category: "Sports", keywords: ["award", "winner", "champion", "cup"], component: PiTrophy },
  { id: "PiTarget", label: "Target", category: "Sports", keywords: ["goal", "aim", "bullseye"], component: PiTarget },
  { id: "PiSoccerBall", label: "Soccer Ball", category: "Sports", keywords: ["football", "sport", "game"], component: PiSoccerBall },

  // Exploration
  { id: "PiGlobe", label: "Globe", category: "Exploration", keywords: ["world", "earth", "international"], component: PiGlobe },
  { id: "PiCompass", label: "Compass", category: "Exploration", keywords: ["direction", "navigation", "orient"], component: PiCompass },
  { id: "PiBinoculars", label: "Binoculars", category: "Exploration", keywords: ["view", "observe", "lookout"], component: PiBinoculars },
  { id: "PiMountains", label: "Mountains", category: "Exploration", keywords: ["outdoor", "hiking", "landscape"], component: PiMountains },
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
