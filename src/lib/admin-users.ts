import fs from "fs";
import path from "path";
import crypto from "crypto";
import { connectToDatabase } from "./mongodb";
import AdminUser from "@/models/AdminUser";
import { IAdminUser, AdminUserRole } from "@/types";
import { updateApartmentsCreator } from "./store";
import { updateAuditLogsUsername } from "./admin-audit";

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "admin_users.json");

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {
    console.error("Error creating data directory for admin users:", e);
  }
}

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "utf-8");
    const bufB = Buffer.from(b, "utf-8");
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export function getDefaultSeedUsers(): IAdminUser[] {
  const now = new Date().toISOString();
  return [
    {
      id: "usr_sanzid",
      username: "sanzid",
      password: "adminsanzid",
      displayName: "Sanzid",
      role: "admin",
      createdBy: "system",
      isActive: true,
      createdAt: now,
    },
    {
      id: "usr_sihabali",
      username: "sihabali",
      password: "adminsihab",
      displayName: "Sihab Ali",
      role: "admin",
      createdBy: "system",
      isActive: true,
      createdAt: now,
    },
  ];
}


export function loadPersistedAdminUsers(): IAdminUser[] {
  ensureDataDir();
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      if (!data || !data.trim()) return getDefaultSeedUsers();
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure default admin accounts exist
        const seedUsers = getDefaultSeedUsers();
        let changed = false;
        for (const seed of seedUsers) {
          if (!parsed.some((u: IAdminUser) => u.username.toLowerCase() === seed.username.toLowerCase())) {
            parsed.push(seed);
            changed = true;
          }
        }
        if (changed) {
          savePersistedAdminUsers(parsed);
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading admin users file:", e);
  }

  const initial = getDefaultSeedUsers();
  savePersistedAdminUsers(initial);
  return initial;
}

export function savePersistedAdminUsers(users: IAdminUser[]): void {
  ensureDataDir();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving admin users file:", e);
  }
}

/**
 * Ensures seed admin accounts exist in MongoDB Atlas if connected
 */
export async function syncSeedUsersToDatabase(): Promise<void> {
  try {
    const isDb = await connectToDatabase();
    if (!isDb) return;

    const seedUsers = getDefaultSeedUsers();
    for (const seed of seedUsers) {
      const existing = await AdminUser.findOne({ username: seed.username.toLowerCase() }).exec();
      if (!existing) {
        await AdminUser.create({
          username: seed.username.toLowerCase(),
          password: seed.password,
          displayName: seed.displayName,
          role: seed.role,
          createdBy: "system",
          isActive: true,
        });
      }
    }
  } catch (err) {
    console.error("Error syncing seed admin users to database:", err);
  }
}

/**
 * Retrieve all registered admin users (from DB or local file)
 */
export async function getAllAdminUsers(): Promise<IAdminUser[]> {
  const localUsers = loadPersistedAdminUsers();
  try {
    const isDb = await connectToDatabase();
    if (isDb) {
      const dbUsers = await AdminUser.find().sort({ createdAt: -1 }).lean().exec();
      if (dbUsers && dbUsers.length > 0) {
        const mapped: IAdminUser[] = dbUsers.map((doc: any) => ({
          _id: doc._id?.toString(),
          id: doc._id?.toString(),
          username: doc.username,
          password: doc.password,
          displayName: doc.displayName || doc.username,
          role: (doc.role as AdminUserRole) || "editor",
          createdBy: doc.createdBy || "system",
          isActive: doc.isActive !== false,
          createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt || new Date().toISOString()),
          updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : undefined,
        }));

        // Merge with any local users not yet in DB
        for (const local of localUsers) {
          if (!mapped.some((m) => m.username.toLowerCase() === local.username.toLowerCase())) {
            mapped.push(local);
          }
        }
        return mapped;
      }

      // MongoDB connected but collection is empty → seed default root users
      try {
        await syncSeedUsersToDatabase();
      } catch (_) {}
    }
  } catch (err) {
    console.error("Error reading admin users from MongoDB:", err);
  }

  return localUsers;
}

