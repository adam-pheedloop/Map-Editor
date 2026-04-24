import type { FloorPlanData } from "../types";
import bgImage from "./Floor Plan.png";
import rawData from "./Exhibition Hall.json";

export const exhibitionHallMap: FloorPlanData = {
  ...(rawData as unknown as FloorPlanData),
  backgroundImage: rawData.backgroundImage
    ? { ...rawData.backgroundImage, url: bgImage }
    : undefined,
};
