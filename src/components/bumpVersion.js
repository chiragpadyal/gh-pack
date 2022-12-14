/*
--------- data ---------
  options ={
    username,
    repo,
    force,
    packageName,
    branchName,
    versions
  }

  store:-
    username, 
    email

  }
*/
import { Octokit } from "@octokit/rest";
import keytar from "keytar";
import Store from "./configManager.js";
import { newBranchNameGenerator } from "./branchName.js";
import { updatedPackageJSON } from "./updatedPackageJSON.js";
import { fetchJsonFromGH } from "./fetchJsonFromGH.js";
import { deleteBranch } from "./deleteBranch.js";
import { createBranch } from "./createBranch.js";

export function bumpVersion(options) {
  return new Promise(async function (myResolve, myReject) {
    let username = Store.get("username");
    let repo = options.repo;
    let defaultBranch = options.branchName;
    let branchName = newBranchNameGenerator(
      options.packageName,
      options.version
    );

    try {
      if (!Store.get("username") && !Store.get("email"))
        throw 'run "gh-pack login" first';

      if (Store.get("username") != options.username) {
        throw "logged-in username and target repository owner's \
        username are different!, run with -f if have \
        write permission to target repository";
      }
      //Get password from keylib

      let password = await keytar.getPassword(
        "Github-Token-GH-PACK",
        Store.get("username")
      );

      //Login
      const octokit = new Octokit({
        auth: password,
      });

      //Create  a reference [Create New branch]
      createBranch(username, repo, defaultBranch, branchName, octokit);

      //Get file sha (unique id) and File Package.json content i.e dependencies
      const { sha, content } = await fetchJsonFromGH(
        {
          username: Store.get("username"),
          repo: options.repo,
        },
        "sha",
        options.branchName
      );

      //Edit File using SHA-1 Unique id

      //Edit package.json
      const { changedPackage, contentJSON } = await updatedPackageJSON(
        content.dependencies,
        {
          packageName: options.packageName,
          version: options.version,
        }
      );

      //IF there are no changes in package.json
      if (Object.keys(changedPackage).length === 0) {
        // check if there is no changes in package.json
        //Delete Reference (new branch)
        await deleteBranch(
          options.repo,
          branchName,
          Store.get("username"),
          octokit
        );
        throw "no changes found!";
      }

      // Replace Changed Dependencies with dependencies in package,json file
      content.dependencies = contentJSON;

      const contentEncoded = Buffer.from(
        JSON.stringify(content, null, 4)
      ).toString("base64"); // Encode content

      const changeDetails = await octokit.repos.createOrUpdateFileContents({
        owner: Store.get("username"),
        repo: options.repo,
        path: "package.json",
        // /repos/{owner}/{repo}
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
      myResolve(changedPackage);
    } catch (error) {
      myReject({
        message: error,
        data: {
          packageName: options.packageName,
          version: options.version,
        },
      });
    }
  });
}
