import { Command } from "commander";
import { Spinner } from "cli-spinner";
import gradient from "gradient-string";
import figlet from "figlet";
import { FileHandler } from "./components/fileHandler.js";
import { CheckNpmServer } from "./components/callNpmServer.js";
import { TableView } from "./components/table.js";
import { LoginGithub } from "./components/LoginGithub.js";

let program = new Command();

async function check(string) {
  let spinner, txt, output;
  spinner = new Spinner("%s Fetching Package details...");
  spinner.setSpinnerString("⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏");
  spinner.start();
  txt = await FileHandler(string);
  output = await CheckNpmServer(txt);
  spinner.stop(true);
  TableView(output);
}

async function bump(string, options) {}

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
  .argument("<string>", "package.json file location")
  .action(check);

program
  .command("bump")
  .description("Bump a package version on github repository!")
  .option("-p, --package-name <string>")
  .argument("<string>", "github repository http url")
  .action(bump);

program.parse();
