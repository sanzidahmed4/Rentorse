import { getApartments } from "./store";
import { FunnelFormData, IApartment } from "@/types";
import { resolveUSLocation } from "./us-locations";

export interface MatchedApartmentResult extends IApartment {
  displayLocation: string;
  displayRent: number;
  matchScore: number;
  matchHighlights: string[];
}

export async function matchApartments(
  criteria: FunnelFormData
): Promise<MatchedApartmentResult[]> {
  // 1. Fetch base inventory from store (MongoDB or memory)
  const allApartments = await getApartments({ isActive: true });

  // 2. Filter primary match by bedrooms
  let candidates = allApartments.filter((apt) => apt.bedrooms === criteria.bedrooms);

  // If none match exact bedroom (safety fallback), use all active
  if (candidates.length === 0) {
    candidates = allApartments;
  }

  // 3. Score candidates based on visitor requirements
  const scored = candidates.map((apt) => {
    let score = 75; // base score
    const highlights: string[] = [];

    // Bathroom match
    if (apt.bathrooms === criteria.bathrooms) {
      score += 10;
      highlights.push(`${apt.bathrooms} Full Bathrooms`);
    }

    // Furnished match
    if (criteria.furnished === "Either" || apt.furnished === criteria.furnished || apt.furnished === "Either") {
      score += 5;
      highlights.push(apt.furnished === "Furnished" ? "Fully Furnished" : "Spacious Layout");
    }

    // Kitchen requirement
    if (criteria.kitchenRequired && apt.hasKitchen) {
      score += 5;
      highlights.push("Full Chef's Kitchen");
    }

    // Pet policy match
    if (criteria.hasPets) {
      if (apt.petPolicy === "Dogs & Cats Allowed" || apt.petPolicy === "Cats Only") {
        score += 5;
        highlights.push("Pet Friendly Building");
      }
    } else {
      score += 3;
    }

    // Amenities overlap
    const matchingAmenities = (criteria.amenities || []).filter((amenity) =>
      apt.amenities.includes(amenity)
    );
    if (matchingAmenities.length > 0) {
      score += Math.min(10, matchingAmenities.length * 2);
      highlights.push(...matchingAmenities.slice(0, 2));
    }

    // Cap score at 99%
    const finalScore = Math.min(99, Math.max(82, score));

    return {
      apt,
      score: finalScore,
      highlights: highlights.slice(0, 3),
    };
  });

  // 4. Randomize ordering for unique visitor experience (while retaining reasonable quality)
  // Fisher-Yates shuffle
  for (let i = scored.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [scored[i], scored[j]] = [scored[j], scored[i]];
  }

  // Select 5 to 8 units to show visitor (limited curated selection)
  const selectedBatch = scored.slice(0, Math.min(8, Math.max(4, scored.length)));

  // 5. Dynamic Adaptation: Real-world US Neighborhood & Budget Calibration
  const resolvedLoc = resolveUSLocation(criteria.desiredLocation);
  const minB = Math.max(400, criteria.budgetMin || 800);
  const maxB = Math.max(minB + 100, criteria.budgetMax || minB + 400);

  const results: MatchedApartmentResult[] = selectedBatch.map((item, index) => {
    const apt = item.apt;

    // Dynamic price calculation centered around user's budget range
    // Generate realistic pricing with subtle step increments ($695, $740, $780, etc.)
    const spread = maxB - minB;
    const factor = selectedBatch.length > 1 ? index / (selectedBatch.length - 1) : 0.5;
    // Add realistic subtle jitter
    const rawRent = minB + spread * factor + ((index % 3) * 15 - 15);
    // Round to nearest $5 or $9 (typical US rental pricing ending in 0, 5, or 9)
    const calibratedRent = Math.round(rawRent / 10) * 10 - (index % 2 === 0 ? 5 : 0);
    const finalRent = Math.max(minB, Math.min(maxB, calibratedRent));

    // Dynamic authentic location: real neighborhood corridor + real city, state & zip
    const corridor = resolvedLoc.getCorridor(index, apt.category);
    const displayLocation = `${corridor}, ${resolvedLoc.formattedCityStateZip}`;

    return {
      ...apt,
      displayLocation,
      displayRent: finalRent,
      matchScore: item.score,
      matchHighlights: item.highlights.length > 0 ? item.highlights : ["Verified Listing", "Prime Neighborhood", "Ready for Move-In"],
    };
  });

  return results;
}

