import { getApartments } from "./store";
import { FunnelFormData, IApartment } from "@/types";
import { resolveUSLocation, cleanStreetOrIntersection } from "./us-locations";
import { matchLocation } from "./location-matcher";

export interface MatchedApartmentResult extends IApartment {
  displayLocation: string;
  displayRent: number;
  matchScore: number;
  matchHighlights: string[];
}

export interface VisitorMatchingContext {
  clientIp?: string;
  seenApartmentIds?: string[];
}

// In-memory cache to track which chameleon IDs each IP has seen recently (prevents repeating apartments)
const ipSeenCache = new Map<string, { seenIds: Set<string>; lastUpdated: number }>();

function getSeenIdsForVisitor(clientIp?: string, providedSeenIds?: string[]): Set<string> {
  const combined = new Set<string>(providedSeenIds || []);
  if (clientIp) {
    const cached = ipSeenCache.get(clientIp);
    if (cached) {
      cached.seenIds.forEach((id) => combined.add(id));
    }
  }
  return combined;
}

function recordSeenIdsForVisitor(clientIp: string | undefined, matchedIds: string[]) {
  if (!clientIp) return;
  const now = Date.now();
  let entry = ipSeenCache.get(clientIp);
  if (!entry) {
    // Avoid memory leak by limiting cache size to 5,000 active IPs
    if (ipSeenCache.size > 5000) {
      const oldestKey = ipSeenCache.keys().next().value;
      if (oldestKey) ipSeenCache.delete(oldestKey);
    }
    entry = { seenIds: new Set(), lastUpdated: now };
    ipSeenCache.set(clientIp, entry);
  }
  matchedIds.forEach((id) => entry.seenIds.add(id));
  entry.lastUpdated = now;
}

function computeDynamicTargetCount(queryLocation: string, clientIp: string = ""): number {
  const norm = (queryLocation + "_" + (clientIp || "rentorce")).toLowerCase().replace(/[^a-z0-9]/g, "");
  let hash = 0;
  for (let i = 0; i < norm.length; i++) {
    hash = ((hash << 5) - hash) + norm.charCodeAt(i);
    hash |= 0;
  }
  const abs = Math.abs(hash);

  const isHighDensity =
    /10001|10002|90012|90028|60601|77002|33101|33139|30301|75201|94102|new york|los angeles|chicago|miami|houston|dallas|austin|seattle|atlanta|san francisco/i.test(
      queryLocation
    );

  if (isHighDensity) {
    // High-demand metropolitan hubs show 8 to 12 apartments
    return 8 + (abs % 5); // 8, 9, 10, 11, or 12
  }

  // Standard cities and regional ZIPs show 6 to 10 apartments
  return 6 + (abs % 5); // 6, 7, 8, 9, or 10
}

