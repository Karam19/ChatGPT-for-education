import dbConnect from "../../../utils/dbConnector";
import Content from "../../../models/Content";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getOwnerAndRepoForContent,
  isContributor,
} from "../../../utils/Scraper";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

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
        const content = await Content.findById(id);

        if (!content) {
          res.status(404).json({ success: false });
        }

        res.status(200).json({ success: true, data: content });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    // case "PUT":
    //   try {
    //     const content = await Content.findByIdAndUpdate(id, req.body, {
    //       new: true,
    //       runValidators: true,
    //     });

    //     if (!content) {
    //       res.status(404).json({ success: false });
    //     }

    //     res.status(200).json({ success: true, data: content });
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
        const content = await Content.findById(id);
        const ownerRepo = await getOwnerAndRepoForContent(content.link);
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
              session.user?.name
            );
            if (!contributor) {
              res.status(403).json({ success: false });
              return;
            }
          }
        }
        const deletedContent = await Content.deleteOne({ _id: id });

        if (!deletedContent) {
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
