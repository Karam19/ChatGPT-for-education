import { Octokit } from "octokit";

export async function getContent(url: string) {
  const octokit = new Octokit({
    auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
  });
  try {
    const content = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}{?ref}",
      {
        owner: "Karam19",
        repo: "PatentsDapp",
        path: "/src/components/SubmitForm/index.tsx",
        ref: "main",
      }
    );
    return content.data.content;
  } catch (error) {
    console.log(error);
  }
  return "Not found";
}

export async function isContributor(
  owner: string | null,
  repo: string | null,
  id: string | undefined
) {
  const octokit = new Octokit({
    auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
  });
  try {
    const content = await octokit.request(
      "GET /repos/{owner}/{repo}/contributors{?anon,per_page,page}",
      {
        owner: owner,
        repo: repo,
      }
    );
    const data = content.data;
    console.log("Data is: ", data);
    for (let i = 0; i < data.length; i++) {
      if (typeof id !== "undefined") {
        if (data[i].id === parseInt(id)) {
          return true;
        }
      }
    }
    return false;
  } catch (error) {
    console.log(error);
  }
  return false;
}

export async function getOwnerAndRepo(url: string) {
  const ownerRe = new RegExp("(?<=https://github.com/).+?(?=/)", "g");
  const owner = ownerRe.exec(url);
  if (owner === null) {
    return null;
  }

  const repoRe = new RegExp(`(?<=https://github.com/${owner[0]}/).+`, "g");
  const repo = repoRe.exec(url);
  if (repo === null) {
    return null;
  }
  return [owner[0], repo[0]];
}

export async function getOwnerAndRepoForContent(url: string) {
  const ownerRe = new RegExp("(?<=https://github.com/).+?(?=/)", "g");
  const owner = ownerRe.exec(url);
  if (owner === null) {
    return null;
  }

  const repoRe = new RegExp(
    `(?<=https://github.com/${owner[0]}/).+?(?=/blob/)`,
    "g"
  );
  const repo = repoRe.exec(url);
  if (repo === null) {
    return null;
  }
  return [owner[0], repo[0]];
}
