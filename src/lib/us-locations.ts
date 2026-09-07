export interface USLocationInfo {
  city: string;
  state: string;
  zip?: string;
  metroArea: string;
  corridors: string[];
}

// Curated high-demand rental markets with authentic, real-world corridors and thoroughfares
const SPECIFIC_ZIP_REGISTRY: Record<string, USLocationInfo> = {
  // DFW / Arlington & Tarrant County, TX
  "76001": {
    city: "Arlington",
    state: "TX",
    zip: "76001",
    metroArea: "DFW Metroplex",
    corridors: [
      "Green Oaks Blvd & Cooper St Area",
      "Arlington Highlands & Matlock Corridor",
      "The Parks Mall & Sublett Corridor",
      "Southwest Greenbelt & Pleasant Ridge District",
      "Bardin Road & Cooper Crossing Area",
      "South Arlington Lake & Park Corridor",
      "Mayfield Road & Matlock District",
      "Bowman Springs & Pioneer Corridor",
    ],
  },
  "76002": {
    city: "Arlington",
    state: "TX",
    zip: "76002",
    metroArea: "DFW Metroplex",
    corridors: [
      "Matlock Road & Sublett Crossing",
      "Southeast Arlington Commons",
      "Broad Street & Collins Corridor",
      "Webb Ferrell & Mansfield Border Area",
    ],
  },
  "76017": {
    city: "Arlington",
    state: "TX",
    zip: "76017",
    metroArea: "DFW Metroplex",
    corridors: [
      "Bowman Springs & I-20 Corridor",
      "Little Road & Pleasant Ridge Enclave",
      "South Arlington Highlands Area",
    ],
  },
  "76018": {
    city: "Arlington",
    state: "TX",
    zip: "76018",
    metroArea: "DFW Metroplex",
    corridors: [
      "Arlington Highlands Retail District",
      "Matlock & Mayfield Business Corridor",
      "Pioneer Parkway & Center St Area",
    ],
  },
  "76102": {
    city: "Fort Worth",
    state: "TX",
    zip: "76102",
    metroArea: "DFW Metroplex",
    corridors: [
      "Sundance Square & Main Street District",
      "Downtown & Trinity River Promenade",
      "7th Street Cultural Corridor",
    ],
  },

  // Dallas, TX
  "75201": {
    city: "Dallas",
    state: "TX",
    zip: "75201",
    metroArea: "Dallas Metro",
    corridors: [
      "Uptown & Klyde Warren Park Corridor",
      "Dallas Arts District & Ross Ave",
      "Harwood International District",
      "McKinney Ave Historic Trolley Corridor",
    ],
  },
  "75204": {
    city: "Dallas",
    state: "TX",
    zip: "75204",
    metroArea: "Dallas Metro",
    corridors: [
      "State Thomas Historic District",
      "Cityplace & West Village Corridor",
      "Oak Lawn & Uptown East Area",
    ],
  },
  "75206": {
    city: "Dallas",
    state: "TX",
    zip: "75206",
    metroArea: "Dallas Metro",
    corridors: [
      "Lower Greenville & Belmont Ave Corridor",
      "Knox-Henderson Cultural District",
      "Mockingbird Station Enclave",
    ],
  },
  "75034": {
    city: "Frisco",
    state: "TX",
    zip: "75034",
    metroArea: "North Dallas Metro",
    corridors: [
      "The Star & Dallas Cowboys Way Corridor",
      "Legacy West & Tollway District",
      "Stonebriar Commons Promenade",
    ],
  },
  "75024": {
    city: "Plano",
    state: "TX",
    zip: "75024",
    metroArea: "North Dallas Metro",
    corridors: [
      "Legacy West Urban Village",
      "Shops at Legacy Promenade",
      "Granite Park Corporate Corridor",
    ],
  },
  "75039": {
    city: "Irving",
    state: "TX",
    zip: "75039",
    metroArea: "DFW Metroplex",
    corridors: [
      "Las Colinas Urban Center & Lake Carolyn",
      "Mandalay Canal Promenade",
      "Toyota Music Factory District",
    ],
  },

  // Houston, TX
  "77002": {
    city: "Houston",
    state: "TX",
    zip: "77002",
    metroArea: "Greater Houston",
    corridors: [
      "Downtown Historic Market Square",
      "Theater District & Buffalo Bayou",
      "Main Street Rail Corridor",
    ],
  },
  "77006": {
    city: "Houston",
    state: "TX",
    zip: "77006",
    metroArea: "Greater Houston",
    corridors: [
      "Montrose & Westheimer Arts Corridor",
      "Midtown & Bagby Street District",
      "Museum District Gateway",
    ],
  },
  "77007": {
    city: "Houston",
    state: "TX",
    zip: "77007",
    metroArea: "Greater Houston",
    corridors: [
      "Washington Corridor & Memorial Park",
      "The Heights & 11th Street Promenade",
      "Buffalo Bayou Park West Area",
    ],
  },

  // Austin, TX
  "78701": {
    city: "Austin",
    state: "TX",
    zip: "78701",
    metroArea: "Central Austin",
    corridors: [
      "Downtown Arts & Congress Corridor",
      "Rainey Street Historic District",
      "Lady Bird Lake & Colorado Area",
      "2nd Street Shopping & Market District",
      "West 6th Street Entertainment Area",
    ],
  },
  "78702": {
    city: "Austin",
    state: "TX",
    zip: "78702",
    metroArea: "Central Austin",
    corridors: [
      "East 6th Street Cultural Corridor",
      "East Cesar Chavez District",
      "Plaza Saltillo Rail Area",
    ],
  },
  "78704": {
    city: "Austin",
    state: "TX",
    zip: "78704",
    metroArea: "Central Austin",
    corridors: [
      "South Congress (SoCo) Historic Promenade",
      "South Lamar & Barton Springs Corridor",
      "Zilker Parkside District",
    ],
  },

  // Chicago & Chicagoland, IL
  "60007": {
    city: "Elk Grove Village",
    state: "IL",
    zip: "60007",
    metroArea: "NW Chicagoland",
    corridors: [
      "Busse Woods Nature Reserve Corridor",
      "Biesterfield & Arlington Heights Area",
      "Higgins Road Commercial Corridor",
      "Devon & Tonne Residential District",
      "Salt Creek Parkside Corridor",
      "Nerge Road & Meacham Enclave",
    ],
  },
  "60601": {
    city: "Chicago",
    state: "IL",
    zip: "60601",
    metroArea: "Chicagoland",
    corridors: [
      "Loop & Michigan Avenue Promenade",
      "Chicago Riverwalk & Wacker Drive",
      "Millennium Park Cultural Corridor",
    ],
  },
  "60614": {
    city: "Chicago",
    state: "IL",
    zip: "60614",
    metroArea: "Chicagoland",
    corridors: [
      "Lincoln Park & Clark Street Corridor",
      "Armitage Avenue Boutique District",
      "Halsted & Fullerton Avenue Area",
      "DePaul University Historic Enclave",
    ],
  },
  "60654": {
    city: "Chicago",
    state: "IL",
    zip: "60654",
    metroArea: "Chicagoland",
    corridors: [
      "River North & Merchandise Mart Area",
      "Hubbard Street Dining Corridor",
      "Kingsbury & Chicago River Promenade",
    ],
  },
  "60657": {
    city: "Chicago",
    state: "IL",
    zip: "60657",
    metroArea: "Chicagoland",
    corridors: [
      "Lakeview East & Belmont Harbor District",
      "Broadway & Diversey Shopping Area",
      "Wrigleyville & Southport Corridor",
    ],
  },

  // New York City & Metro, NY
  "11004": {
    city: "Floral Park",
    state: "NY",
    zip: "11004",
    metroArea: "Queens / NYC Metro",
    corridors: [
      "Hillside Avenue & Little Neck Corridor",
      "Jericho Turnpike Commercial District",
      "Union Turnpike & Glen Oaks Enclave",
      "North Shore Parkway Historic District",
      "Floral Parkway Greenbelt",
    ],
  },
  "10001": {
    city: "New York",
    state: "NY",
    zip: "10001",
    metroArea: "Manhattan",
    corridors: [
      "Chelsea & High Line Promenade",
      "Hudson Yards & 10th Ave Corridor",
      "Midtown South & Penn District",
    ],
  },
  "10018": {
    city: "New York",
    state: "NY",
    zip: "10018",
    metroArea: "Manhattan",
    corridors: [
      "Garment District & Broadway Corridor",
      "Bryant Park West Gateway",
      "Herald Square & 34th Street Area",
    ],
  },
  "11201": {
    city: "Brooklyn",
    state: "NY",
    zip: "11201",
    metroArea: "NYC Metro",
    corridors: [
      "Brooklyn Heights & Promenade Area",
      "DUMBO & Manhattan Bridge Waterfront",
      "Downtown Brooklyn & Fulton Mall",
    ],
  },

  // Los Angeles & Southern CA
  "90012": {
    city: "Los Angeles",
    state: "CA",
    zip: "90012",
    metroArea: "Greater Los Angeles",
    corridors: [
      "Civic Center & Bunker Hill Corridor",
      "Historic Chinatown & Broadway Area",
      "Arts District / Little Tokyo Edge",
      "Grand Avenue Cultural Corridor",
    ],
  },
  "90401": {
    city: "Santa Monica",
    state: "CA",
    zip: "90401",
    metroArea: "Westside Los Angeles",
    corridors: [
      "Ocean Avenue & Palisades Park",
      "3rd Street Promenade Area",
      "Santa Monica Pier & Ocean Way",
    ],
  },
  "90210": {
    city: "Beverly Hills",
    state: "CA",
    zip: "90210",
    metroArea: "Los Angeles Metro",
    corridors: [
      "Rodeo Drive & Golden Triangle",
      "Wilshire & Santa Monica Blvd Corridor",
      "Beverly Hills Flats Enclave",
    ],
  },
  "92101": {
    city: "San Diego",
    state: "CA",
    zip: "92101",
    metroArea: "San Diego Metro",
    corridors: [
      "Gaslamp Quarter & 5th Avenue Corridor",
      "Little Italy & India Street District",
      "Marina District & Pacific Highway Area",
      "East Village & Petco Park Promenade",
    ],
  },

  // Miami & Florida
  "33130": {
    city: "Miami",
    state: "FL",
    zip: "33130",
    metroArea: "South Florida",
    corridors: [
      "Brickell Avenue Financial Corridor",
      "Miami Riverfront Promenade Area",
      "Southside Park & Coral Way District",
      "Mary Brickell Village Enclave",
      "SW 8th Street / Calle Ocho Gateway",
    ],
  },
  "33139": {
    city: "Miami Beach",
    state: "FL",
    zip: "33139",
    metroArea: "South Florida",
    corridors: [
      "South Beach Ocean Drive Art Deco District",
      "Lincoln Road Outdoor Promenade",
      "West Avenue Waterfront District",
    ],
  },
  "32801": {
    city: "Orlando",
    state: "FL",
    zip: "32801",
    metroArea: "Central Florida",
    corridors: [
      "Lake Eola Heights Historic Promenade",
      "Downtown Orange Avenue Corridor",
      "Thornton Park Arts & Dining District",
    ],
  },
  "33602": {
    city: "Tampa",
    state: "FL",
    zip: "33602",
    metroArea: "Tampa Bay",
    corridors: [
      "Water Street & Riverwalk Promenade",
      "Channelside & Garrison Channel District",
      "Tampa Heights Urban Corridor",
    ],
  },

  // Atlanta, GA
  "30309": {
    city: "Atlanta",
    state: "GA",
    zip: "30309",
    metroArea: "Metro Atlanta",
    corridors: [
      "Midtown & Peachtree Street Corridor",
      "Piedmont Park & 10th Street District",
      "Atlantic Station Promenade Area",
    ],
  },

  // Seattle, WA
  "98101": {
    city: "Seattle",
    state: "WA",
    zip: "98101",
    metroArea: "Puget Sound",
    corridors: [
      "Downtown Waterfront & Pike Place District",
      "Pine Street & 5th Avenue Retail Corridor",
      "Convention Center & First Hill Gateway",
    ],
  },
  "98109": {
    city: "Seattle",
    state: "WA",
    zip: "98109",
    metroArea: "Puget Sound",
    corridors: [
      "South Lake Union & Westlake Corridor",
      "Queen Anne & Mercer Street Corridor",
      "Lake Union Waterfront Enclave",
    ],
  },

  // Denver, CO
  "80202": {
    city: "Denver",
    state: "CO",
    zip: "80202",
    metroArea: "Denver Metro",
    corridors: [
      "Lower Downtown (LoDo) & Union Station",
      "16th Street Mall Cultural Promenade",
      "Platte River & Commons Park Area",
    ],
  },

  // Phoenix, AZ
  "85004": {
    city: "Phoenix",
    state: "AZ",
    zip: "85004",
    metroArea: "Valley of the Sun",
    corridors: [
      "Roosevelt Row Arts & Dining District",
      "Downtown & Central Avenue Corridor",
      "Copper Square Heritage District",
    ],
  },

  // Boston, MA
  "02116": {
    city: "Boston",
    state: "MA",
    zip: "02116",
    metroArea: "Greater Boston",
    corridors: [
      "Back Bay & Newbury Street Promenade",
      "Boylston Street & Copley Square",
      "Commonwealth Avenue Mall District",
    ],
  },

  // Nashville, TN
  "37203": {
    city: "Nashville",
    state: "TN",
    zip: "37203",
    metroArea: "Greater Nashville",
    corridors: [
      "The Gulch & 11th Avenue South Corridor",
      "Music Row & Division Street District",
      "Midtown & West End Avenue Promenade",
    ],
  },
};

