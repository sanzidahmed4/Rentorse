import fs from "fs";
import path from "path";
import { connectToDatabase } from "./mongodb";
import Apartment from "@/models/Apartment";
import Lead from "@/models/Lead";
import SiteStat from "@/models/SiteStat";
import { SEED_APARTMENTS } from "./seed-data";
import { IApartment, ILead, ISiteStat } from "@/types";

declare global {
  // eslint-disable-next-line no-var
  var __apartmento_memory_leads: ILead[] | undefined;
  // eslint-disable-next-line no-var
  var __apartmento_memory_apartments: IApartment[] | undefined;
  // eslint-disable-next-line no-var
  var __apartmento_memory_stats: ISiteStat | undefined;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const APARTMENTS_FILE = path.join(DATA_DIR, "apartments.json");
const STATS_FILE = path.join(DATA_DIR, "stats.json");

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {
    console.error("Error creating data directory:", e);
  }
}

function loadPersistedLeads(): ILead[] {
  ensureDataDir();
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        let needsSave = false;
        // Sort chronologically ascending to calculate default serial numbers if missing
        const sortedByDate = [...parsed].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        sortedByDate.forEach((lead, idx) => {
          if (!lead.serialNumber) {
            lead.serialNumber = idx + 1;
            needsSave = true;
          }
        });
        if (needsSave) {
          savePersistedLeads(parsed);
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error loading leads from file:", e);
  }
  return [];
}

function savePersistedLeads(leads: ILead[]) {
  ensureDataDir();
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving leads to file:", e);
  }
}

function loadPersistedApartments(): IApartment[] {
  ensureDataDir();
  try {
    if (fs.existsSync(APARTMENTS_FILE)) {
      const data = fs.readFileSync(APARTMENTS_FILE, "utf-8");
      const parsed: IApartment[] = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let needsSave = false;
        // Sync any updated addressTemplate and assign sequential serialNumber if missing
        const synced = parsed.map((apt, idx) => {
          const seed = SEED_APARTMENTS.find((s) => s.id === apt.id || s.slug === apt.slug);
          let updated = seed ? { ...apt, isManual: apt.isManual !== undefined ? apt.isManual : false } : { ...apt, isManual: apt.isManual !== undefined ? apt.isManual : true };
          if (!updated.serialNumber) {
            updated = { ...updated, serialNumber: idx + 1 };
            needsSave = true;
          }
          return updated;
        });
        if (needsSave) {
          savePersistedApartments(synced);
        }
        return synced;
      }
    }
  } catch (e) {
    console.error("Error loading apartments from file:", e);
  }
  const defaults = [...SEED_APARTMENTS.map((apt, idx) => ({ ...apt, _id: `apt_${idx + 1}`, serialNumber: idx + 1, isManual: false }))];
  savePersistedApartments(defaults);
  return defaults;
}