/**
 * Find user by case-insensitive username
 */
export async function findAdminUser(username: string): Promise<IAdminUser | null> {
  const clean = username.trim().toLowerCase();
  if (!clean || clean === "admin") return null;

  try {
    const isDb = await connectToDatabase();
    if (isDb) {
      const doc = await AdminUser.findOne({ username: clean }).lean().exec();
      if (doc) {
        return {
          _id: (doc as any)._id?.toString(),
          id: (doc as any)._id?.toString(),
          username: (doc as any).username,
          password: (doc as any).password,
          displayName: (doc as any).displayName || (doc as any).username,
          role: ((doc as any).role as AdminUserRole) || "editor",
          createdBy: (doc as any).createdBy || "system",
          isActive: (doc as any).isActive !== false,
          createdAt: (doc as any).createdAt instanceof Date ? (doc as any).createdAt.toISOString() : String((doc as any).createdAt),
        };
      }
    }
  } catch (err) {
    console.error("Error finding admin user in DB:", err);
  }

  const localUsers = loadPersistedAdminUsers();
  const matched = localUsers.find((u) => u.username.toLowerCase() === clean);
  return matched || null;
}

/**
 * Verify credentials during login
 */
export async function verifyUserCredentials(
  username: string,
  password: string
): Promise<{ username: string; displayName: string; role: AdminUserRole } | null> {
  let clean = username.trim().toLowerCase();
  if (!clean || clean === "admin") return null;

  // Seamless alias: allow sihab to log into sihabali
  if (clean === "sihab") {
    clean = "sihabali";
  }

  // 1. Check database and local users
  const user = await findAdminUser(clean);

  if (user && user.password && user.isActive) {
    if (safeCompare(password, user.password)) {
      return {
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      };
    }
  }

  // 2. Fallback to process.env.ADMIN_USERS (e.g. "sihabali:adminsihab,sanzid:adminsanzid")
  if (process.env.ADMIN_USERS) {
    const pairs = process.env.ADMIN_USERS.split(",");
    for (const pair of pairs) {
      const colon = pair.indexOf(":");
      if (colon > 0) {
        const u = pair.slice(0, colon).trim();
        const p = pair.slice(colon + 1).trim();
        if (u.toLowerCase() === clean && safeCompare(password, p)) {
          const isSihab = clean === "sihabali" || clean === "sihab";
          return {
            username: clean,
            displayName: isSihab ? "Sihab Ali" : "Sanzid",
            role: "admin",
          };
        }
      }
    }
  }

  // 3. Fallback to process.env.ADMIN_USERNAME/PASSWORD
  if (
    process.env.ADMIN_USERNAME &&
    process.env.ADMIN_PASSWORD &&
    process.env.ADMIN_USERNAME.trim().toLowerCase() === clean &&
    safeCompare(password, process.env.ADMIN_PASSWORD.trim())
  ) {
    return {
      username: clean,
      displayName: clean === "sanzid" ? "Sanzid" : "Administrator",
      role: "admin",
    };
  }

  return null;
}

/**
 * Register a new Admin or Editor user
 */
