import { MongoClient, Db } from 'mongodb'

let client: MongoClient | null = null
let db: Db | null = null

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
  const dbName = process.env.MONGODB_DB_NAME || 'performance_platform'

  try {
    client = new MongoClient(uri)
    await client.connect()
    db = client.db(dbName)
    console.log('Connected to MongoDB')
    return db
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}

export async function closeDatabase() {
  if (client) {
    await client.close()
    client = null
    db = null
  }
}

