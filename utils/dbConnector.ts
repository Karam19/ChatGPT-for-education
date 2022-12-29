// import { MongoClient } from "mongodb";

// if (!process.env.NEXT_PUBLIC_MONGO_URL) {
//   throw new Error(
//     'Invalid/Missing environment variable: "NEXT_PUBLIC_MONGO_URL"'
//   );
// }

// const uri = process.env.NEXT_PUBLIC_MONGO_URL;
// const options = {};

// const client = new MongoClient(uri, options);
// const clientPromise: Promise<MongoClient> = client.connect();

// export default clientPromise;

import mongoose from "mongoose";

const { NEXT_PUBLIC_MONGO_URL, NEXT_PUBLIC_MONGODB_DB } = process.env;

if (!NEXT_PUBLIC_MONGO_URL) throw new Error("MONGODB_URI not defined");
if (!NEXT_PUBLIC_MONGODB_DB) throw new Error("MONGODB_DB not defined");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(NEXT_PUBLIC_MONGO_URL || "")
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
