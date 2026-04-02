import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/canvas-studio'

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: MongooseCache | undefined
}

function getCache(): MongooseCache {
  if (!global.__mongooseCache) {
    global.__mongooseCache = { conn: null, promise: null }
  }
  return global.__mongooseCache
}

/**
 * Singleton MongoDB connection.
 * Safe for Next.js dev hot-reload and production.
 */
export async function connectDB(): Promise<typeof mongoose> {
  const cache = getCache()

  if (cache.conn) {
    return cache.conn
  }

  if (cache.promise) {
    return cache.promise
  }

  cache.promise = mongoose.connect(MONGODB_URI).then((conn) => {
    cache.conn = conn
    cache.promise = null
    return conn
  })

  return cache.promise
}

export { mongoose }
