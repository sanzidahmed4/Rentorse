export type ApartmentCategory = "1B1B" | "2B2B" | "3B2B" | "3B3B";
export type FurnishedStatus = "Furnished" | "Unfurnished" | "Either";
export type PetPolicy = "Dogs & Cats Allowed" | "Cats Only" | "No Pets";
export type LeadStatus = "New" | "Contacted" | "Qualified" | "Matched" | "Converted" | "Closed";

export interface IApartment {
  _id?: string;
  id?: string;
  serialNumber?: number;
  title: string;
  slug: string;
  description: string;
  category: ApartmentCategory;
  bedrooms: number;
  bathrooms: number;
  baseRent: number;
  squareFeet: number;
  furnished: FurnishedStatus;
  hasKitchen: boolean;
  petPolicy: PetPolicy;
  amenities: string[];
  images: string[];
  featured: boolean;
  isActive: boolean;
  deposit: number;
  availableDate: string;
  rating: number;
  reviewsCount: number;
  addressTemplate?: string;
  // Dynamically populated chameleon fields for user search:
  displayLocation?: string;
  displayRent?: number;
  matchScore?: number;
}

export interface ILead {
  _id?: string;
  id?: string;
  serialNumber?: number;
  fullName: string;
  phone: string;
  email: string;
  isUsResident: boolean;
  age: number;
  familyMembers: number;
  hasPets: boolean;
  petDetails?: string;
  bedrooms: number;
  bathrooms: number;
  furnished: FurnishedStatus;
  kitchenRequired: boolean;
  amenities: string[];
  budgetMin: number;
  budgetMax: number;
  creditScore?: string; // e.g. "Good (660 - 719)" or "No Credit Score"
  desiredLocation: string; // e.g. "NY 11004" or "Chicago 60007"
  matchedApartments: string[]; // IDs of matched apartments
  selectedApartmentId?: string;
  selectedApartmentTitle?: string;
  selectedApartmentPrice?: number;
  status: LeadStatus;
  notes?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface ISiteStat {
  _id?: string;
  id?: string;
  activeApartments: string;
  activeRenters: string;
  propertiesListed: string;
  customersServed: string;
  satisfactionRate: string;
  updatedAt?: string | Date;
}

export interface FunnelFormData {
  // Step 1: Personal info
  fullName: string;
  phone: string;
  email: string;
  // Step 2: US Resident
  isUsResident: boolean;
  // Step 3: Age
  age: number;
  // Step 4: Family / Household size
  familyMembers: number;
  // Step 5: Pets
  hasPets: boolean;
  petDetails: string;
  // Step 6: Apartment specs
  bedrooms: number;
  bathrooms: number;
  furnished: FurnishedStatus;
  kitchenRequired: boolean;
  amenities: string[];
  // Step 7: Budget
  budgetMin: number;
  budgetMax: number;
  // Step 8: Credit Score
  creditScore: string;
  // Step 9: Location
  desiredLocation: string;
  // Optional target apartment for direct quiz routing
  selectedApartmentId?: string;
  selectedApartmentTitle?: string;
  selectedApartmentPrice?: number;
}
