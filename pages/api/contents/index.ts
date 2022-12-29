import dbConnect from "../../../utils/dbConnector";
import Track from "../../../models/Track";
import Content from "../../../models/Content";
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
        const contents = await Content.find({});

        res.status(200).json({ success: true, data: contents });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        // console.log("request body is: ", req.body);
        const content = await Content.create({
          topics: req.body.topics,
          link: req.body.link,
          answer: req.body.answer,
        });

        const track = await Track.findById(req.body.trackId);

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
