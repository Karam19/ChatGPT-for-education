import dbConnect from "../../../utils/dbConnector";
import Track from "../../../models/Track";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getOwnerAndRepo, isContributor } from "../../../utils/Scraper";

dbConnect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;

  const session = await unstable_getServerSession(req, res, authOptions);

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
    // case "PUT":
    //   try {
    //     const track = await Track.findByIdAndUpdate(id, req.body, {
    //       new: true,
    //       runValidators: true,
    //     });

    //     if (!track) {
    //       res.status(404).json({ success: false });
    //     }

    //     res.status(200).json({ success: true, data: track });
    //   } catch (error) {
    //     res.status(400).json({ success: false });
    //   }
    //   break;
    case "DELETE":
      if (!session) {
        res.status(401).json({ success: false });
        return;
      }
      try {
        const track = await Track.findById(id);
        const ownerRepo = await getOwnerAndRepo(track.link);
        if (ownerRepo === null) {
          res.status(400).json({ success: false });
          return;
        } else {
          if (ownerRepo[0] === null && ownerRepo[1] === null) {
            res.status(400).json({ success: false });
            return;
          }
          if (session !== null) {
            const contributor = await isContributor(
              ownerRepo[0],
              ownerRepo[1],
              session.user?.id
            );
            if (!contributor) {
              res.status(403).json({ success: false });
              return;
            }
          }
        }

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
