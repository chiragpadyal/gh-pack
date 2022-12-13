import { Command } from "commander";
import { LoginGithub } from "./components/LoginGithub.js";
import { analyzeFile } from "./components/analyzeFile.js";
import { bumpVersion } from "./components/bumpVersion.js";
import gradient from "gradient-string";
import figlet from "figlet";
import { ghUrlSeparate } from "./components/ghUrlSep.js";

let program = new Command();

async function bump(githubUrl, options) {
  let ghData = ghUrlSeparate(githubUrl);
  let data = {
    username: ghData.username,
    repo: ghData.repo,
    force: options.force ? true : false,
    packageName: options.packageName,
    branchName: options.defaultBranch,
    version: options.version,
  };

  bumpVersion(data);
}

console.log(
  gradient("red", "green", "blue")(figlet.textSync("N P M  G U I !"))
);

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
  .option("-p, --package-name <string>", "package name", "all")
  .option("-df, --default-branch <string>", "default branch name", "main")
  .option(
    "--force",
    "force bump version, even if logged-in username and target repo usernmae are different"
  )
  .option(
    "-v, --version <string>",
    "version of pakage default: latest",
    "latest"
  )
  .argument("<github-url>", "github repository http url")
  .action(bump);

program.parse();