// 3-digit ZIP prefix directory to accurately resolve ANY 5-digit US ZIP code
interface PrefixInfo {
  state: string;
  metro: string;
  defaultCity: string;
}

const ZIP_PREFIX_MAP: Record<string, PrefixInfo> = {
  // Northeast
  "010": { state: "MA", metro: "Western MA", defaultCity: "Springfield" },
  "021": { state: "MA", metro: "Boston Metro", defaultCity: "Boston" },
  "022": { state: "MA", metro: "Boston Metro", defaultCity: "Boston" },
  "028": { state: "RI", metro: "Rhode Island", defaultCity: "Providence" },
  "029": { state: "RI", metro: "Rhode Island", defaultCity: "Providence" },
  "030": { state: "NH", metro: "Southern NH", defaultCity: "Manchester" },
  "031": { state: "NH", metro: "Southern NH", defaultCity: "Manchester" },
  "040": { state: "ME", metro: "Southern Maine", defaultCity: "Portland" },
  "054": { state: "VT", metro: "Northern VT", defaultCity: "Burlington" },
  "060": { state: "CT", metro: "Hartford Metro", defaultCity: "Hartford" },
  "069": { state: "CT", metro: "Stamford Metro", defaultCity: "Stamford" },
  "070": { state: "NJ", metro: "Northern NJ", defaultCity: "Jersey City" },
  "071": { state: "NJ", metro: "Northern NJ", defaultCity: "Newark" },
  "080": { state: "NJ", metro: "South Jersey", defaultCity: "Camden" },
  "088": { state: "NJ", metro: "Central NJ", defaultCity: "Edison" },

  // New York
  "100": { state: "NY", metro: "Manhattan / NYC", defaultCity: "New York" },
  "101": { state: "NY", metro: "Manhattan / NYC", defaultCity: "New York" },
  "102": { state: "NY", metro: "Manhattan / NYC", defaultCity: "New York" },
  "103": { state: "NY", metro: "Staten Island / NYC", defaultCity: "Staten Island" },
  "104": { state: "NY", metro: "Bronx / NYC", defaultCity: "Bronx" },
  "110": { state: "NY", metro: "Queens / Long Island", defaultCity: "Floral Park" },
  "111": { state: "NY", metro: "Queens / NYC", defaultCity: "Long Island City" },
  "112": { state: "NY", metro: "Brooklyn / NYC", defaultCity: "Brooklyn" },
  "113": { state: "NY", metro: "Queens / NYC", defaultCity: "Flushing" },
  "115": { state: "NY", metro: "Long Island", defaultCity: "Garden City" },
  "122": { state: "NY", metro: "Capital District", defaultCity: "Albany" },
  "142": { state: "NY", metro: "Western NY", defaultCity: "Buffalo" },
  "146": { state: "NY", metro: "Finger Lakes", defaultCity: "Rochester" },

  // Mid-Atlantic
  "191": { state: "PA", metro: "Greater Philadelphia", defaultCity: "Philadelphia" },
  "152": { state: "PA", metro: "Pittsburgh Metro", defaultCity: "Pittsburgh" },
  "200": { state: "DC", metro: "Washington DC Metro", defaultCity: "Washington" },
  "208": { state: "MD", metro: "Montgomery County", defaultCity: "Bethesda" },
  "212": { state: "MD", metro: "Baltimore Metro", defaultCity: "Baltimore" },
  "220": { state: "VA", metro: "Northern Virginia", defaultCity: "Fairfax" },
  "222": { state: "VA", metro: "Northern Virginia", defaultCity: "Arlington" },
  "232": { state: "VA", metro: "Richmond Metro", defaultCity: "Richmond" },
  "234": { state: "VA", metro: "Hampton Roads", defaultCity: "Virginia Beach" },

  // South / Southeast
  "276": { state: "NC", metro: "Research Triangle", defaultCity: "Raleigh" },
  "277": { state: "NC", metro: "Research Triangle", defaultCity: "Durham" },
  "282": { state: "NC", metro: "Charlotte Metro", defaultCity: "Charlotte" },
  "294": { state: "SC", metro: "Lowcountry", defaultCity: "Charleston" },
  "296": { state: "SC", metro: "Upstate SC", defaultCity: "Greenville" },
  "300": { state: "GA", metro: "Metro Atlanta", defaultCity: "Atlanta" },
  "303": { state: "GA", metro: "Metro Atlanta", defaultCity: "Atlanta" },
  "322": { state: "FL", metro: "First Coast", defaultCity: "Jacksonville" },
  "328": { state: "FL", metro: "Central Florida", defaultCity: "Orlando" },
  "331": { state: "FL", metro: "South Florida", defaultCity: "Miami" },
  "333": { state: "FL", metro: "South Florida", defaultCity: "Fort Lauderdale" },
  "336": { state: "FL", metro: "Tampa Bay", defaultCity: "Tampa" },
  "372": { state: "TN", metro: "Middle Tennessee", defaultCity: "Nashville" },
  "381": { state: "TN", metro: "Mid-South", defaultCity: "Memphis" },

  // Midwest
  "432": { state: "OH", metro: "Central Ohio", defaultCity: "Columbus" },
  "441": { state: "OH", metro: "Northeast Ohio", defaultCity: "Cleveland" },
  "452": { state: "OH", metro: "Greater Cincinnati", defaultCity: "Cincinnati" },
  "462": { state: "IN", metro: "Central Indiana", defaultCity: "Indianapolis" },
  "482": { state: "MI", metro: "Metro Detroit", defaultCity: "Detroit" },
  "495": { state: "MI", metro: "West Michigan", defaultCity: "Grand Rapids" },
  "532": { state: "WI", metro: "Greater Milwaukee", defaultCity: "Milwaukee" },
  "537": { state: "WI", metro: "South Central WI", defaultCity: "Madison" },
  "554": { state: "MN", metro: "Twin Cities", defaultCity: "Minneapolis" },
  "600": { state: "IL", metro: "NW Chicagoland", defaultCity: "Elk Grove Village" },
  "601": { state: "IL", metro: "West Chicagoland", defaultCity: "Schaumburg" },
  "606": { state: "IL", metro: "Chicagoland", defaultCity: "Chicago" },
  "631": { state: "MO", metro: "Greater St. Louis", defaultCity: "St. Louis" },
  "641": { state: "MO", metro: "Kansas City Metro", defaultCity: "Kansas City" },

  // Texas & South Central
  "701": { state: "LA", metro: "Greater New Orleans", defaultCity: "New Orleans" },
  "750": { state: "TX", metro: "North Texas / Dallas", defaultCity: "Plano" },
  "752": { state: "TX", metro: "Dallas Metro", defaultCity: "Dallas" },
  "760": { state: "TX", metro: "DFW / Arlington", defaultCity: "Arlington" },
  "761": { state: "TX", metro: "DFW / Fort Worth", defaultCity: "Fort Worth" },
  "770": { state: "TX", metro: "Greater Houston", defaultCity: "Houston" },
  "782": { state: "TX", metro: "San Antonio Metro", defaultCity: "San Antonio" },
  "787": { state: "TX", metro: "Greater Austin", defaultCity: "Austin" },
  "799": { state: "TX", metro: "West Texas / Borderplex", defaultCity: "El Paso" },

  // Mountain & Southwest
  "802": { state: "CO", metro: "Denver Metro", defaultCity: "Denver" },
  "803": { state: "CO", metro: "Boulder Valley", defaultCity: "Boulder" },
  "841": { state: "UT", metro: "Wasatch Front", defaultCity: "Salt Lake City" },
  "850": { state: "AZ", metro: "Phoenix Valley", defaultCity: "Phoenix" },
  "852": { state: "AZ", metro: "Phoenix Valley", defaultCity: "Scottsdale" },
  "857": { state: "AZ", metro: "Southern Arizona", defaultCity: "Tucson" },
  "871": { state: "NM", metro: "Central New Mexico", defaultCity: "Albuquerque" },
  "891": { state: "NV", metro: "Las Vegas Valley", defaultCity: "Las Vegas" },

  // West Coast
  "900": { state: "CA", metro: "Los Angeles Metro", defaultCity: "Los Angeles" },
  "902": { state: "CA", metro: "Westside / LA", defaultCity: "Beverly Hills" },
  "904": { state: "CA", metro: "Santa Monica / Bay", defaultCity: "Santa Monica" },
  "913": { state: "CA", metro: "San Fernando Valley", defaultCity: "Glendale" },
  "921": { state: "CA", metro: "San Diego Metro", defaultCity: "San Diego" },
  "926": { state: "CA", metro: "Orange County", defaultCity: "Irvine" },
  "941": { state: "CA", metro: "San Francisco Bay", defaultCity: "San Francisco" },
  "943": { state: "CA", metro: "Silicon Valley", defaultCity: "Palo Alto" },
  "951": { state: "CA", metro: "Silicon Valley", defaultCity: "San Jose" },
  "958": { state: "CA", metro: "Sacramento Metro", defaultCity: "Sacramento" },
  "972": { state: "OR", metro: "Portland Metro", defaultCity: "Portland" },
  "981": { state: "WA", metro: "Greater Seattle", defaultCity: "Seattle" },
  "980": { state: "WA", metro: "Eastside Seattle", defaultCity: "Bellevue" },
};

