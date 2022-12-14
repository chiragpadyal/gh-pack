import { ghUrlSeparate } from "./ghUrlSep.js";
import { bumpVersion } from "./bumpVersion.js";
// import { cliSpinner } from "./spinner.js";
// import { Listr } from "listr";

export async function taskBumpVersion(options) {
  let packageName,
    version = "";
  let changedPackage = [];
  let ghData = ghUrlSeparate(options.githubUrl);
  options.packageVersion.map((value) => {
    let splitedName = value.split("@");
    if (splitedName[1]) {
      packageName = splitedName[0];
      version = splitedName[1];
    }
    let data = {
      username: ghData.username,
      repo: ghData.repo,
      force: options.force ? true : false,
      packageName: packageName,
      branchName: options.defaultBranch,
      version: version,
    };
    bumpVersion(data)
      .then((data) => {
        console.log(
          `Done! Bumped ${data.packageName} to version ${data.version}`
        );
      })
      .catch((err) =>
        console.log(
          `failed! To bump ${err.data.packageName} to version ${err.data.version}`
        )
      );
  });
}