export async function createAdminUser(data: {
  username: string;
  password: string;
  displayName: string;
  role: AdminUserRole;
  createdBy: string;
}): Promise<IAdminUser> {
  const cleanUsername = data.username.trim().toLowerCase();
  const cleanDisplayName = data.displayName.trim();
  const cleanPassword = data.password.trim();
  const role = data.role === "admin" ? "admin" : "editor";

  // Check if user already exists
  const existing = await findAdminUser(cleanUsername);
  if (existing) {
    throw new Error(`Username "${cleanUsername}" is already in use.`);
  }

  const now = new Date().toISOString();
  let createdUser: IAdminUser = {
    id: `usr_${Date.now()}`,
    username: cleanUsername,
    password: cleanPassword,
    displayName: cleanDisplayName,
    role,
    createdBy: data.createdBy,
    isActive: true,
    createdAt: now,
  };

  // 1. Save to MongoDB Atlas if connected
  try {
    const isDb = await connectToDatabase();
    if (isDb) {
      const doc = await AdminUser.create({
        username: cleanUsername,
        password: cleanPassword,
        displayName: cleanDisplayName,
        role,
        createdBy: data.createdBy,
        isActive: true,
      });
      createdUser = {
        _id: doc._id.toString(),
        id: doc._id.toString(),
        username: doc.username,
        password: doc.password,
        displayName: doc.displayName,
        role: doc.role as AdminUserRole,
        createdBy: doc.createdBy,
        isActive: doc.isActive,
        createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
      };
    }
  } catch (err) {
    console.error("Error creating AdminUser in MongoDB:", err);
  }

  // 2. Always persist to local storage cache
  const localUsers = loadPersistedAdminUsers();
  if (!localUsers.some((u) => u.username.toLowerCase() === cleanUsername)) {
    localUsers.unshift(createdUser);
    savePersistedAdminUsers(localUsers);
  }

  return createdUser;
}

/**
 * Delete an admin or editor user account.
 * Root founders (sanzid, sihabali) are permanently protected.
 * Users cannot delete their own accounts.
 */
export async function deleteAdminUser(params: {
  id?: string;
  username?: string;
  requestingUsername?: string;
}): Promise<{ success: boolean; message: string; deletedUsername: string }> {
  const cleanUsername = params.username ? params.username.trim().toLowerCase() : "";
  const requesting = params.requestingUsername ? params.requestingUsername.trim().toLowerCase() : "";

  // 1. Find user from MongoDB Atlas or local storage
  let target = await findAdminUser(cleanUsername);
  if (!target && params.id) {
    try {
      const isDb = await connectToDatabase();
      if (isDb) {
        const doc = await AdminUser.findById(params.id).lean().exec();
        if (doc) {
          target = {
            _id: (doc as any)._id?.toString(),
            id: (doc as any)._id?.toString(),
            username: (doc as any).username,
            password: (doc as any).password,
            displayName: (doc as any).displayName || (doc as any).username,
            role: ((doc as any).role as AdminUserRole) || "editor",
            createdBy: (doc as any).createdBy || "system",
            isActive: (doc as any).isActive !== false,
            createdAt: (doc as any).createdAt instanceof Date ? (doc as any).createdAt.toISOString() : String((doc as any).createdAt),
          };
        }
      }
    } catch (_) {}
  }

  if (!target) {
    throw new Error("User not found.");
  }

  const targetUsername = target.username.toLowerCase();

  // Safety 1: Cannot delete self
  if (requesting && targetUsername === requesting) {
    throw new Error("You cannot delete your own account.");
  }

  // Safety 2: Cannot delete root permanent administrators
  if (targetUsername === "sanzid" || targetUsername === "sihabali") {
    throw new Error("Root administrator accounts (Sanzid, Sihab Ali) are protected and cannot be deleted.");
  }

  // 2. Delete from MongoDB Atlas if connected
  try {
    const isDb = await connectToDatabase();
    if (isDb) {
      await AdminUser.deleteMany({
        $or: [
          { username: targetUsername },
          ...(target._id ? [{ _id: target._id }] : []),
          ...(target.id ? [{ id: target.id }] : []),
        ],
      });
    }
  } catch (err) {
    console.error("Error deleting AdminUser from MongoDB:", err);
  }

  // 3. Delete from local storage cache
  try {
    let users = loadPersistedAdminUsers();
    users = users.filter((u) => u.username.toLowerCase() !== targetUsername && u.id !== target!.id && u._id !== target!._id);
    savePersistedAdminUsers(users);
  } catch (_) {}

  // 4. Invalidate memory activity
  if (globalThis.__apartmento_admin_activity && globalThis.__apartmento_admin_activity[targetUsername]) {
    delete globalThis.__apartmento_admin_activity[targetUsername];
  }

  // 5. Update any apartments created by this user: set name and username to "Deleted User"
  try {
    await updateApartmentsCreator(targetUsername, "deleted_user", "Deleted User", target.displayName);
  } catch (reassignErr) {
    console.error("Error updating deleted user's apartments:", reassignErr);
  }

  return {
    success: true,
    message: `User ${target.displayName} (@${target.username}) was deleted successfully.`,
    deletedUsername: target.username,
  };
}

