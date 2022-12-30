import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    // Signed in
    console.log("Session", session.user?.email);
    res.status(200).json({ success: true });
  } else {
    // Not Signed in
    console.log("Not signed in");
    res.status(401).json({ success: false });
  }
}
