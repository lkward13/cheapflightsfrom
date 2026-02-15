export type Region = "south" | "west" | "midwest" | "northeast" | "southeast";

export interface Metro {
  name: string;
  displayName: string;
  slug: string;
  airports: string[];
  region: Region;
}

export const METROS: Metro[] = [
  // === Multi-Airport Metros ===
  { name: "New York City", displayName: "New York City", slug: "new-york-city", airports: ["JFK", "LGA", "EWR"], region: "northeast" },
  { name: "Chicago", displayName: "Chicago", slug: "chicago", airports: ["ORD", "MDW"], region: "midwest" },
  { name: "Dallas", displayName: "Dallas", slug: "dallas", airports: ["DFW", "DAL"], region: "south" },
  { name: "Houston", displayName: "Houston", slug: "houston", airports: ["IAH", "HOU"], region: "south" },
  { name: "Washington D.C.", displayName: "Washington, D.C.", slug: "washington-dc", airports: ["IAD", "DCA", "BWI"], region: "northeast" },
  { name: "Los Angeles", displayName: "Los Angeles", slug: "los-angeles", airports: ["LAX", "ONT", "SNA", "BUR"], region: "west" },
  { name: "San Francisco Bay", displayName: "San Francisco Bay Area", slug: "san-francisco-bay-area", airports: ["SFO", "SJC", "OAK"], region: "west" },
  { name: "Miami", displayName: "Miami", slug: "miami", airports: ["MIA", "FLL", "PBI"], region: "south" },
  { name: "Tampa Bay", displayName: "Tampa Bay Area", slug: "tampa-bay", airports: ["TPA", "SRQ", "PIE"], region: "south" },

  // === Major Single-Airport Metros ===
  { name: "Atlanta", displayName: "Atlanta", slug: "atlanta", airports: ["ATL"], region: "south" },
  { name: "Oklahoma City", displayName: "Oklahoma City", slug: "oklahoma-city", airports: ["OKC"], region: "south" },
  { name: "Minneapolis - St. Paul", displayName: "Minneapolis-St. Paul", slug: "minneapolis-st-paul", airports: ["MSP"], region: "midwest" },
  { name: "Boston", displayName: "Boston", slug: "boston", airports: ["BOS", "PVD"], region: "northeast" },
  { name: "Philadelphia", displayName: "Philadelphia", slug: "philadelphia", airports: ["PHL"], region: "northeast" },
  { name: "Denver", displayName: "Denver", slug: "denver", airports: ["DEN"], region: "west" },
  { name: "Seattle", displayName: "Seattle", slug: "seattle", airports: ["SEA"], region: "west" },
  { name: "Phoenix", displayName: "Phoenix", slug: "phoenix", airports: ["PHX", "TUS"], region: "west" },
  { name: "Las Vegas", displayName: "Las Vegas", slug: "las-vegas", airports: ["LAS"], region: "west" },
  { name: "Charlotte", displayName: "Charlotte", slug: "charlotte", airports: ["CLT"], region: "south" },
  { name: "Orlando", displayName: "Orlando", slug: "orlando", airports: ["MCO"], region: "southeast" },
  { name: "Detroit", displayName: "Detroit", slug: "detroit", airports: ["DTW"], region: "midwest" },
  { name: "Salt Lake City", displayName: "Salt Lake City", slug: "salt-lake-city", airports: ["SLC"], region: "west" },
  { name: "San Diego", displayName: "San Diego", slug: "san-diego", airports: ["SAN"], region: "west" },
  { name: "Portland", displayName: "Portland", slug: "portland", airports: ["PDX"], region: "west" },
  { name: "Nashville", displayName: "Nashville", slug: "nashville", airports: ["BNA"], region: "south" },
  { name: "St. Louis", displayName: "St. Louis", slug: "st-louis", airports: ["STL"], region: "midwest" },
  { name: "Austin", displayName: "Austin", slug: "austin", airports: ["AUS"], region: "south" },
  { name: "Raleigh", displayName: "Raleigh", slug: "raleigh", airports: ["RDU"], region: "south" },
  { name: "Sacramento", displayName: "Sacramento", slug: "sacramento", airports: ["SMF"], region: "west" },
  { name: "Kansas City", displayName: "Kansas City", slug: "kansas-city", airports: ["MCI"], region: "midwest" },
  { name: "San Antonio", displayName: "San Antonio", slug: "san-antonio", airports: ["SAT"], region: "south" },
  { name: "Indianapolis", displayName: "Indianapolis", slug: "indianapolis", airports: ["IND"], region: "midwest" },
  { name: "Pittsburgh", displayName: "Pittsburgh", slug: "pittsburgh", airports: ["PIT"], region: "northeast" },
  { name: "Cincinnati", displayName: "Cincinnati", slug: "cincinnati", airports: ["CVG"], region: "midwest" },
  { name: "Cleveland", displayName: "Cleveland", slug: "cleveland", airports: ["CLE"], region: "midwest" },
  { name: "Columbus", displayName: "Columbus", slug: "columbus", airports: ["CMH"], region: "midwest" },
  { name: "New Orleans", displayName: "New Orleans", slug: "new-orleans", airports: ["MSY"], region: "south" },
  { name: "Jacksonville", displayName: "Jacksonville", slug: "jacksonville", airports: ["JAX"], region: "south" },
  { name: "Memphis", displayName: "Memphis", slug: "memphis", airports: ["MEM"], region: "south" },
  { name: "Richmond", displayName: "Richmond", slug: "richmond", airports: ["RIC"], region: "south" },
  { name: "Buffalo", displayName: "Buffalo", slug: "buffalo", airports: ["BUF"], region: "northeast" },
  { name: "Albuquerque", displayName: "Albuquerque", slug: "albuquerque", airports: ["ABQ"], region: "west" },
  { name: "Louisville", displayName: "Louisville", slug: "louisville", airports: ["SDF"], region: "south" },
  { name: "Tulsa", displayName: "Tulsa", slug: "tulsa", airports: ["TUL"], region: "south" },
  { name: "Greenville - Anderson", displayName: "Greenville-Anderson", slug: "greenville-anderson", airports: ["GSP"], region: "southeast" },
  { name: "Virginia Beach", displayName: "Virginia Beach", slug: "virginia-beach", airports: ["ORF"], region: "south" },
  { name: "Fresno", displayName: "Fresno", slug: "fresno", airports: ["FAT"], region: "west" },

  // === Smaller Metros ===
  { name: "Boise", displayName: "Boise", slug: "boise", airports: ["BOI"], region: "west" },
  { name: "Charleston", displayName: "Charleston", slug: "charleston", airports: ["CHS"], region: "south" },
  { name: "Reno", displayName: "Reno", slug: "reno", airports: ["RNO"], region: "west" },
  { name: "Spokane", displayName: "Spokane", slug: "spokane", airports: ["GEG"], region: "west" },
  { name: "Des Moines", displayName: "Des Moines", slug: "des-moines", airports: ["DSM"], region: "midwest" },
  { name: "Omaha", displayName: "Omaha", slug: "omaha", airports: ["OMA"], region: "midwest" },
  { name: "Birmingham", displayName: "Birmingham", slug: "birmingham", airports: ["BHM"], region: "south" },
  { name: "El Paso", displayName: "El Paso", slug: "el-paso", airports: ["ELP"], region: "south" },
  { name: "Little Rock", displayName: "Little Rock", slug: "little-rock", airports: ["LIT"], region: "south" },
  { name: "Syracuse", displayName: "Syracuse", slug: "syracuse", airports: ["SYR"], region: "northeast" },
  { name: "Knoxville", displayName: "Knoxville", slug: "knoxville", airports: ["TYS"], region: "south" },
  { name: "Savannah", displayName: "Savannah", slug: "savannah", airports: ["SAV"], region: "south" },
  { name: "Anchorage", displayName: "Anchorage", slug: "anchorage", airports: ["ANC"], region: "west" },
  { name: "Colorado Springs", displayName: "Colorado Springs", slug: "colorado-springs", airports: ["COS"], region: "west" },
  { name: "Rochester", displayName: "Rochester", slug: "rochester", airports: ["RST"], region: "northeast" },
  { name: "Lexington", displayName: "Lexington", slug: "lexington", airports: ["LEX"], region: "south" },
  { name: "Dayton", displayName: "Dayton", slug: "dayton", airports: ["DAY"], region: "midwest" },
  { name: "Lubbock", displayName: "Lubbock", slug: "lubbock", airports: ["LBB"], region: "midwest" },
  { name: "Wichita", displayName: "Wichita", slug: "wichita", airports: ["ICT"], region: "midwest" },
  { name: "Harrisburg", displayName: "Harrisburg", slug: "harrisburg", airports: ["MDT"], region: "northeast" },
  { name: "Charlottesville", displayName: "Charlottesville", slug: "charlottesville", airports: ["CHO"], region: "northeast" },
  { name: "Mobile", displayName: "Mobile", slug: "mobile", airports: ["MOB"], region: "south" },
  { name: "Pensacola", displayName: "Pensacola", slug: "pensacola", airports: ["PNS"], region: "south" },
  { name: "Shreveport", displayName: "Shreveport", slug: "shreveport", airports: ["SHV"], region: "south" },
  { name: "Springfield", displayName: "Springfield", slug: "springfield", airports: ["SGF"], region: "midwest" },
  { name: "South Bend", displayName: "South Bend", slug: "south-bend", airports: ["SBN"], region: "midwest" },
  { name: "Tallahassee", displayName: "Tallahassee", slug: "tallahassee", airports: ["TLH"], region: "south" },
  { name: "Hartford", displayName: "Hartford", slug: "hartford", airports: ["BDL"], region: "northeast" },
  { name: "Albany", displayName: "Albany", slug: "albany", airports: ["ALB"], region: "northeast" },
  { name: "Grand Rapids", displayName: "Grand Rapids", slug: "grand-rapids", airports: ["GRR"], region: "midwest" },
  { name: "Madison", displayName: "Madison", slug: "madison", airports: ["MSN"], region: "midwest" },
  { name: "Akron", displayName: "Akron", slug: "akron", airports: ["CAK"], region: "midwest" },
  { name: "Myrtle Beach", displayName: "Myrtle Beach", slug: "myrtle-beach", airports: ["MYR"], region: "south" },
  { name: "Asheville", displayName: "Asheville", slug: "asheville", airports: ["AVL"], region: "southeast" },
  { name: "Fargo", displayName: "Fargo", slug: "fargo", airports: ["FAR"], region: "midwest" },
  { name: "Sioux Falls", displayName: "Sioux Falls", slug: "sioux-falls", airports: ["FSD"], region: "midwest" },
  { name: "Cedar Rapids", displayName: "Cedar Rapids", slug: "cedar-rapids", airports: ["CID"], region: "midwest" },
  { name: "Quad Cities", displayName: "Quad Cities", slug: "quad-cities", airports: ["MLI"], region: "midwest" },
  { name: "Tri-Cities", displayName: "Tri-Cities", slug: "tri-cities", airports: ["TRI"], region: "south" },
  { name: "Gulfport", displayName: "Gulfport", slug: "gulfport", airports: ["GPT"], region: "south" },
  { name: "Baton Rouge", displayName: "Baton Rouge", slug: "baton-rouge", airports: ["BTR"], region: "south" },
  { name: "Huntsville", displayName: "Huntsville", slug: "huntsville", airports: ["HSV"], region: "south" },
  { name: "Fort Myers", displayName: "Fort Myers", slug: "fort-myers", airports: ["RSW"], region: "south" },
  { name: "Milwaukee", displayName: "Milwaukee", slug: "milwaukee", airports: ["MKE"], region: "midwest" },
];

