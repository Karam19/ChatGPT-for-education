import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "octokit";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_SECRET_KEY,
});
const openai = new OpenAIApi(configuration);

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
    const prompt = `Can you explain ${req.body.topics} based on the following code ${code}`;
    console.log("Prompt is the following", prompt);
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: prompt,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 256,
    });
    res.status(200).json({ success: true, result: completion.data });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, result: "Not found" });
  }
}
