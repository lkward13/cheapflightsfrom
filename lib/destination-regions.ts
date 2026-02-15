/**
 * Classifies international IATA airport codes into world regions.
 * US domestic airports are handled separately by isDomestic() in metro-data.ts.
 */

export type DestRegion =
  | "domestic"
  | "canada"
  | "mexico_caribbean"
  | "south_america"
  | "europe"
  | "asia_pacific"
  | "africa_middle_east";

export const REGION_LABELS: Record<DestRegion, string> = {
  domestic: "US Domestic",
  canada: "Canada",
  mexico_caribbean: "Mexico & Caribbean",
  south_america: "Central & South America",
  europe: "Europe",
  asia_pacific: "Asia & Pacific",
  africa_middle_east: "Africa & Middle East",
};

export const REGION_EMOJI: Record<DestRegion, string> = {
  domestic: "🇺🇸",
  canada: "🇨🇦",
  mexico_caribbean: "🌴",
  south_america: "🌎",
  europe: "🏰",
  asia_pacific: "🌏",
  africa_middle_east: "🌍",
};

// ---- Canada ----
const CANADA = new Set([
  "YYZ", "YVR", "YYC", "YUL", "YOW", "YWG", "YEG", "YHZ", "YYJ", "YLW",
  "YQR", "YXE", "YQM", "YXU", "YQB", "YYR", "YFC", "YQX", "YQG", "YXY",
  "YZF", "YQT", "YTS", "YVO", "YKA", "YXS", "YPR", "YXC",
]);

// ---- Mexico & Caribbean (includes Central America) ----
const MEXICO_CARIBBEAN = new Set([
  // Mexico
  "CUN", "MEX", "GDL", "MTY", "PVR", "SJD", "CZM", "ZIH", "ACA", "HUX",
  "QRO", "SLP", "AGU", "BJX", "TIJ", "MID", "OAX", "VSA", "TAM", "CTM",
  "CUU", "HMO", "MZT", "PXM", "MLM", "LAP", "ZLO", "TRC", "AGS", "CME",
  // Caribbean
  "SJU", "PUJ", "MBJ", "NAS", "GCM", "KIN", "SDQ", "HAV", "STI", "POP",
  "AUA", "CUR", "BON", "SXM", "POS", "BGI", "GND", "UVF", "STT", "STX",
  "EIS", "TAB", "ANU", "SKB", "DOM", "SLU", "GEO",
  // Central America
  "GUA", "SAL", "SJO", "LIR", "PTY", "BZE", "MGA", "TGU", "SAP", "RTB",
]);

// ---- South America ----
const SOUTH_AMERICA = new Set([
  "BOG", "CLO", "CTG", "MDE", "UIO", "GYE", "LIM", "CUZ", "SCL",
  "EZE", "GRU", "GIG", "MVD", "CWB", "POA", "REC", "SSA", "BSB",
  "GYN", "FOR", "VVI", "ASU", "MAO", "COR", "BEL", "CNF", "FLN",
  "IGU", "NAT", "AEP", "CCS", "PMV", "SDU", "VCP", "CGH", "SLA",
  "MDZ", "BRC", "ROS", "CBB", "LPB", "PBM", "CAY",
]);

// ---- Europe ----
const EUROPE = new Set([
  // Western Europe
  "LHR", "LGW", "STN", "LTN", "MAN", "EDI", "BHX", "BRS", "GLA",
  "CDG", "ORY", "NCE", "LYS", "MRS", "TLS", "NTE", "BOD",
  "AMS", "BRU", "LUX",
  "FRA", "MUC", "DUS", "HAM", "BER", "CGN", "STR", "TXL", "SXF",
  "ZRH", "GVA", "BSL",
  // Southern Europe
  "MAD", "BCN", "AGP", "PMI", "VLC", "SVQ", "BIO", "IBZ", "ACE", "TFS",
  "LIS", "OPO", "FAO",
  "FCO", "MXP", "VCE", "NAP", "BGY", "BLQ", "PSA", "CTA", "PMO",
  "ATH", "SKG", "HER", "RHO", "CFU", "JMK", "JTR",
  // Nordic
  "CPH", "ARN", "OSL", "HEL", "GOT", "BMA", "TRD", "BGO", "KEF",
  // Central/Eastern Europe
  "PRG", "WAW", "BUD", "BEG", "OTP", "SOF", "ZAG", "LJU", "SPU",
  "DBV", "VIE", "KRK", "GDN", "WRO", "CLJ", "TSR", "KTW",
  // Turkey (European side + transcontinental)
  "IST", "SAW", "ADB", "AYT", "ESB", "DLM", "BJV",
  // Baltics
  "TLL", "RIX", "VNO",
]);

// ---- Asia & Pacific ----
const ASIA_PACIFIC = new Set([
  // East Asia
  "NRT", "HND", "KIX", "NGO", "FUK", "CTS", "OKA",
  "ICN", "GMP",
  "PVG", "PEK", "CAN", "SZX", "CTU", "HKG", "TPE", "KHH",
  // Southeast Asia
  "BKK", "DMK", "CNX", "HKT",
  "SIN",
  "KUL", "PEN", "LGK", "KCH", "BKI",
  "CGK", "DPS", "SUB",
  "MNL", "CEB",
  "SGN", "HAN", "DAD",
  "RGN", "VTE", "PNH", "REP", "BWN",
  // South Asia
  "DEL", "BOM", "BLR", "HYD", "MAA", "CCU", "COK", "AMD", "GOI",
  "TRV", "LHE", "ISB", "KHI", "DAC", "CMB", "KTM",
  // Oceania
  "SYD", "MEL", "BNE", "PER", "ADL", "OOL", "CNS",
  "AKL", "WLG", "CHC", "ZQN",
  "NAN", "PPT", "NOU",
]);

// ---- Africa & Middle East ----
const AFRICA_MIDDLE_EAST = new Set([
  // Middle East
  "DXB", "AUH", "DOH", "RUH", "JED", "DMM", "KWI", "BAH", "MCT",
  "AMM", "BEY", "TLV", "CAI", "SHJ",
  "BGW", "EBL", "DAM",
  // North Africa
  "ALG", "CMN", "TUN", "RAK", "FEZ",
  // Sub-Saharan Africa
  "JNB", "CPT", "DUR", "NBO", "DAR", "ADD", "EBB", "ACC", "LOS",
  "ABJ", "TNR",
]);

const REGION_SETS: [Set<string>, DestRegion][] = [
  [CANADA, "canada"],
  [MEXICO_CARIBBEAN, "mexico_caribbean"],
  [SOUTH_AMERICA, "south_america"],
  [EUROPE, "europe"],
  [ASIA_PACIFIC, "asia_pacific"],
  [AFRICA_MIDDLE_EAST, "africa_middle_east"],
];

import { isDomestic } from "./metro-data";

/** Classify a destination IATA code into a world region */
export function getDestRegion(iata: string): DestRegion {
  const code = iata.trim();
  if (isDomestic(code)) return "domestic";
  for (const [set, region] of REGION_SETS) {
    if (set.has(code)) return region;
  }
  // Heuristic fallback: Canadian airports start with Y
  if (code.startsWith("Y")) return "canada";
  // Default to international catch-all
  return "europe"; // most unmapped codes in our data tend to be European
}

/** Regions in display order */
export const REGION_ORDER: DestRegion[] = [
  "domestic",
  "canada",
  "mexico_caribbean",
  "south_america",
  "europe",
  "asia_pacific",
  "africa_middle_east",
];