// Lookup maps
export const METRO_BY_SLUG: Record<string, Metro> = {};
export const AIRPORT_TO_METRO: Record<string, Metro> = {};

for (const metro of METROS) {
  METRO_BY_SLUG[metro.slug] = metro;
  for (const airport of metro.airports) {
    AIRPORT_TO_METRO[airport] = metro;
  }
}

// Group by region for mega menu
export const METROS_BY_REGION: Record<Region, Metro[]> = {
  south: [],
  west: [],
  midwest: [],
  northeast: [],
  southeast: [],
};

for (const metro of METROS) {
  METROS_BY_REGION[metro.region].push(metro);
}

// Sort each region alphabetically
for (const region of Object.keys(METROS_BY_REGION) as Region[]) {
  METROS_BY_REGION[region].sort((a, b) => a.displayName.localeCompare(b.displayName));
}

export const REGION_LABELS: Record<Region, string> = {
  south: "South",
  west: "West",
  midwest: "Midwest",
  northeast: "Northeast",
  southeast: "Southeast",
};

// Set of all US airport IATA codes we track (for classifying domestic vs international)
export const US_AIRPORTS = new Set<string>();
for (const metro of METROS) {
  for (const airport of metro.airports) {
    US_AIRPORTS.add(airport);
  }
}

/** Returns true if the IATA code is a known US domestic airport */
export function isDomestic(iata: string): boolean {
  return US_AIRPORTS.has(iata.trim());
}