function savePersistedApartments(apts: IApartment[]) {
  ensureDataDir();
  try {
    fs.writeFileSync(APARTMENTS_FILE, JSON.stringify(apts, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving apartments to file:", e);
  }
}

function loadPersistedStats(): ISiteStat {
  ensureDataDir();
  try {
    if (fs.existsSync(STATS_FILE)) {
      const data = fs.readFileSync(STATS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch (e) {
    console.error("Error loading stats from file:", e);
  }
  return {
    _id: "stat_default",
    activeApartments: "3,250+",
    activeRenters: "12,500+",
    propertiesListed: "4,200+",
    customersServed: "9,800+",
    satisfactionRate: "99.4%",
  };
}

function savePersistedStats(stats: ISiteStat) {
  ensureDataDir();
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving stats to file:", e);
  }
}

let memoryApartments: IApartment[] = globalThis.__apartmento_memory_apartments || loadPersistedApartments();
globalThis.__apartmento_memory_apartments = memoryApartments;

let memoryLeads: ILead[] = globalThis.__apartmento_memory_leads || loadPersistedLeads();
globalThis.__apartmento_memory_leads = memoryLeads;

let memoryStats: ISiteStat = globalThis.__apartmento_memory_stats || loadPersistedStats();
globalThis.__apartmento_memory_stats = memoryStats;

// ================= APARTMENTS =================

export async function getApartments(filter?: {
  category?: string;
  bedrooms?: number;
  bathrooms?: number;
  isActive?: boolean;
}): Promise<IApartment[]> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const query: Record<string, unknown> = {};
      if (filter?.category) query.category = filter.category;
      if (filter?.bedrooms) query.bedrooms = filter.bedrooms;
      if (filter?.bathrooms) query.bathrooms = filter.bathrooms;
      if (typeof filter?.isActive === "boolean") query.isActive = filter.isActive;

      const items = await Apartment.find(query).sort({ createdAt: 1, _id: 1 }).lean().exec();
      if (items.length > 0) {
        const seenSerials = new Set<number>();
        let hasDuplicateOrMissing = false;

        for (const item of items) {
          if (!item.serialNumber || seenSerials.has(item.serialNumber)) {
            hasDuplicateOrMissing = true;
            break;
          }
          seenSerials.add(item.serialNumber);
        }

        const result = items.map((item, idx) => {
          const serial = hasDuplicateOrMissing ? idx + 1 : (item.serialNumber || idx + 1);
          return {
            ...item,
            _id: (item as { _id?: unknown })._id?.toString(),
            serialNumber: serial,
          };
        }) as unknown as IApartment[];

        if (hasDuplicateOrMissing) {
          Promise.all(
            items.map((item, idx) =>
              Apartment.findByIdAndUpdate(
                (item as any)._id,
                { $set: { serialNumber: idx + 1 } }
              ).exec()
            )
          ).catch((e) => console.error("Error auto-healing apartment serial numbers in MongoDB:", e));
        }

        return result;
      }
    } catch (e) {
      console.error("Error querying MongoDB apartments, fallback to memory:", e);
    }
  }

  // Fallback to memory
  return memoryApartments.filter((apt) => {
    if (filter?.category && apt.category !== filter.category) return false;
    if (filter?.bedrooms && apt.bedrooms !== filter.bedrooms) return false;
    if (filter?.bathrooms && apt.bathrooms !== filter.bathrooms) return false;
    if (typeof filter?.isActive === "boolean" && apt.isActive !== filter.isActive) return false;
    return true;
  });
}

export async function getApartmentByIdOrSlug(idOrSlug: string): Promise<IApartment | null> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
      const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };
      const item = await Apartment.findOne(query).lean().exec();
      if (item) {
        return {
          ...item,
          _id: (item as { _id?: unknown })._id?.toString(),
        } as unknown as IApartment;
      }
    } catch (e) {
      console.error("Error finding apartment in MongoDB:", e);
    }
  }

  // Fallback to memory
  return (
    memoryApartments.find(
      (apt) => apt._id === idOrSlug || apt.id === idOrSlug || apt.slug === idOrSlug
    ) || null
  );
}

export async function createApartment(data: Partial<IApartment>): Promise<IApartment> {
  const db = await connectToDatabase();
  const isManualListing = data.isManual !== undefined ? Boolean(data.isManual) : true;

  let nextSerial = data.serialNumber;
  if (!nextSerial) {
    if (db) {
      try {
        const highestApt = await Apartment.findOne().sort({ serialNumber: -1 }).select("serialNumber").lean().exec();
        const highestSerial = highestApt && typeof highestApt.serialNumber === "number" ? highestApt.serialNumber : 0;
        nextSerial = highestSerial + 1;
      } catch (err) {
        console.error("Error fetching highest serial from MongoDB:", err);
      }
    }
    if (!nextSerial) {
      const maxSerial = memoryApartments.reduce(
        (max, a) => Math.max(max, a.serialNumber || 0),
        0
      );
      nextSerial = maxSerial + 1;
    }
  }

  if (db) {
    try {
      const created = await Apartment.create({
        ...data,
        serialNumber: nextSerial,
        isManual: isManualListing,
      });
      return {
        ...created.toObject(),
        _id: created._id.toString(),
      } as unknown as IApartment;
    } catch (e) {
      console.error("Error creating apartment in MongoDB:", e);
    }
  }

  // Memory fallback
  const newApt: IApartment = {
    _id: `apt_${Date.now()}`,
    id: `apt_${Date.now()}`,
    serialNumber: nextSerial,
    title: data.title || "Modern Apartment",
    slug: data.slug || `apt-${Date.now()}`,
    description: data.description || "",
    category: data.category || "1B1B",
    bedrooms: data.bedrooms || 1,
    bathrooms: data.bathrooms || 1,
    baseRent: data.baseRent || 900,
    squareFeet: data.squareFeet || 700,
    furnished: data.furnished || "Unfurnished",
    hasKitchen: data.hasKitchen !== false,
    petPolicy: data.petPolicy || "Dogs & Cats Allowed",
    amenities: data.amenities || [],
    images: data.images?.length ? data.images : [SEED_APARTMENTS[0].images[0]],
    featured: Boolean(data.featured),
    isActive: data.isActive !== false,
    deposit: data.deposit || 0,
    availableDate: data.availableDate || "Immediate",
    rating: data.rating || 4.8,
    reviewsCount: data.reviewsCount || 10,
    addressTemplate: data.addressTemplate || "Apartment Suite",
    isManual: isManualListing,
  };
  memoryApartments.unshift(newApt);
  savePersistedApartments(memoryApartments);
  return newApt;
}

