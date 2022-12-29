import dbConnect from "../../../utils/dbConnector";
import Content from "../../../models/Content";
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
        const content = await Content.findById(id);

        if (!content) {
          res.status(404).json({ success: false });
        }

        res.status(200).json({ success: true, data: content });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "PUT":
      try {
        const content = await Content.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!content) {
          res.status(404).json({ success: false });
        }

        res.status(200).json({ success: true, data: content });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "DELETE":
      try {
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