/**
 * Update an admin or editor user's role.
 * Root founders (sanzid, sihabali) are permanently protected from being demoted.
 * Users cannot demote their own account.
 */
export async function updateAdminUserRole(params: {
  username: string;
  role: AdminUserRole;
  requestingUsername?: string;
}): Promise<{ success: boolean; message: string; user: IAdminUser }> {
  const cleanUsername = params.username.trim().toLowerCase();
  const requesting = params.requestingUsername ? params.requestingUsername.trim().toLowerCase() : "";
  const newRole: AdminUserRole = params.role === "admin" ? "admin" : "editor";

  // Prevent demoting permanent root founders
  if ((cleanUsername === "sanzid" || cleanUsername === "sihabali") && newRole !== "admin") {
    throw new Error("Root administrator accounts (Sanzid, Sihab Ali) are protected and cannot be demoted.");
  }

  // Prevent self-demotion
  if (requesting && cleanUsername === requesting && newRole !== "admin") {
    throw new Error("You cannot demote your own account.");
  }

  // 1. Find user from MongoDB Atlas or local storage
  const target = await findAdminUser(cleanUsername);
  if (!target) {
    throw new Error(`User @${cleanUsername} not found.`);
  }

  target.role = newRole;
  target.updatedAt = new Date().toISOString();

  // 2. Update in MongoDB Atlas if connected
  try {
    const isDb = await connectToDatabase();
    if (isDb) {
      await AdminUser.updateOne(
        { username: cleanUsername },
        { $set: { role: newRole, updatedAt: new Date() } }
      );
    }
  } catch (err) {
    console.error("Error updating AdminUser role in MongoDB:", err);
  }

  // 3. Update in local storage cache
  try {
    const users = loadPersistedAdminUsers();
    const localTarget = users.find((u) => u.username.toLowerCase() === cleanUsername);
    if (localTarget) {
      localTarget.role = newRole;
      localTarget.updatedAt = new Date().toISOString();
      savePersistedAdminUsers(users);
    }
  } catch (_) {}

  return {
    success: true,
    message: `Role for ${target.displayName} (@${target.username}) updated to ${newRole.toUpperCase()}.`,
    user: target,
  };
}

/**
 * Update user credentials (displayName, username, password, role)
 */
