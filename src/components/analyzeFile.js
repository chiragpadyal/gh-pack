import { Spinner } from "cli-spinner";
import { fileHandler } from "./fileHandler.js";
import { checkNpmServer } from "./checkNpmServer.js";
import { tableView } from "./table.js";
import { ghUrlSeparate } from "./ghUrlSep.js";
import { fetchJsonFromGH } from "./fetchJsonFromGH.js";

export async function analyzeFile(string) {
  let isUrl;
  try {
    isUrl = new URL(string);
  } catch (_) {
    isUrl = false;
  }
  let spinner, txt, output;
  spinner = new Spinner("%s Fetching Package details...");
  spinner.setSpinnerString("⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏");
  spinner.start();
  // from local file
  if (!isUrl) txt = await fileHandler(string);
  else {
    // from github url
    const ghData = ghUrlSeparate(string);
    txt = await fetchJsonFromGH(ghData, "content");
  }
  output = await checkNpmServer(txt);
  spinner.stop(true);
  tableView(output);
}
