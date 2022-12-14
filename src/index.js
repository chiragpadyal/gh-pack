import { Command } from "commander";
import { LoginGithub } from "./components/LoginGithub.js";
import { analyzeFile } from "./components/analyzeFile.js";
import { bumpVersion } from "./components/bumpVersion.js";
import gradient from "gradient-string";
import figlet from "figlet";
import { ghUrlSeparate } from "./components/ghUrlSep.js";

let program = new Command();

async function bump(options) {
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
      .then((data) =>
        console.log(`Done! Bumped ${packageName} to version ${version}`)
      )
      .catch((err) =>
        console.log(`failed! To bump ${packageName} to version ${version}`)
      );
  });
}

console.log(
  gradient("red", "green", "blue")(figlet.textSync("N P M  G U I !"))
);
function collect(value, previous) {
  return previous.concat([value]);
}
program
  .name("npm-gui")
  .description("CLI to view package.json and bump dependencies version.")
  .version("1.0.0");

program
  .command("login")
  .description("Login to github account")
  .option("-U, --username <string>")
  .option("-E, --email <string>")
  .action((e) => new LoginGithub(e));

program
  .command("check")
  .description("Analyze package.json dependencies!")
  .argument(
    "<file-path>",
    "github repository (http) url or path to local package.json file"
  )
  .action(analyzeFile);

program
  .command("bump")
  .description("Bump a package version on github repository!")
  .option("-df, --default-branch <string>", "main branch name", "master")
  .option(
    "--force",
    "force bump version, even if logged-in username and target repo usernmae are different"
  )
  .requiredOption(
    "-pv , --package-version <package@version>",
    "list of package@version i.e -pv react@1.0.0 -pv redux@latest -pv react-dom@1.0.0 .... \
     If the -pv value is all (i.e -pv all) than all packages will be bump!",
    (value, previous) => previous.concat([value]),
    []
  )
  .requiredOption(
    "-gh, --github-url <github-url>",
    "github repository http url"
  )
  .action(bump);

program.parse();
