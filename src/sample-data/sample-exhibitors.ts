import type { Exhibitor } from "../viewer/types";

import logoAcme from "./logos/acme-corp.svg";
import logoTechflow from "./logos/techflow.svg";
import logoGreenleaf from "./logos/greenleaf.svg";
import logoNexus from "./logos/nexus.svg";
import logoHorizon from "./logos/horizon.svg";
import logoCloudbridge from "./logos/cloudbridge.svg";
import logoSummit from "./logos/summit.svg";
import logoVanguard from "./logos/vanguard.svg";
import logoPulse from "./logos/pulse.svg";
import logoBrightpath from "./logos/brightpath.svg";

export const sampleExhibitors: Exhibitor[] = [
  { id: "exh-001", name: "Acme Corp", boothCode: "A101", logo: logoAcme },
  { id: "exh-002", name: "TechFlow Inc", boothCode: "A102", logo: logoTechflow },
  { id: "exh-003", name: "GreenLeaf Solutions", boothCode: "A103", logo: logoGreenleaf },
  { id: "exh-004", name: "Nexus Digital", boothCode: "B101", logo: logoNexus },
  { id: "exh-005", name: "Horizon Events", boothCode: "C101", logo: logoHorizon },
  { id: "exh-006", name: "CloudBridge AI", boothCode: "C102", logo: logoCloudbridge },
  { id: "exh-007", name: "Summit Audio", boothCode: "C104", logo: logoSummit },
  { id: "exh-008", name: "Vanguard Media", boothCode: "D101", logo: logoVanguard },
  { id: "exh-009", name: "Pulse Analytics", boothCode: "D103", logo: logoPulse },
  { id: "exh-010", name: "BrightPath Learning", boothCode: "D105", logo: logoBrightpath },
];