export async function updateApartment(id: string, data: Partial<IApartment>): Promise<IApartment | null> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const updated = await Apartment.findByIdAndUpdate(id, data, { new: true }).lean().exec();
      if (updated) {
        // Also update memory store
        const memIdx = memoryApartments.findIndex((a) => a._id === id || a.id === id);
        if (memIdx !== -1) {
          memoryApartments[memIdx] = { ...memoryApartments[memIdx], ...data };
          savePersistedApartments(memoryApartments);
        }
        return {
          ...updated,
          _id: (updated as { _id?: unknown })._id?.toString(),
        } as unknown as IApartment;
      }
    } catch (e) {
      console.error("Error updating apartment in MongoDB:", e);
    }
  }

  const idx = memoryApartments.findIndex((a) => a._id === id || a.id === id);
  if (idx !== -1) {
    memoryApartments[idx] = { ...memoryApartments[idx], ...data };
    savePersistedApartments(memoryApartments);
    return memoryApartments[idx];
  }
  return null;
}

export async function seedApartmentsIfEmpty(): Promise<number> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const count = await Apartment.countDocuments();
      if (count === 0) {
        const seededWithSerials = SEED_APARTMENTS.map((apt, idx) => ({
          ...apt,
          serialNumber: idx + 1,
        }));
        await Apartment.insertMany(seededWithSerials);
        console.log(`Seeded ${seededWithSerials.length} apartments into MongoDB.`);
        return seededWithSerials.length;
      }
      return count;
    } catch (e) {
      console.error("Error seeding MongoDB apartments:", e);
    }
  }

  if (memoryApartments.length === 0) {
    memoryApartments = [...SEED_APARTMENTS.map((apt, idx) => ({ ...apt, _id: `apt_${idx + 1}`, serialNumber: idx + 1 }))];
  }
  return memoryApartments.length;
}

// ================= LEADS =================

