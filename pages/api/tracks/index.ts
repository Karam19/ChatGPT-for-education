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
  const { method } = req;

  const session = await unstable_getServerSession(req, res, authOptions);

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
      if (!session) {
        res.status(401).json({ success: false });
        return;
      }
      try {
        const ownerRepo = await getOwnerAndRepo(req.body.link);
        if (ownerRepo === null) {
          res.status(400).json({ success: false });
          return;
        } else {
          if (ownerRepo[0] === null && ownerRepo[1] === null) {
            res.status(400).json({ success: false });
            return;
          }
          if (session !== null) {
            console.log("Owner is:", ownerRepo[0]);
            console.log("Repo is:", ownerRepo[1]);
            console.log("User is: ", session.user);
            const contributor = await isContributor(
              ownerRepo[0],
              ownerRepo[1],
              session.user?.name
            );
            if (!contributor) {
              res.status(403).json({ success: false });
              return;
            }
          }
        }

        console.log("request body is: ", req.body);
        const track = await Track.create({
          title: req.body.title,
          link: req.body.link,
          contents: [],
        });

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
