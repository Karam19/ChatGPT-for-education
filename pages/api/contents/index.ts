import dbConnect from "../../../utils/dbConnector";
import Track from "../../../models/Track";
import Content from "../../../models/Content";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getOwnerAndRepoForContent,
  isContributor,
  getOwnerAndRepo,
} from "../../../utils/Scraper";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

dbConnect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const contents = await Content.find({});

        res.status(200).json({ success: true, data: contents });
      } catch (error) {
        console.log("Error is: ", error);
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      if (!session) {
        res.status(401).json({ success: false });
        return;
      }
      try {
        const ownerRepo = await getOwnerAndRepoForContent(req.body.link);
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

        const track = await Track.findById(req.body.trackId);

        const trackOwnerRepo = await getOwnerAndRepo(track.link);

        if (trackOwnerRepo === null) {
          res.status(500).json({ success: false });
          return;
        } else {
          if (trackOwnerRepo[0] === null && trackOwnerRepo[1] === null) {
            res.status(500).json({ success: false });
            return;
          }
          if (
            trackOwnerRepo[0] !== ownerRepo[0] ||
            trackOwnerRepo[1] !== ownerRepo[1]
          ) {
            res.status(409).json({ success: false });
            return;
          }
        }

        const content = await Content.create({
          topics: req.body.topics,
          link: req.body.link,
          answer: req.body.answer,
        });

        track.contents.push(content._id);

        await Track.findByIdAndUpdate(req.body.trackId, track, {
          new: true,
          runValidators: true,
        });

        res.status(201).json({ success: true, data: content });
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
