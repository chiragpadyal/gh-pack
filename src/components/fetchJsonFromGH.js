import { Octokit } from "octokit";
import keytar from "keytar";

export async function fetchJsonFromGH(ghData, type) {
  const { username, repo } = ghData;

  //Get password from keylib
  let password = await keytar.getPassword(
    "Github-Token-NPM-GUI",
    "chiragpadyal"
  );

  //Login
  const octokit = new Octokit({
    auth: password,
  });

  const {
    data: { sha, content },
  } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: username,
    repo: repo,
    path: "package.json",
  });

  let txt = Buffer.from(content, "base64").toString("ascii");
  txt = JSON.parse(txt).dependencies;

  if (type === "sha") return sha;
  else return txt;
}
