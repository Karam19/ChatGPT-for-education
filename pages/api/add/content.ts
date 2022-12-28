import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "octokit";
// import { dbConnect } from "../../../utils/dbConnector";

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const content = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}{?ref}",
      {
        owner: req.body.owner,
        repo: req.body.repo,
        path: req.body.path,
        ref: req.body.ref,
      }
    );
    // const conn: any = await dbConnect();
    // console.log("Conn is: ", conn);
    res.status(200).json({ result: content.data.content });
  } catch (error) {
    console.log(error);
    res.status(404).json({ result: "Not found" });
  }
}
