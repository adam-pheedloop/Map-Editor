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

import logoHarbor from "./logos/harbor.svg";
import logoLantern from "./logos/lantern.svg";
import logoVortex from "./logos/vortex.svg";
import logoQuantum from "./logos/quantum.svg";
import logoLumina from "./logos/lumina.svg";
import logoCobalt from "./logos/cobalt.svg";
import logoEclipse from "./logos/eclipse.svg";
import logoParagon from "./logos/paragon.svg";
import logoMeridian from "./logos/meridian.svg";
import logoMosaic from "./logos/mosaic.svg";
import logoRelay from "./logos/relay.svg";
import logoApex from "./logos/apex.svg";
import logoKinetic from "./logos/kinetic.svg";
import logoZephyr from "./logos/zephyr.svg";
import logoPolaris from "./logos/polaris.svg";
import logoDrift from "./logos/drift.svg";
import logoForge from "./logos/forge.svg";
import logoCitadel from "./logos/citadel.svg";
import logoCascade from "./logos/cascade.svg";
import logoOrbit from "./logos/orbit.svg";
import logoPrism from "./logos/prism.svg";
import logoBeacon from "./logos/beacon.svg";
import logoPinnacle from "./logos/pinnacle.svg";
import logoIronclad from "./logos/ironclad.svg";
import logoVertex from "./logos/vertex.svg";
import logoSolstice from "./logos/solstice.svg";
import logoWaypoint from "./logos/waypoint.svg";
import logoHelix from "./logos/helix.svg";
import logoSentinel from "./logos/sentinel.svg";
import logoFlare from "./logos/flare.svg";
import logoLattice from "./logos/lattice.svg";
import logoStratum from "./logos/stratum.svg";
import logoMeridian2 from "./logos/meridian2.svg";
import logoSignal from "./logos/signal.svg";
import logoAxiom from "./logos/axiom.svg";

// ── Main Exhibition Hall (alpha codes, 10 exhibitors) ─────────────────────────
export const sampleExhibitors: Exhibitor[] = [
  { id: "exh-001", name: "Acme Corp",            boothCode: "A101", logo: logoAcme },
  { id: "exh-002", name: "TechFlow Inc",          boothCode: "A102", logo: logoTechflow },
  { id: "exh-003", name: "GreenLeaf Solutions",   boothCode: "A103", logo: logoGreenleaf },
  { id: "exh-004", name: "Nexus Digital",         boothCode: "B101", logo: logoNexus },
  { id: "exh-005", name: "Horizon Events",        boothCode: "C101", logo: logoHorizon },
  { id: "exh-006", name: "CloudBridge AI",        boothCode: "C102", logo: logoCloudbridge },
  { id: "exh-007", name: "Summit Audio",          boothCode: "C104", logo: logoSummit },
  { id: "exh-008", name: "Vanguard Media",        boothCode: "D101", logo: logoVanguard },
  { id: "exh-009", name: "Pulse Analytics",       boothCode: "D103", logo: logoPulse },
  { id: "exh-010", name: "BrightPath Learning",   boothCode: "D105", logo: logoBrightpath },
];