export async function matchApartments(
  criteria: FunnelFormData,
  context?: VisitorMatchingContext
): Promise<MatchedApartmentResult[]> {
  const queryLocation = (criteria.desiredLocation || "").trim();
  const clientIp = context?.clientIp || "";
  const targetBedrooms = Number(criteria.bedrooms) || 1;
  const targetBathrooms = Number(criteria.bathrooms) || 1;

  // 1. Fetch base inventory from store (MongoDB or memory) - dynamically gets all active units!
  const allApartments = await getApartments({ isActive: true });

  // 2. CHECK FOR REAL / MANUAL APARTMENT MATCHES (Must match location AND requested bedroom count)
  const matchedManualUnits: MatchedApartmentResult[] = [];
  const manualApartments = allApartments.filter(
    (apt) => apt.isManual && apt.addressTemplate && apt.addressTemplate.trim().length > 0
  );

  for (const apt of manualApartments) {
    // If renter searched for a specific bedroom count, only include manual units that match it!
    // (Prevents 1-Bed apartments from overwhelming a 3-Bed search)
    if (criteria.bedrooms && apt.bedrooms !== targetBedrooms) {
      continue;
    }

    const locMatch = matchLocation(apt.addressTemplate || "", queryLocation);
    if (locMatch.matches) {
      let score = 88;
      const highlights: string[] = [];

      if (locMatch.matchType === "zip") {
        score += 10;
        highlights.push(`⭐ Exact ${locMatch.matchedEntity || "ZIP"} Match`);
      } else if (locMatch.matchType === "city") {
        score += 8;
        highlights.push(`⭐ Prime ${locMatch.matchedEntity || "City"} Property`);
      } else if (locMatch.matchType === "state") {
        score += 5;
        highlights.push(`⭐ Verified ${locMatch.matchedEntity || "State"} Listing`);
      } else {
        highlights.push("⭐ Verified Local Property");
      }

      if (apt.bedrooms === targetBedrooms) {
        score += 5;
        highlights.push(`${apt.bedrooms} Bed Layout Match`);
      }
      if (apt.bathrooms === targetBathrooms) {
        highlights.push(`${apt.bathrooms} Bath`);
      }
      if (apt.hasKitchen && criteria.kitchenRequired) {
        highlights.push("Chef's Kitchen");
      }

      matchedManualUnits.push({
        ...apt,
        isManual: true,
        isExactMatch: true,
        displayLocation: apt.addressTemplate || queryLocation,
        displayRent: apt.baseRent,
        matchScore: Math.min(99, Math.max(90, score)),
        matchHighlights: highlights.slice(0, 3),
      });
    }
  }

  // Sort real matches by score descending
  matchedManualUnits.sort((a, b) => b.matchScore - a.matchScore);

  // 3. DYNAMIC INVENTORY COUNT PER LOCATION & VISITOR (6 to 12)
  const targetTotalCount = computeDynamicTargetCount(queryLocation, clientIp);
  const remainingSlots = Math.max(0, targetTotalCount - matchedManualUnits.length);

  // Chameleon Pool:
  // Any active apartment that is NOT in matchedManualUnits, and has NO fixed location (Chameleon)
  const matchedIds = new Set(matchedManualUnits.map((m) => m._id || m.id));
  const chameleonPool = allApartments.filter(
    (apt) => !matchedIds.has(apt._id || apt.id) && (!apt.isManual || !apt.addressTemplate || !apt.addressTemplate.trim())
  );

  // Helper to shuffle an array organically
  const shuffle = <T>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // 4. ZERO-DUPLICATION ROTATION: Avoid showing the same chameleon apartment to the same user across searches
  const seenSet = getSeenIdsForVisitor(clientIp, context?.seenApartmentIds || criteria.seenApartmentIds);

  // Prioritize layout candidates:
  // 1. Exact match on BOTH bedrooms AND bathrooms
  // 2. Exact match on bedrooms
  // 3. Fallback to other chameleon units
  const exactLayoutPool = chameleonPool.filter(
    (apt) => apt.bedrooms === targetBedrooms && apt.bathrooms === targetBathrooms
  );
  const sameBedPool = chameleonPool.filter(
    (apt) => apt.bedrooms === targetBedrooms && apt.bathrooms !== targetBathrooms
  );
  const fallbackPool = chameleonPool.filter(
    (apt) => apt.bedrooms !== targetBedrooms
  );

  const prioritizedCandidates = [
    ...shuffle(exactLayoutPool),
    ...shuffle(sameBedPool),
    ...shuffle(fallbackPool),
  ];

  // Partition candidates into FRESH (unseen) vs ALREADY SEEN by this visitor
  const freshUnseen = prioritizedCandidates.filter((apt) => {
    const key = String(apt._id || apt.id || apt.slug);
    return !seenSet.has(key);
  });
  const alreadySeen = prioritizedCandidates.filter((apt) => {
    const key = String(apt._id || apt.id || apt.slug);
    return seenSet.has(key);
  });

  // Pick candidates: prioritize freshUnseen units!
  let candidatePool: IApartment[] = [];
  if (freshUnseen.length >= remainingSlots) {
    candidatePool = freshUnseen.slice(0, remainingSlots);
  } else {
    // If unseen units are fewer than needed, take all unseen and cycle back through alreadySeen
    candidatePool = [...freshUnseen, ...alreadySeen].slice(0, remainingSlots);
  }

  // Record newly picked chameleon IDs for this visitor's IP
  const newlyPickedIds = candidatePool.map((c) => String(c._id || c.id || c.slug));
  recordSeenIdsForVisitor(clientIp, newlyPickedIds);

  // Score chameleon candidates
  const scoredChameleons = candidatePool.map((apt) => {
    let score = 80;
    const highlights: string[] = [];

    if (apt.bathrooms === targetBathrooms) {
      score += 10;
      highlights.push(`${targetBathrooms} Full Bathroom${targetBathrooms > 1 ? "s" : ""}`);
    } else {
      highlights.push(`${targetBathrooms} Full Bathroom${targetBathrooms > 1 ? "s" : ""}`);
    }

    if (criteria.furnished === "Either" || apt.furnished === criteria.furnished || apt.furnished === "Either") {
      score += 5;
      highlights.push(apt.furnished === "Furnished" ? "Fully Furnished" : "Spacious Layout");
    }

    if (criteria.kitchenRequired && apt.hasKitchen) {
      score += 5;
      highlights.push("Full Chef's Kitchen");
    }

    if (criteria.hasPets) {
      if (apt.petPolicy === "Dogs & Cats Allowed" || apt.petPolicy === "Cats Only") {
        score += 5;
        highlights.push("Pet Friendly Building");
      }
    } else {
      score += 3;
    }

    const matchingAmenities = (criteria.amenities || []).filter((amenity) =>
      apt.amenities.includes(amenity)
    );
    if (matchingAmenities.length > 0) {
      score += Math.min(10, matchingAmenities.length * 2);
      highlights.push(...matchingAmenities.slice(0, 2));
    }

    return {
      apt,
      score: Math.min(96, Math.max(80, score)),
      highlights: highlights.slice(0, 3),
    };
  });

  const selectedChameleons = scoredChameleons.slice(0, remainingSlots);

  // Dynamic Adaptation for Chameleon Units: Real-world US Neighborhood, Budget & Floorplan Calibration
  const resolvedLoc = await resolveUSLocation(queryLocation);
  const minB = Math.max(400, criteria.budgetMin || 800);
  const maxB = Math.max(minB + 100, criteria.budgetMax || minB + 400);

  const adaptedChameleons: MatchedApartmentResult[] = selectedChameleons.map((item, index) => {
    const apt = item.apt;

    const spread = maxB - minB;
    const factor = selectedChameleons.length > 1 ? index / (selectedChameleons.length - 1) : 0.5;
    const rawRent = minB + spread * factor + ((index % 3) * 15 - 15);
    const calibratedRent = Math.round(rawRent / 10) * 10 - (index % 2 === 0 ? 5 : 0);
    const finalRent = Math.max(minB, Math.min(maxB, calibratedRent));

    const effectiveCategory = `${targetBedrooms}B${targetBathrooms}B` as any;
    const rawLocation = resolvedLoc.getCorridor(index, effectiveCategory || apt.category);
    const displayLocation = cleanStreetOrIntersection(rawLocation);

    // Harmonize description so bedroom and bathroom wording seamlessly matches user criteria
    let adaptedDescription = apt.description;
    adaptedDescription = adaptedDescription
      .replace(/\b\d+B\/\d+B\b/gi, `${targetBedrooms}B/${targetBathrooms}B`)
      .replace(/\b\d+\s*Bed\s*\/\s*\d+\s*Bath\b/gi, `${targetBedrooms} Bed / ${targetBathrooms} Bath`)
      .replace(/\b(one|two|three|\d+)-bedroom,\s*(one|two|three|\d+)-bathroom\b/gi, `${targetBedrooms}-bedroom, ${targetBathrooms}-bathroom`);

    if (targetBathrooms === 1) {
      adaptedDescription = adaptedDescription
        .replace(/two\s*bathrooms|three\s*bathrooms|three\s*lavish\s*full\s*bathrooms/gi, "one full bathroom")
        .replace(/dual\s*master|triple\s*master/gi, "spacious master")
        .replace(/dual\s*vanities|double\s*vanity|double\s*sink\s*vanities/gi, "designer vanity")
        .replace(/every\s*single\s*bedroom\s*has\s*its\s*own\s*private\s*ensuite\s*bathroom/gi, "convenient central bathroom layout")
        .replace(/each\s*bedroom\s*with\s*en-suite\s*bath/gi, "central bathroom layout")
        .replace(/marble\s*bathrooms/gi, "designer marble bathroom");
    } else if (targetBathrooms === 2) {
      adaptedDescription = adaptedDescription
        .replace(/three\s*bathrooms|three\s*lavish\s*full\s*bathrooms|one\s*bathroom/gi, "two full bathrooms")
        .replace(/triple\s*master/gi, "dual master")
        .replace(/every\s*single\s*bedroom\s*has\s*its\s*own\s*private\s*ensuite\s*bathroom/gi, "private master suite plus guest bath")
        .replace(/each\s*bedroom\s*with\s*en-suite\s*bath/gi, "master ensuite and hallway bath");
    } else if (targetBathrooms === 3) {
      adaptedDescription = adaptedDescription
        .replace(/one\s*bathroom|two\s*bathrooms/gi, "three full bathrooms");
    }

    // Harmonize title layout suffix — universal replacement for all bed/bath patterns
    let adaptedTitle = apt.title;
    // Replace compact "XB/YB" shorthand (e.g. "1B/1B", "2B/2B", "3B/2B")
    adaptedTitle = adaptedTitle.replace(
      /\b\d+B\/\d+B\b/gi,
      `${targetBedrooms}B/${targetBathrooms}B`
    );
    // Replace verbose "X Bed Y Bath" / "X Bed/Y Bath" patterns (e.g. "1 Bed 1 Bath", "2 Bed / 1 Bath")
    adaptedTitle = adaptedTitle.replace(
      /\b(\d+)\s*Bed(?:room)?s?\s*[/]?\s*(\d+)\s*Bath(?:room)?s?\b/gi,
      `${targetBedrooms} Bed ${targetBathrooms} Bath`
    );

    return {
      ...apt,
      title: adaptedTitle,
      category: effectiveCategory,
      bedrooms: targetBedrooms,
      bathrooms: targetBathrooms,
      description: adaptedDescription,
      isManual: false,
      isExactMatch: false,
      displayLocation,
      addressTemplate: displayLocation,
      displayRent: finalRent,
      matchScore: item.score,
      matchHighlights: item.highlights.length > 0 ? item.highlights : ["Verified Listing", "Prime Neighborhood", "Ready for Move-In"],
    };
  });

  // 4. COMBINE: REAL MANUAL UNITS FIRST, CHAMELEON UNITS SECOND
  const finalResults: MatchedApartmentResult[] = [...matchedManualUnits, ...adaptedChameleons];

  // Final priority sort:
  // 1. Exact bedroom match
  // 2. Exact bathroom match
  // 3. Match score descending
  finalResults.sort((a, b) => {
    const aBed = a.bedrooms === targetBedrooms ? 1 : 0;
    const bBed = b.bedrooms === targetBedrooms ? 1 : 0;
    if (aBed !== bBed) return bBed - aBed;

    const aBath = a.bathrooms === targetBathrooms ? 1 : 0;
    const bBath = b.bathrooms === targetBathrooms ? 1 : 0;
    if (aBath !== bBath) return bBath - aBath;

    return b.matchScore - a.matchScore;
  });

  return finalResults;
}