export async function createLead(data: Partial<ILead>): Promise<ILead> {
  const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  let selectedApartmentTitle = data.selectedApartmentTitle || "";
  let selectedApartmentPrice = data.selectedApartmentPrice;
  let apartmentLocation = "";

  if (data.selectedApartmentId) {
    const apt = await getApartmentByIdOrSlug(data.selectedApartmentId);
    if (apt) {
      if (!selectedApartmentTitle) selectedApartmentTitle = apt.title;
      if (!selectedApartmentPrice) selectedApartmentPrice = apt.baseRent;
      apartmentLocation = apt.addressTemplate || "";
    }
  }

  const effectiveLocation =
    (data.desiredLocation && data.desiredLocation.trim()) ||
    apartmentLocation ||
    "United States";

  const db = await connectToDatabase();
  let serialNumber = 1;

  if (db) {
    try {
      const highestLead = await Lead.findOne()
        .sort({ serialNumber: -1 })
        .select("serialNumber")
        .lean()
        .exec();
      if (highestLead && typeof highestLead.serialNumber === "number" && highestLead.serialNumber > 0) {
        serialNumber = highestLead.serialNumber + 1;
      } else {
        const count = await Lead.countDocuments();
        serialNumber = count + 1;
      }
    } catch (e) {
      console.error("Error calculating serialNumber from MongoDB:", e);
      const currentLeads = loadPersistedLeads();
      const maxSerial = currentLeads.reduce((max, l) => Math.max(max, l.serialNumber || 0), 0);
      serialNumber = maxSerial + 1;
    }
  } else {
    const currentLeads = loadPersistedLeads();
    const maxSerial = currentLeads.reduce((max, l) => Math.max(max, l.serialNumber || 0), 0);
    serialNumber = maxSerial + 1;
  }

  const newLead: ILead = {
    _id: leadId,
    id: leadId,
    serialNumber,
    fullName: data.fullName || "Anonymous Renter",
    phone: data.phone || "",
    email: data.email || "",
    isUsResident: data.isUsResident ?? true,
    age: data.age || 25,
    familyMembers: data.familyMembers || 1,
    hasPets: data.hasPets || false,
    petDetails: data.petDetails || "",
    bedrooms: data.bedrooms || 1,
    bathrooms: data.bathrooms || 1,
    furnished: data.furnished || "Either",
    kitchenRequired: data.kitchenRequired ?? true,
    amenities: data.amenities || [],
    budgetMin: data.budgetMin || 800,
    budgetMax: data.budgetMax || 1500,
    creditScore: data.creditScore || "Good (660 - 719)",
    desiredLocation: effectiveLocation,
    matchedApartments: data.matchedApartments || [],
    selectedApartmentId: data.selectedApartmentId,
    selectedApartmentTitle,
    selectedApartmentPrice,
    status: data.status || "New",
    notes: data.notes || "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (db) {
    try {
      const { _id, id, ...leadPayload } = newLead;
      const lead = await Lead.create(leadPayload);
      const savedLead = {
        ...lead.toObject(),
        _id: lead._id.toString(),
      } as unknown as ILead;

      // Persist to disk backup
      const current = loadPersistedLeads();
      current.unshift(savedLead);
      memoryLeads = current;
      globalThis.__apartmento_memory_leads = current;
      savePersistedLeads(current);
      return savedLead;
    } catch (e) {
      console.error("Error creating lead in MongoDB, saving to persistent disk fallback:", e);
    }
  }

  // Persistent disk fallback
  const current = loadPersistedLeads();
  current.unshift(newLead);
  memoryLeads = current;
  globalThis.__apartmento_memory_leads = current;
  savePersistedLeads(current);
  return newLead;
}

export async function getLeads(filter?: {
  status?: string;
  search?: string;
}): Promise<ILead[]> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const query: Record<string, unknown> = {};
      if (filter?.status && filter.status !== "ALL") {
        query.status = filter.status;
      }
      if (filter?.search) {
        const regex = new RegExp(filter.search, "i");
        query.$or = [
          { fullName: regex },
          { email: regex },
          { phone: regex },
          { desiredLocation: regex },
        ];
      }
      const leads = await Lead.find(query).sort({ createdAt: -1 }).lean().exec();
      if (leads.length > 0) {
        return leads.map((l) => ({
          ...l,
          _id: (l as { _id?: unknown })._id?.toString(),
        })) as unknown as ILead[];
      }
    } catch (e) {
      console.error("Error fetching leads from MongoDB, reading persistent fallback:", e);
    }
  }

  // Read latest from persistent storage
  const current = loadPersistedLeads();
  memoryLeads = current;
  globalThis.__apartmento_memory_leads = current;

  return current.filter((l) => {
    if (filter?.status && filter.status !== "ALL" && l.status !== filter.status) return false;
    if (filter?.search) {
      const s = filter.search.toLowerCase();
      const match =
        l.fullName.toLowerCase().includes(s) ||
        l.email.toLowerCase().includes(s) ||
        l.phone.toLowerCase().includes(s) ||
        l.desiredLocation.toLowerCase().includes(s);
      if (!match) return false;
    }
    return true;
  });
}

