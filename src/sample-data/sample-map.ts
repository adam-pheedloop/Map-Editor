import type { FloorPlanData } from "../types";
import bgImage from "./Empty Exhibit Hall.png";
import rawData from "./Main_Exhibition_Hall.json";

export const sampleMap: FloorPlanData = {
  ...(rawData as unknown as FloorPlanData),
  backgroundImage: rawData.backgroundImage
    ? { ...rawData.backgroundImage, url: bgImage }
    : undefined,
};
