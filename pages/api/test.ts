import clientPromise from "../../utils/dbConnector";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // const client = await clientPromise;
    // const db = client.db("test");

    // const movies = await db
    //   .collection("movies")
    //   .find({})
    //   .sort({ metacritic: -1 })
    //   .limit(10)
    //   .toArray();

    const result = { success: true };
    res.json(result);
  } catch (e) {
    console.error(e);
  }
}
