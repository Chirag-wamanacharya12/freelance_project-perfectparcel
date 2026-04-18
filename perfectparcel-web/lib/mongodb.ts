import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    // @ts-ignore
    global._mongoClientPromise = client.connect().then(async (client) => {
      await ensureIndexes(client);
      return client;
    });
  }
  // @ts-ignore
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect().then(async (client) => {
    await ensureIndexes(client);
    return client;
  });
}

async function ensureIndexes(client: MongoClient) {
  try {
    const db = client.db("perfectparcel");
    await Promise.all([
      db.collection("users").createIndex({ email: 1 }, { unique: true }),
      db.collection("products").createIndex({ productId: 1 }, { unique: true }),
      db.collection("products").createIndex({ category: 1 }),
      db.collection("products").createIndex({ is_discontinued: 1 }),
      db.collection("products").createIndex({ createdAt: -1 }),
      db.collection("orders").createIndex({ userId: 1 }),
      db.collection("orders").createIndex({ status: 1 }),
      db.collection("orders").createIndex({ createdAt: -1 }),
      db.collection("notifications").createIndex({ role: 1 }),
      db.collection("notifications").createIndex({ createdAt: -1 }),
    ]);
  } catch (e) {
    console.error("Failed to create indexes:", e);
  }
}

export default clientPromise;
