// Only import server-only in Next.js runtime, not in standalone scripts
if (typeof window === "undefined" && process.env.NEXT_RUNTIME) {
  require("server-only");
}

// Get MONGODB_URI at runtime, not at module load time
function getMongoDBUri() {
  return process.env.MONGODB_URI;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached: {
  conn: any | null;
  promise: Promise<any> | null;
} = global.mongoose as any;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const MONGODB_URI = getMongoDBUri();
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  // Lazy import mongoose to avoid Edge Runtime issues
  const mongoose = await import("mongoose").then((m) => m.default);

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("✅ MongoDB connected successfully");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

