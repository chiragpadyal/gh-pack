import { Octokit } from "octokit";
import keytar from "keytar";
import { branchName } from "./branchName.js";
import { updatedPackageJSON } from "./updatedPackageJSON.js";
import Store from "./configManager.js";

/*
--------- data ---------
  options ={
    username,
    repo,
    force,
    packageName,
    branchName,
    version
  }

  store:-
    username, 
    email
*/
export async function bumpVersion(options) {
  try {
    if (!Store.get("username") && !Store.get("email"))
      new Error('run "npm-gui login" first');

    if (Store.get("username") != options.username)
      new Error(
        "logged-in username and target repository owner \
        username are different!, run with -f if have \
        write permission to target repository"
      );
    //Get password from keylib
    let password = await keytar.getPassword(
      "Github-Token-NPM-GUI",
      Store.get("username")
    );

    //Login
    const octokit = new Octokit({
      auth: password,
    });

    //Create  a reference [Create New branch]
    const mainRef = await octokit.request(
      "GET /repos/{owner}/{repo}/git/ref/{ref}",
      {
        owner: Store.get("username"),
        repo: options.repo,
        ref: `heads/${options.branchName}`,
      }
    );

    await octokit.rest.git.createRef({
      owner: Store.get("username"),
      repo: options.repo,
      ref: `refs/heads/v3-random`,
      sha: mainRef.data.object.sha,
    });

    //Get file sha (unique id)
    const {
      data: { sha },
    } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: Store.get("username"),
      repo: options.repo,
      path: "package.json",
    });

    //Edit File using SHA-1 Unique id
    const contentEncoded = Buffer.from(updatedPackageJSON).toString("base64"); // Encode content

    await octokit.repos.createOrUpdateFileContents({
      owner: Store.get("username"),
      repo: options.repo,
      path: "package.json",
      message: `Bump ${options.packageName} to ${options.version}`,
      sha: sha,
      branch: branchName,
      content: contentEncoded,
      committer: {
        name: Store.get("username"),
        email: Store.get("email"),
      },
    });

    //Create Pull Request
    const prDetails = await octokit.request(
      "POST /repos/{owner}/{repo}/pulls",
      {
        owner: Store.get("username"),
        repo: options.repo,
        title: `Bump ${options.packageName} to ${options.version}`,
        body: `Bump ${options.packageName} to ${options.version}`,
        head: branchName,
        base: options.branchName,
      }
    );
  } catch (error) {
    console.log(error);
    new Error(error);
  }
}
// BumpVersion();
