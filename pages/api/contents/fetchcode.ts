import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "octokit";

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
    if (!content.data.content) {
      res.status(400).json({ success: false });
      return;
    }
    const code = Buffer.from(content.data.content, "base64").toString("binary");
    res.status(200).json({ success: true, result: code });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, result: "Not found" });
  }
}
