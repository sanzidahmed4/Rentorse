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

export async function matchApartments(
  criteria: FunnelFormData
): Promise<MatchedApartmentResult[]> {
  const queryLocation = (criteria.desiredLocation || "").trim();

  // 1. Fetch base inventory from store (MongoDB or memory)
  const allApartments = await getApartments({ isActive: true });

  // 2. CHECK FOR REAL / MANUAL APARTMENT MATCHES (Only those with a specified location/address)
  const matchedManualUnits: MatchedApartmentResult[] = [];
  const manualApartments = allApartments.filter(
    (apt) => apt.isManual && apt.addressTemplate && apt.addressTemplate.trim().length > 0
  );

  for (const apt of manualApartments) {
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

      if (apt.bedrooms === criteria.bedrooms) {
        score += 5;
        highlights.push(`${apt.bedrooms} Bed Layout Match`);
      }
      if (apt.bathrooms === criteria.bathrooms) {
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

  // 3. TARGET INVENTORY COUNT
  // If we have manual matches, we still provide additional chameleon units so the list is full (total 6 to 8 units)
  const targetTotalCount = 7;
  const remainingSlots = Math.max(0, targetTotalCount - matchedManualUnits.length);

  // Chameleon Pool:
  // Any active apartment that is NOT in matchedManualUnits, and either has NO fixed location or is marked as chameleon
  const matchedIds = new Set(matchedManualUnits.map((m) => m._id || m.id));
  const chameleonPool = allApartments.filter(
    (apt) => !matchedIds.has(apt._id || apt.id) && (!apt.isManual || !apt.addressTemplate || !apt.addressTemplate.trim())
  );

  const targetBedrooms = Number(criteria.bedrooms) || 1;
  const targetBathrooms = Number(criteria.bathrooms) || 1;

  // Helper to shuffle an array organically
  const shuffle = <T>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // Prioritize candidates:
  // 1. Exact match on BOTH bedrooms AND bathrooms
  // 2. Exact match on bedrooms
  // 3. Fallback to general pool if needed
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

  const candidatePool = prioritizedCandidates.length > 0
    ? prioritizedCandidates.slice(0, Math.max(remainingSlots, 8))
    : allApartments.filter((apt) => !matchedIds.has(apt._id || apt.id)).slice(0, remainingSlots);

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

  return finalResults;
}
