// Geographic & ZIP Code Location Matcher for Apartmento

const US_STATES: Record<string, string> = {
  AL: "alabama",
  AK: "alaska",
  AZ: "arizona",
  AR: "arkansas",
  CA: "california",
  CO: "colorado",
  CT: "connecticut",
  DE: "delaware",
  FL: "florida",
  GA: "georgia",
  HI: "hawaii",
  ID: "idaho",
  IL: "illinois",
  IN: "indiana",
  IA: "iowa",
  KS: "kansas",
  KY: "kentucky",
  LA: "louisiana",
  ME: "maine",
  MD: "maryland",
  MA: "massachusetts",
  MI: "michigan",
  MN: "minnesota",
  MS: "mississippi",
  MO: "missouri",
  MT: "montana",
  NE: "nebraska",
  NV: "nevada",
  NH: "new hampshire",
  NJ: "new jersey",
  NM: "new mexico",
  NY: "new york",
  NC: "north carolina",
  ND: "north dakota",
  OH: "ohio",
  OK: "oklahoma",
  OR: "oregon",
  PA: "pennsylvania",
  RI: "rhode island",
  SC: "south carolina",
  SD: "south dakota",
  TN: "tennessee",
  TX: "texas",
  UT: "utah",
  VT: "vermont",
  VA: "virginia",
  WA: "washington",
  WV: "west virginia",
  WI: "wisconsin",
  WY: "wyoming",
};

// Common US ZIP to City/State associations for high-demand areas
const KNOWN_ZIP_AREAS: Record<string, { city: string; state: string }> = {
  // New York
  "11763": { city: "Medford", state: "NY" },
  "11772": { city: "Patchogue", state: "NY" },
  "11777": { city: "Port Jefferson", state: "NY" },
  "10001": { city: "New York", state: "NY" },
  "10010": { city: "New York", state: "NY" },
  "10012": { city: "New York", state: "NY" },
  "11201": { city: "Brooklyn", state: "NY" },
  "11211": { city: "Brooklyn", state: "NY" },
  "11101": { city: "Long Island City", state: "NY" },
  // New Jersey
  "07501": { city: "Paterson", state: "NJ" },
  "07502": { city: "Paterson", state: "NJ" },
  "07503": { city: "Paterson", state: "NJ" },
  "07504": { city: "Paterson", state: "NJ" },
  "07505": { city: "Paterson", state: "NJ" },
  "07514": { city: "Paterson", state: "NJ" },
  "07522": { city: "Paterson", state: "NJ" },
  "07030": { city: "Hoboken", state: "NJ" },
  "07302": { city: "Jersey City", state: "NJ" },
  "07102": { city: "Newark", state: "NJ" },
  // Texas
  "75201": { city: "Dallas", state: "TX" },
  "75001": { city: "Dallas", state: "TX" },
  "76001": { city: "Arlington", state: "TX" },
  "77002": { city: "Houston", state: "TX" },
  "78701": { city: "Austin", state: "TX" },
  // Illinois
  "60601": { city: "Chicago", state: "IL" },
  "60611": { city: "Chicago", state: "IL" },
  "60007": { city: "Chicago Area", state: "IL" },
  // Florida
  "33101": { city: "Miami", state: "FL" },
  "33139": { city: "Miami Beach", state: "FL" },
  "32801": { city: "Orlando", state: "FL" },
  // California
  "90001": { city: "Los Angeles", state: "CA" },
  "94102": { city: "San Francisco", state: "CA" },
};

export interface LocationMatchResult {
  matches: boolean;
  score: number;
  matchType: "exact_address" | "zip" | "city" | "state" | "none";
  matchedEntity?: string;
}

/**
 * Extracts 5-digit US ZIP code from string
 */
export function extractZipCode(text: string): string | null {
  const match = text.match(/\b\d{5}\b/);
  return match ? match[0] : null;
}

/**
 * Normalizes an address or search query by removing punctuation and excess whitespace
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[,\-_.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Checks whether user query matches a real apartment address based on ZIP, City, State, or Street proximity
 */
