import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

let lastFailureTime = 0;
const FAILURE_COOLDOWN_MS = 15000;

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    // Return null to indicate MongoDB is not configured; caller can fall back to local store
    return null;
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If a connection attempt recently failed, skip waiting for repeated timeouts
  if (Date.now() - lastFailureTime < FAILURE_COOLDOWN_MS) {
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      lastFailureTime = 0;
      return mongooseInstance;
    }).catch((err) => {
      console.warn("MongoDB connection failed, falling back to in-memory store:", err.message);
      lastFailureTime = Date.now();
      cached.promise = null;
      return null as unknown as typeof mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    lastFailureTime = Date.now();
    cached.promise = null;
    return null;
  }

  return cached.conn;
}

export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI && process.env.MONGODB_URI.trim().length > 0);
}
