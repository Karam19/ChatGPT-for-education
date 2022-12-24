import { Octokit } from "octokit";

export async function getContent(url: string) {
  const octokit = new Octokit({
    auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
  });
  console.log("token here is: ", process.env.NEXT_PUBLIC_GITHUB_TOKEN);
  try {
    const content = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}{?ref}",
      {
        owner: "hasankhadra",
        repo: "innoday",
        path: "/netlify.toml",
        ref: "main",
      }
    );
    console.log("content is: ", content);
    return content;
  } catch (error) {
    console.log(error);
  }
  return "Not found";
}

export async function getContributors(url: string) {
  const octokit = new Octokit({
    auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
  });
  console.log("token here is: ", process.env.NEXT_PUBLIC_GITHUB_TOKEN);
  try {
    const content = await octokit.request(
      "GET /repos/{owner}/{repo}/contributors{?anon,per_page,page}",
      {
        owner: "hasankhadra",
        repo: "innoday",
      }
    );
    console.log("content is: ", content);
    return content;
  } catch (error) {
    console.log(error);
  }
  return "Not found";
}
