export type ApartmentCategory = "1B1B" | "2B1B" | "2B2B" | "3B1B" | "3B2B" | "3B3B";
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
  isManual?: boolean;
  // Unit Details (Facebook Marketplace style)
  propertyType?: string;
  climate?: string;
  cooling?: string;
  heating?: string;
  laundry?: string;
  parking?: string;
  cityState?: string;
  // Creator & Timestamp Tracking
  createdBy?: string;
  createdByName?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  // Dynamically populated chameleon fields for user search:
  displayLocation?: string;
  displayRent?: number;
  matchScore?: number;
  isExactMatch?: boolean;
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
  supportEmail?: string;
  supportPhone?: string;
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
  seenApartmentIds?: string[];
}

export interface IAdminLoginLog {
  id: string;
  username: string;
  ip: string;
  device: string;
  browser: string;
  status: "SUCCESS" | "FAILED";
  createdAt: string;
}

export type AdminUserRole = "admin" | "editor";

export interface IAdminUser {
  _id?: string;
  id?: string;
  username: string;
  password?: string;
  displayName: string;
  role: AdminUserRole;
  createdBy?: string;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface IAdminUserSummary {
  id?: string;
  username: string;
  displayName: string;
  role: AdminUserRole;
  createdBy?: string;
  isActive: boolean;
  lastLogin: string | null;
  lastActiveAt: string | null;
  lastIp: string | null;
  lastDevice: string | null;
  totalLogins: number;
  createdAt?: string | Date;
}