export async function updateAdminUserProfile(params: {
  targetUsername: string;
  newUsername?: string;
  displayName?: string;
  password?: string;
  role?: AdminUserRole;
  requestingUsername?: string;
  requestingRole?: AdminUserRole;
}): Promise<{ success: boolean; message: string; user: IAdminUser; usernameChanged: boolean }> {
  const currentUsername = params.targetUsername.trim().toLowerCase();
  const requesting = (params.requestingUsername || "").trim().toLowerCase();
  const isAdmin = params.requestingRole === "admin";
  const isSelf = requesting === currentUsername;

  if (!isAdmin && !isSelf) {
    throw new Error("Unauthorized: You do not have permission to modify this account.");
  }

  // 1. Find target user from MongoDB Atlas or local storage
  const target = await findAdminUser(currentUsername);
  if (!target) {
    throw new Error(`User @${currentUsername} not found.`);
  }

  let usernameChanged = false;

  // 1. Update display name if provided
  if (params.displayName !== undefined) {
    const cleanDisplay = params.displayName.trim();
    if (cleanDisplay.length < 2) {
      throw new Error("Display Name must be at least 2 characters.");
    }
    target.displayName = cleanDisplay;
  }

  // 2. Update password if provided
  if (params.password !== undefined && params.password.trim().length > 0) {
    const cleanPass = params.password.trim();
    if (cleanPass.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }
    target.password = cleanPass;
  }

  // 3. Update username if provided and different
  if (params.newUsername !== undefined) {
    const nextUsername = params.newUsername.trim().toLowerCase();
    if (nextUsername && nextUsername !== currentUsername) {
      // Root accounts protection
      if (currentUsername === "sanzid" || currentUsername === "sihabali") {
        throw new Error("The username for root accounts (Sanzid, Sihab Ali) is protected and cannot be changed.");
      }

      if (nextUsername.length < 3 || nextUsername.length > 30) {
        throw new Error("Username must be between 3 and 30 characters.");
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(nextUsername)) {
        throw new Error("Username can only contain letters, numbers, underscores, and dashes.");
      }

      if (nextUsername === "admin") {
        throw new Error("The username 'admin' is reserved.");
      }

      const existing = await findAdminUser(nextUsername);
      if (existing && existing.username.toLowerCase() !== currentUsername) {
        throw new Error(`Username "@${nextUsername}" is already in use by another account.`);
      }

      target.username = nextUsername;
      usernameChanged = true;

      // Invalidate/transfer memory activity
      if (globalThis.__apartmento_admin_activity && globalThis.__apartmento_admin_activity[currentUsername]) {
        globalThis.__apartmento_admin_activity[nextUsername] = globalThis.__apartmento_admin_activity[currentUsername];
        delete globalThis.__apartmento_admin_activity[currentUsername];
      }
    }
  }

  // 4. Update role if provided and requester is admin
  if (params.role !== undefined && isAdmin) {
    if ((currentUsername === "sanzid" || currentUsername === "sihabali") && params.role !== "admin") {
      throw new Error("Root administrator accounts cannot be demoted.");
    }
    if (isSelf && params.role !== "admin") {
      throw new Error("You cannot demote your own account.");
    }
    target.role = params.role;
  }

  target.updatedAt = new Date().toISOString();

  // Save to MongoDB Atlas if connected
  try {
    const isDb = await connectToDatabase();
    if (isDb) {
      const updateFields: any = {
        displayName: target.displayName,
        updatedAt: new Date(),
      };
      if (params.password && params.password.trim()) {
        updateFields.password = target.password;
      }
      if (usernameChanged) {
        updateFields.username = target.username;
      }
      if (params.role && isAdmin) {
        updateFields.role = target.role;
      }

      await AdminUser.updateOne(
        { username: currentUsername },
        { $set: updateFields }
      );
    }
  } catch (err) {
    console.error("Error updating AdminUser profile in MongoDB:", err);
  }

  // Also update in local storage cache if available
  try {
    const users = loadPersistedAdminUsers();
    const localTarget = users.find((u) => u.username.toLowerCase() === currentUsername);
    if (localTarget) {
      localTarget.displayName = target.displayName;
      localTarget.role = target.role;
      localTarget.updatedAt = target.updatedAt;
      if (params.password && params.password.trim()) {
        localTarget.password = target.password;
      }
      if (usernameChanged) {
        localTarget.username = target.username;
      }
      savePersistedAdminUsers(users);
    }
  } catch (_) {}

  // 5. Cascade updates to apartments & audit logs
  if (usernameChanged) {
    try {
      await updateApartmentsCreator(currentUsername, target.username, target.displayName);
      await updateAuditLogsUsername(currentUsername, target.username);
    } catch (cascadeErr) {
      console.error("Cascade update error on username change:", cascadeErr);
    }
  } else if (params.displayName !== undefined) {
    try {
      await updateApartmentsCreator(currentUsername, currentUsername, target.displayName);
    } catch (cascadeErr) {
      console.error("Cascade update error on displayName change:", cascadeErr);
    }
  }

  return {
    success: true,
    message: usernameChanged
      ? `User profile updated! New username is @${target.username}.`
      : `Profile for ${target.displayName} (@${target.username}) updated successfully.`,
    user: target,
    usernameChanged,
  };
}