// ── Conference & Expo Hall 2026 (numeric codes, 100 exhibitors) ───────────────
// IDs are real PheedLoop-format slugs. Booth codes match conferenceExpoBooths
// in sample-booths.ts. Unassigned booths (2, 3, 4, 6–10, etc.) have no exhibitor.
export const conferenceExpoExhibitors: Exhibitor[] = [
  { id: "EXHH5CSK30LVYLKFX", name: "Harbor Capital",              boothCode: "1",   logo: logoHarbor    },
  { id: "EXHS1K9YE9O2M71HS", name: "Lantern Advisory",            boothCode: "5",   logo: logoLantern   },
  { id: "EXHCMKTLZKJ49YD82", name: "Vortex Cybersecurity",        boothCode: "11",  logo: logoVortex    },
  { id: "EXHP2U4DTBH55RBC7", name: "Tangent Engineering",         boothCode: "12",  logo: logoForge     },
  { id: "EXH4N89QKNS832EJX", name: "Vertex Industries",           boothCode: "13",  logo: logoVertex    },
  { id: "EXHY36DDFGS3JONOU", name: "Relay Communications",        boothCode: "15",  logo: logoRelay     },
  { id: "EXH3C9XQYM52XG8P6", name: "Lumina Technologies",         boothCode: "16",  logo: logoLumina    },
  { id: "EXHYN9382KKZMPJRH", name: "Sapphire Diagnostics",        boothCode: "18",  logo: logoHelix     },
  { id: "EXHGYSPENGWYX9TRF", name: "Quantum Leap AI",             boothCode: "20",  logo: logoQuantum   },
  { id: "EXHTJ1GM25LEN606N", name: "Cobalt Manufacturing",        boothCode: "21",  logo: logoCobalt    },
  { id: "EXH1AT7O75RH8LX6D", name: "Umbra Defense",               boothCode: "24",  logo: logoSentinel  },
  { id: "EXHY8N1UTOXIE0RNU", name: "Solstice Media",              boothCode: "25",  logo: logoSolstice  },
  { id: "EXH9RR7S20CV3TLCX", name: "Eclipse Energy",              boothCode: "26",  logo: logoEclipse   },
  { id: "EXH9YO18PAJSSUUQO", name: "Keyframe Media",              boothCode: "27",  logo: logoPrism     },
  { id: "EXHJA2M0W10LBT3G2", name: "Paragon Software",            boothCode: "30",  logo: logoParagon   },
  { id: "EXH8O1BJ9RM7PYXDW", name: "Watershed Environmental",     boothCode: "31",  logo: logoZephyr    },
  { id: "EXH6UB7L8V1ZOCFI4", name: "Uplift Social",               boothCode: "32",  logo: logoSignal    },
  { id: "EXHW5WFCPKJCSLQC3", name: "Meridian Healthcare",         boothCode: "33",  logo: logoMeridian  },
  { id: "EXH1RSRLA8S8HMBR5", name: "Jasper Therapeutics",         boothCode: "35",  logo: logoHelix     },
  { id: "EXHVWVM4W3ZKWDEEK", name: "Pipeline Energy",             boothCode: "36",  logo: logoEclipse   },
  { id: "EXH0WFOY4DD1VN8LF", name: "Deepwater Energy",            boothCode: "37",  logo: logoHarbor    },
  { id: "EXHMUFM8ZOV7LN23Y", name: "NovaTech Systems",            boothCode: "38",  logo: logoDrift     },
  { id: "EXHFHV1XG1R11Q7UW", name: "Apex Solutions",              boothCode: "39",  logo: logoApex      },
  { id: "EXHGFU8IOGXPBWHVN", name: "Northgate Medical",           boothCode: "40",  logo: logoMeridian2 },
  { id: "EXH3OEUVTYT8QZPKY", name: "Highpoint Analytics",         boothCode: "42",  logo: logoStratum   },
  { id: "EXH6NOUHFJ7UPFLN4", name: "Navigate Financial",          boothCode: "43",  logo: logoCitadel   },
  { id: "EXHC54WSQT26Q3XLR", name: "Stellar Communications",      boothCode: "44",  logo: logoSignal    },
  { id: "EXH9N56NYXTXMGTT0", name: "Echo Analytics",              boothCode: "45",  logo: logoDrift     },
  { id: "EXH3P15AHDBVZB0OI", name: "Glacier Pharma",              boothCode: "46",  logo: logoHelix     },
  { id: "EXHH6T1NTMJSRD9Q4", name: "Momentum Healthcare",         boothCode: "48",  logo: logoWaypoint  },
  { id: "EXH795E5IZ31YRUJO", name: "Wavefront Imaging",           boothCode: "52",  logo: logoOrbit     },
  { id: "EXHQXMCTHPHJ3MUUR", name: "Yellowstone Environmental",   boothCode: "55",  logo: logoWaypoint  },
  { id: "EXH2ZCFZW0LDALMJE", name: "Crossroads Ventures",         boothCode: "56",  logo: logoAxiom     },
  { id: "EXHBMC97C7BO119XP", name: "Drift Technologies",          boothCode: "57",  logo: logoDrift     },
  { id: "EXHIUI9KKHZLM72JE", name: "Radius Cybersecurity",        boothCode: "58",  logo: logoIronclad  },
  { id: "EXHNWYWRRATATJ9A3", name: "Quorum Data",                  boothCode: "59",  logo: logoLattice   },
  { id: "EXHSBELRQVSLWF90K", name: "Mosaic Creative",             boothCode: "60",  logo: logoMosaic    },
  { id: "EXH0UR5L8A78E9RIV", name: "Lattice Materials",           boothCode: "63",  logo: logoLattice   },
  { id: "EXH1VSMADO8E7FLQH", name: "Landmark Real Estate",        boothCode: "66",  logo: logoBeacon    },
  { id: "EXHCCPRHVLZ049ENU", name: "Halcyon Systems",             boothCode: "67",  logo: logoSentinel  },
  { id: "EXHXQT4P501NOUHTC", name: "Keystone Engineering",        boothCode: "68",  logo: logoCobalt    },
  { id: "EXH3N3BZT9D31K9QM", name: "Threadneedle Finance",        boothCode: "69",  logo: logoStratum   },
  { id: "EXHMABSI9NB74X2EK", name: "Atlas Consulting",            boothCode: "72",  logo: logoAxiom     },
  { id: "EXHRXYJ38XRG2GZR7", name: "Onyx Defense",                boothCode: "74",  logo: logoIronclad  },
  { id: "EXHIAAKYTT3IMJ70E", name: "Forge Manufacturing",         boothCode: "75",  logo: logoForge     },
  { id: "EXHLQJIDKNWI5FLUL", name: "Icefall Analytics",           boothCode: "77",  logo: logoCascade   },
  { id: "EXHLQBMAE38SRYO4R", name: "Riviera Hospitality",         boothCode: "79",  logo: logoSolstice  },
  { id: "EXH5TD44K1J6FP8HQ", name: "Prism Marketing",            boothCode: "80",  logo: logoPrism     },
  { id: "EXH0DL5E11E9FTAXP", name: "Clarity Analytics",           boothCode: "81",  logo: logoOrbit     },
  { id: "EXH3P91I3VMZWFFHH", name: "Upstream Biotech",            boothCode: "82",  logo: logoHelix     },
  { id: "EXHDS3QSQCQ30O30U", name: "Citadel Security",            boothCode: "83",  logo: logoCitadel   },
  { id: "EXHGQTOAMDVLNKND6", name: "Dynamo Systems",              boothCode: "84",  logo: logoKinetic   },
  { id: "EXHRRPZLK3E4XYF9I", name: "Milestone Capital",           boothCode: "85",  logo: logoPinnacle  },
  { id: "EXHXUX1OXRWK8R2YK", name: "Griffin Automation",          boothCode: "86",  logo: logoKinetic   },
  { id: "EXH7YT2M6TWD1XMXB", name: "Jetstream Aviation",          boothCode: "87",  logo: logoPolaris   },
  { id: "EXH32ORWIXZ2C9ROS", name: "Interchange Logistics",       boothCode: "89",  logo: logoBeacon    },
  { id: "EXHQW5DSK7N8LA100", name: "Xcelerate Performance",       boothCode: "90",  logo: logoApex      },
  { id: "EXHKTSG7FXZV4U3BB", name: "Emerald Sustainability",      boothCode: "91",  logo: logoZephyr    },
  { id: "EXHZAREIYAZ39PECN", name: "Brightside Healthcare",        boothCode: "92",  logo: logoWaypoint  },
  { id: "EXHCB1KJTGQ01TEE1", name: "Scaffold Construction",       boothCode: "94",  logo: logoForge     },
  { id: "EXHT7ZEWVIYTWBOZD", name: "Tempest Aviation",            boothCode: "95",  logo: logoPolaris   },
  { id: "EXHFCD6MZSGIPPSFN", name: "Quantum Analytics",           boothCode: "96",  logo: logoQuantum   },
  { id: "EXHHKC856WPR97Y2L", name: "Ignite Marketing",            boothCode: "97",  logo: logoFlare     },
  { id: "EXH3FPOYIPK0QTL3Q", name: "Summit Financial",            boothCode: "100", logo: logoPinnacle  },
  { id: "EXH9EL8HL88KZRUIN", name: "Groundwork Infrastructure",   boothCode: "103", logo: logoForge     },
  { id: "EXHO6L1F90S9BP4M1", name: "Vector Genomics",             boothCode: "104", logo: logoHelix     },
  { id: "EXH4LMCT64Z7W2SEH", name: "Arcadia Healthcare",          boothCode: "105", logo: logoMeridian2 },
  { id: "EXHR821UZVGWW4FYB", name: "Olympus Capital",             boothCode: "106", logo: logoHarbor    },
  { id: "EXHYCELOS6ZLE6KWH", name: "Zephyr Clean Energy",         boothCode: "107", logo: logoZephyr    },
  { id: "EXH69UGNEKRCPPRCJ", name: "Element Life Sciences",       boothCode: "109", logo: logoHelix     },
  { id: "EXHIWVHDK8LW2LM34", name: "Foundry Partners",            boothCode: "110", logo: logoLantern   },
  { id: "EXHKOMV2XCDYK0X65", name: "Pinnacle Engineering",        boothCode: "112", logo: logoPinnacle  },
  { id: "EXHKBP2QD6VASIFPW", name: "Ironclad Security",           boothCode: "113", logo: logoIronclad  },
  { id: "EXHN2Y8FV2BC2NNUV", name: "Vanguard Aerospace",          boothCode: "114", logo: logoPolaris   },
  { id: "EXHZH13CD5GLQJ5SX", name: "Origin Technology",           boothCode: "115", logo: logoOrbit     },
  { id: "EXHEF0VOTQTXHI15C", name: "Acorn Biomedical",            boothCode: "116", logo: logoMeridian2 },
  { id: "EXHOFN1R4KZ36U8UE", name: "Junction Software",           boothCode: "117", logo: logoParagon   },
  { id: "EXHQZCUCTSUFLSEHU", name: "Beacon Logistics",            boothCode: "118", logo: logoBeacon    },
  { id: "EXHEFQJG02U1G463S", name: "Xenith Medical",              boothCode: "119", logo: logoHelix     },
  { id: "EXH9IY4X41DNTCAGR", name: "Sienna Agriculture",          boothCode: "121", logo: logoWaypoint  },
  { id: "EXHLXSLG6MM1ZXYVG", name: "Quasar Networks",             boothCode: "122", logo: logoSignal    },
  { id: "EXHOLMLGSES6M033I", name: "TechVentures Inc.",           boothCode: "123", logo: logoDrift     },
  { id: "EXHC4D145BM1ENF31", name: "Horizon Medical",             boothCode: "124", logo: logoMeridian  },
  { id: "EXH75AUD9K9TR74QG", name: "Wildfire Communications",     boothCode: "125", logo: logoFlare     },
  { id: "EXHQZW3C1QKBHB7S9", name: "Redwood Pharmaceuticals",     boothCode: "126", logo: logoMeridian2 },
  { id: "EXHLVPYMB5M9J98CW", name: "Polaris Logistics",           boothCode: "129", logo: logoPolaris   },
  { id: "EXHE2ATN2TWDL9ZS1", name: "Titan Construction",          boothCode: "130", logo: logoForge     },
  { id: "EXHIHX74D0GJYV5G1", name: "Kinetic Robotics",            boothCode: "132", logo: logoKinetic   },
  { id: "EXHMYBD2QE4PA8HYE", name: "Zeal Marketing",              boothCode: "135", logo: logoFlare     },
  { id: "EXH3ZEZQACJ4T0SEK", name: "Nexus Biotech",               boothCode: "137", logo: logoHelix     },
  { id: "EXHXF7JXJN6FOKZIX", name: "Archway Consulting",          boothCode: "139", logo: logoAxiom     },
  { id: "EXHDYGFLIJI18K0AX", name: "Yield Analytics",             boothCode: "140", logo: logoStratum   },
  { id: "EXHUT076G5G79OR78", name: "Valor Financial",             boothCode: "141", logo: logoCitadel   },
  { id: "EXHIOXD9CSS9TOQW9", name: "BlueSky Robotics",            boothCode: "143", logo: logoKinetic   },
  { id: "EXHM3TZK3NY9V20YA", name: "Nautilus Marine",             boothCode: "144", logo: logoHarbor    },
  { id: "EXH30YSXPNNGH8RIE", name: "Cascade Digital",             boothCode: "145", logo: logoCascade   },
  { id: "EXHJJQ9K6RE4Q6QDY", name: "Zenith Instruments",          boothCode: "147", logo: logoParagon   },
  { id: "EXHBEFFLZM764JWTE", name: "Orbit Data",                  boothCode: "148", logo: logoOrbit     },
  { id: "EXH8DALFYO1750CEH", name: "Prestige Genomics",           boothCode: "149", logo: logoHelix     },
  { id: "EXHTXCB48Y1O4IZAS", name: "Pathfinder Consulting",       boothCode: "150", logo: logoWaypoint  },
];
