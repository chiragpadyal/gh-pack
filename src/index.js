import { Command } from "commander";
import { LoginGithub } from "./components/LoginGithub.js";
import { analyzeFile } from "./components/analyzeFile.js";
import gradient from "gradient-string";
import figlet from "figlet";
import { taskBumpVersion } from "./components/taskBumpVersion.js";

let program = new Command();

console.log(
  gradient("red", "green", "blue")(figlet.textSync("N P M  G U I !"))
);

program
  .name("gh-pack")
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
  .action(taskBumpVersion);

program.parse();