export async function getLeadById(id: string): Promise<ILead | null> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const lead = await Lead.findById(id).lean().exec();
      if (lead) {
        return {
          ...lead,
          _id: (lead as { _id?: unknown })._id?.toString(),
        } as unknown as ILead;
      }
    } catch (e) {
      console.error("Error getting lead by ID from MongoDB:", e);
    }
  }

  const current = loadPersistedLeads();
  return current.find((l) => l._id === id || l.id === id) || null;
}

export async function updateLead(id: string, data: Partial<ILead>): Promise<ILead | null> {
  if (data.selectedApartmentId && (!data.selectedApartmentTitle || !data.selectedApartmentPrice)) {
    const apts = loadPersistedApartments();
    const apt = apts.find((a) => a._id === data.selectedApartmentId || a.id === data.selectedApartmentId);
    if (apt) {
      data.selectedApartmentTitle = apt.title;
      data.selectedApartmentPrice = apt.baseRent;
    }
  }

  const db = await connectToDatabase();
  if (db) {
    try {
      const updated = await Lead.findByIdAndUpdate(id, data, { new: true }).lean().exec();
      if (updated) {
        const result = {
          ...updated,
          _id: (updated as { _id?: unknown })._id?.toString(),
        } as unknown as ILead;

        // Also update file backup
        const current = loadPersistedLeads();
        const fIdx = current.findIndex((l) => l._id === id || l.id === id);
        if (fIdx !== -1) {
          current[fIdx] = { ...current[fIdx], ...data, updatedAt: new Date() };
          savePersistedLeads(current);
        }
        return result;
      }
    } catch (e) {
      console.error("Error updating lead in MongoDB:", e);
    }
  }

  const current = loadPersistedLeads();
  const idx = current.findIndex((l) => l._id === id || l.id === id);
  if (idx !== -1) {
    current[idx] = { ...current[idx], ...data, updatedAt: new Date() };
    memoryLeads = current;
    globalThis.__apartmento_memory_leads = current;
    savePersistedLeads(current);
    return current[idx];
  }
  return null;
}

export async function deleteLead(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  let deleted = false;
  if (db) {
    try {
      const res = await Lead.deleteOne({ $or: [{ _id: id }, { id }] });
      deleted = (res.deletedCount || 0) > 0;
    } catch (e) {
      console.error("Error deleting lead from MongoDB:", e);
    }
  }

  const current = loadPersistedLeads();
  const filtered = current.filter((l) => l._id !== id && l.id !== id);
  if (filtered.length !== current.length) {
    deleted = true;
    memoryLeads = filtered;
    globalThis.__apartmento_memory_leads = filtered;
    savePersistedLeads(filtered);
  }
  return deleted;
}

export async function clearAllLeads(): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await Lead.deleteMany({});
    } catch (e) {
      console.error("Error clearing leads in MongoDB:", e);
    }
  }

  memoryLeads = [];
  globalThis.__apartmento_memory_leads = [];
  savePersistedLeads([]);
  return true;
}

// ================= SITE STATS =================

export async function getSiteStats(): Promise<ISiteStat> {
  const db = await connectToDatabase();
  if (db) {
    try {
      let stat = await SiteStat.findOne().lean().exec();
      if (!stat) {
        stat = await SiteStat.create(loadPersistedStats());
      }
      return {
        ...stat,
        _id: (stat as { _id?: unknown })._id?.toString(),
      } as unknown as ISiteStat;
    } catch (e) {
      console.error("Error fetching site stats from MongoDB:", e);
    }
  }

  return loadPersistedStats();
}

export async function updateSiteStats(data: Partial<ISiteStat>): Promise<ISiteStat> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const updated = await SiteStat.findOneAndUpdate({}, data, {
        new: true,
        upsert: true,
      }).lean().exec();
      if (updated) {
        const res = {
          ...updated,
          _id: (updated as { _id?: unknown })._id?.toString(),
        } as unknown as ISiteStat;
        savePersistedStats(res);
        return res;
      }
    } catch (e) {
      console.error("Error updating site stats in MongoDB:", e);
    }
  }

  const current = loadPersistedStats();
  const updated = { ...current, ...data, updatedAt: new Date() };
  memoryStats = updated;
  globalThis.__apartmento_memory_stats = updated;
  savePersistedStats(updated);
  return updated;
}
