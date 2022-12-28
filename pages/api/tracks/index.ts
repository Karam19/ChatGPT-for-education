import dbConnect from "../../../utils/dbConnector";
import Track from "../../../models/Track";
import type { NextApiRequest, NextApiResponse } from "next";

dbConnect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const tracks = await Track.find({});

        res.status(200).json({ success: true, data: tracks });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        console.log("request body is: ", req.body);
        const track = await Track.create(req.body);

        res.status(201).json({ success: true, data: track });
      } catch (error) {
        console.log("Error is: ", error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
