import dbConnect from "../../../utils/dbConnector";
import Track from "../../../models/Track";
import type { NextApiRequest, NextApiResponse } from "next";

dbConnect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const track = await Track.findById(id);

        if (!track) {
          res.status(404).json({ success: false });
        }

        res.status(200).json({ success: true, data: track });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "PUT":
      try {
        const track = await Track.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!track) {
          res.status(404).json({ success: false });
        }

        res.status(200).json({ success: true, data: track });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        const deletedTrack = await Track.deleteOne({ _id: id });

        if (!deletedTrack) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(200).json({ success: false, data: {} });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