export function matchLocation(apartmentAddress: string, userQuery: string): LocationMatchResult {
  if (!apartmentAddress || !userQuery) {
    return { matches: false, score: 0, matchType: "none" };
  }

  const normApt = normalizeText(apartmentAddress);
  const normQuery = normalizeText(userQuery);

  const aptZip = extractZipCode(apartmentAddress);
  const queryZip = extractZipCode(userQuery);

  // 1. Direct or Near ZIP Code Match
  if (queryZip) {
    // 1a. Direct ZIP equality
    if (aptZip && aptZip === queryZip) {
      return {
        matches: true,
        score: 100,
        matchType: "zip",
        matchedEntity: `ZIP ${queryZip}`,
      };
    }

    // 1b. Known ZIP association (e.g. user typed 07501 and apt has "Paterson, NJ" or vice-versa)
    const knownQuery = KNOWN_ZIP_AREAS[queryZip];
    if (knownQuery) {
      const cityLower = knownQuery.city.toLowerCase();
      const stateCodeLower = knownQuery.state.toLowerCase();
      if (normApt.includes(cityLower) || (normApt.includes(stateCodeLower) && normApt.includes(cityLower))) {
        return {
          matches: true,
          score: 98,
          matchType: "zip",
          matchedEntity: `${knownQuery.city}, ${knownQuery.state} (${queryZip})`,
        };
      }
    }

    // 1c. Same 3-digit sectional center (e.g. 117xx for Suffolk County / Medford area or 075xx for Paterson)
    if (aptZip && aptZip.slice(0, 3) === queryZip.slice(0, 3)) {
      return {
        matches: true,
        score: 94,
        matchType: "zip",
        matchedEntity: `Area ZIP ${queryZip}`,
      };
    }
  }

  // 2. City + State match from full address search (e.g. "12 Crooked Pine Dr, Medford, NY 11763, United States")
  // Extract parts by comma
  const queryParts = userQuery.split(",").map((p) => p.trim().toLowerCase());
  for (const part of queryParts) {
    // Skip empty or generic parts
    if (!part || part === "united states" || part === "usa" || /^\d+$/.test(part)) continue;

    // Check if apartment address contains this part (e.g. "medford", "paterson")
    const cleanPart = part.replace(/\b\d{5}\b/, "").trim();
    if (cleanPart.length >= 3 && normApt.includes(cleanPart)) {
      return {
        matches: true,
        score: 96,
        matchType: "city",
        matchedEntity: cleanPart.toUpperCase(),
      };
    }
  }

  // 3. Direct Word Token matching for City or Neighborhood
  const queryTokens = normQuery.split(" ").filter((t) => {
    return (
      t.length >= 4 &&
      !["united", "states", "drive", "street", "avenue", "road", "court", "lane", "place", "suite", "north", "south", "east", "west"].includes(t)
    );
  });

  for (const token of queryTokens) {
    // If token matches city or unique neighborhood in apt address
    if (normApt.includes(token)) {
      return {
        matches: true,
        score: 92,
        matchType: "city",
        matchedEntity: token.charAt(0).toUpperCase() + token.slice(1),
      };
    }
  }

  // 4. State-wide Match (e.g. visitor searched "New York", "NY", "New Jersey", "NJ")
  for (const [code, name] of Object.entries(US_STATES)) {
    const codeRegex = new RegExp(`\\b${code.toLowerCase()}\\b`, "i");
    const nameRegex = new RegExp(`\\b${name.toLowerCase()}\\b`, "i");

    const queryHasState = codeRegex.test(normQuery) || nameRegex.test(normQuery);
    const aptHasState = codeRegex.test(normApt) || nameRegex.test(normApt);

    if (queryHasState && aptHasState) {
      // Check if user is searching for this state specifically
      const isOnlyState =
        normQuery.trim() === code.toLowerCase() ||
        normQuery.trim() === name.toLowerCase() ||
        normQuery.includes(`state of ${name}`);

      return {
        matches: true,
        score: isOnlyState ? 90 : 85,
        matchType: "state",
        matchedEntity: name.toUpperCase(),
      };
    }
  }

  return { matches: false, score: 0, matchType: "none" };
}