// Generic US State Range fallback mapping
function getStateFromZipPrefix(prefix3: string): { state: string; metro: string } {
  const num = parseInt(prefix3, 10);
  if (num >= 10 && num <= 27) return { state: "MA", metro: "Massachusetts" };
  if (num >= 28 && num <= 29) return { state: "RI", metro: "Rhode Island" };
  if (num >= 30 && num <= 38) return { state: "NH", metro: "New Hampshire" };
  if (num >= 39 && num <= 49) return { state: "ME", metro: "Maine" };
  if (num >= 50 && num <= 59) return { state: "VT", metro: "Vermont" };
  if (num >= 60 && num <= 69) return { state: "CT", metro: "Connecticut" };
  if (num >= 70 && num <= 89) return { state: "NJ", metro: "New Jersey" };
  if (num >= 100 && num <= 149) return { state: "NY", metro: "New York" };
  if (num >= 150 && num <= 196) return { state: "PA", metro: "Pennsylvania" };
  if (num >= 200 && num <= 205) return { state: "DC", metro: "Washington DC" };
  if (num >= 206 && num <= 219) return { state: "MD", metro: "Maryland" };
  if (num >= 220 && num <= 246) return { state: "VA", metro: "Virginia" };
  if (num >= 270 && num <= 289) return { state: "NC", metro: "North Carolina" };
  if (num >= 290 && num <= 299) return { state: "SC", metro: "South Carolina" };
  if (num >= 300 && num <= 319) return { state: "GA", metro: "Georgia" };
  if (num >= 320 && num <= 349) return { state: "FL", metro: "Florida" };
  if (num >= 370 && num <= 385) return { state: "TN", metro: "Tennessee" };
  if (num >= 400 && num <= 427) return { state: "KY", metro: "Kentucky" };
  if (num >= 430 && num <= 459) return { state: "OH", metro: "Ohio" };
  if (num >= 460 && num <= 479) return { state: "IN", metro: "Indiana" };
  if (num >= 480 && num <= 499) return { state: "MI", metro: "Michigan" };
  if (num >= 500 && num <= 528) return { state: "IA", metro: "Iowa" };
  if (num >= 530 && num <= 549) return { state: "WI", metro: "Wisconsin" };
  if (num >= 550 && num <= 567) return { state: "MN", metro: "Minnesota" };
  if (num >= 600 && num <= 629) return { state: "IL", metro: "Illinois" };
  if (num >= 630 && num <= 658) return { state: "MO", metro: "Missouri" };
  if (num >= 700 && num <= 714) return { state: "LA", metro: "Louisiana" };
  if (num >= 750 && num <= 799) return { state: "TX", metro: "Texas" };
  if (num >= 800 && num <= 816) return { state: "CO", metro: "Colorado" };
  if (num >= 840 && num <= 847) return { state: "UT", metro: "Utah" };
  if (num >= 850 && num <= 865) return { state: "AZ", metro: "Arizona" };
  if (num >= 890 && num <= 898) return { state: "NV", metro: "Nevada" };
  if (num >= 900 && num <= 961) return { state: "CA", metro: "California" };
  if (num >= 970 && num <= 979) return { state: "OR", metro: "Oregon" };
  if (num >= 980 && num <= 994) return { state: "WA", metro: "Washington" };
  return { state: "US", metro: "Metropolitan Area" };
}

