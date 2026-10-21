import { GridFSBucket, MongoClient, type Db } from "mongodb";

/**
 * One MongoClient per server process. In development the client is kept on
 * globalThis so hot reloads don't open a new connection pool every time.
 */
const globalForMongo = globalThis as unknown as { __mongoClient?: Promise<MongoClient> };

export const isMongoConfigured = () => Boolean(process.env.MONGODB_URI);

function client() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  globalForMongo.__mongoClient ??= new MongoClient(uri, {
    appName: "portfolio",
    serverSelectionTimeoutMS: 8000,
  })
    .connect()
    .catch((err) => {
      // Let the next request try again instead of caching a failed connection.
      globalForMongo.__mongoClient = undefined;
      throw err;
    });
  return globalForMongo.__mongoClient;
}

export async function db(): Promise<Db> {
  return (await client()).db(process.env.MONGODB_DB || "portfolio");
}

/** GridFS bucket holding uploaded images and PDFs. */
export async function uploadsBucket() {
  return new GridFSBucket(await db(), { bucketName: "uploads" });
}
