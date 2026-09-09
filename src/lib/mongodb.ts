import mongoose from "mongoose";

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
const FAILURE_COOLDOWN_MS = 5000; // 5s retry window (down from 15s)

/**
 * Clean and normalize the MongoDB URI string.
 * Strips surrounding single/double quotes, whitespace, and validates scheme.
 */
function getSanitizedMongoUri(): string | null {
  let uri = process.env.MONGODB_URI;
  if (!uri) return null;
  uri = uri.trim();
  // Strip outer quotes if user copied with quotes into Vercel
  if (
    (uri.startsWith('"') && uri.endsWith('"')) ||
    (uri.startsWith("'") && uri.endsWith("'"))
  ) {
    uri = uri.slice(1, -1).trim();
  }
  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    console.error("Invalid MONGODB_URI format. Must start with mongodb:// or mongodb+srv://");
    return null;
  }
  return uri;
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  const uri = getSanitizedMongoUri();
  if (!uri) {
    return null;
  }

  // Reuse existing active connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Cooldown check after connection failure
  if (Date.now() - lastFailureTime < FAILURE_COOLDOWN_MS) {
    return null;
  }

  if (!cached.promise) {
    // Generous timeouts suitable for Vercel serverless cold starts & Atlas free tiers
    const opts = {
      bufferCommands: true, // Allow mongoose to buffer commands until connected
      serverSelectionTimeoutMS: 10000, // 10 seconds (up from 2.5s) for DNS + TLS handshake
      connectTimeoutMS: 10000, // 10 seconds
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongooseInstance) => {
        lastFailureTime = 0;
        return mongooseInstance;
      })
      .catch((err) => {
        console.warn("MongoDB connection failed, falling back to local store:", err.message);
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
  return Boolean(getSanitizedMongoUri());
}