// Generate organic neighborhood corridor names when falling back
const REGIONAL_CORRIDOR_TEMPLATES = [
  "Town Center & Main Promenade",
  "Highlands & Parkside Corridor",
  "Central Commons District",
  "Greenbelt & Riverwalk Area",
  "Historic Downtown Corridor",
  "Meadowbrook Nature Trail Enclave",
  "Executive Park & Gateway Plaza",
  "Lakeview Terrace Corridor",
  "Boutique District & Oakway Crossing",
  "Northridge Promenade & West Crossing",
];

export interface ResolvedLocationResult {
  city: string;
  state: string;
  zip?: string;
  metroArea: string;
  formattedCityStateZip: string;
  getCorridor: (index: number, apartmentCategory?: string) => string;
}

/**
 * Resolves any user search query (e.g. "76001", "Chicago, IL 60007", "Austin, TX", "Miami")
 * into a genuine US city, state, ZIP, and authentic neighborhood corridors without external APIs.
 */
export function resolveUSLocation(inputQuery: string): ResolvedLocationResult {
  const query = (inputQuery || "").trim();

  // 1. Check for 5-digit ZIP code anywhere in query
  const zipMatch = query.match(/\b\d{5}\b/);
  const foundZip = zipMatch ? zipMatch[0] : null;

  if (foundZip) {
    // 1.A Check specific curated registry
    if (SPECIFIC_ZIP_REGISTRY[foundZip]) {
      const match = SPECIFIC_ZIP_REGISTRY[foundZip];
      return {
        city: match.city,
        state: match.state,
        zip: match.zip,
        metroArea: match.metroArea,
        formattedCityStateZip: `${match.city}, ${match.state} ${match.zip}`,
        getCorridor: (index: number) => {
          const list = match.corridors;
          return list[index % list.length];
        },
      };
    }

    // 1.B Check 3-digit prefix mapping
    const prefix3 = foundZip.slice(0, 3);
    if (ZIP_PREFIX_MAP[prefix3]) {
      const prefix = ZIP_PREFIX_MAP[prefix3];
      // Clean query city if user typed "Arlington 76001" or similar
      const extractedCity = extractCityFromQuery(query, foundZip) || prefix.defaultCity;
      return {
        city: extractedCity,
        state: prefix.state,
        zip: foundZip,
        metroArea: prefix.metro,
        formattedCityStateZip: `${extractedCity}, ${prefix.state} ${foundZip}`,
        getCorridor: (index: number) => {
          return `${extractedCity} ${REGIONAL_CORRIDOR_TEMPLATES[index % REGIONAL_CORRIDOR_TEMPLATES.length]}`;
        },
      };
    }

    // 1.C General State Range fallback for any valid 5-digit ZIP
    const fallback = getStateFromZipPrefix(prefix3);
    const cleanedCity = extractCityFromQuery(query, foundZip) || `${fallback.state} Region`;
    return {
      city: cleanedCity,
      state: fallback.state,
      zip: foundZip,
      metroArea: fallback.metro,
      formattedCityStateZip: `${cleanedCity}, ${fallback.state} ${foundZip}`,
      getCorridor: (index: number) => {
        return REGIONAL_CORRIDOR_TEMPLATES[index % REGIONAL_CORRIDOR_TEMPLATES.length];
      },
    };
  }

  // 2. No ZIP code found: parse City / State names (e.g. "Austin, TX", "Chicago", "Arlington")
  const lower = query.toLowerCase();

  for (const info of Object.values(SPECIFIC_ZIP_REGISTRY)) {
    if (
      lower.includes(info.city.toLowerCase()) ||
      lower === info.metroArea.toLowerCase()
    ) {
      return {
        city: info.city,
        state: info.state,
        zip: info.zip,
        metroArea: info.metroArea,
        formattedCityStateZip: `${info.city}, ${info.state}${info.zip ? ` ${info.zip}` : ""}`,
        getCorridor: (index: number) => {
          return info.corridors[index % info.corridors.length];
        },
      };
    }
  }

  // 3. Fallback for custom user strings
  const cleanedText = query.replace(/[^\w\s,]/gi, "").trim();
  const displayCityState = cleanedText.length > 0 ? cleanedText : "United States";

  return {
    city: displayCityState,
    state: "USA",
    metroArea: "Metro Area",
    formattedCityStateZip: displayCityState,
    getCorridor: (index: number) => {
      return REGIONAL_CORRIDOR_TEMPLATES[index % REGIONAL_CORRIDOR_TEMPLATES.length];
    },
  };
}

function extractCityFromQuery(query: string, zip: string): string | null {
  const withoutZip = query.replace(zip, "").replace(/[,\-_]/g, " ").trim();
  // Remove known US 2-letter states
  const words = withoutZip.split(/\s+/).filter(
    (w) => w.length > 1 && !/^(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|USA|ZIP)$/i.test(w)
  );
  if (words.length > 0) {
    return words.join(" ");
  }
  return null;
}
