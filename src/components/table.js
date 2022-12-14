import { table } from "table";
export async function tableView(json) {
  const data = [["Name", "Version", "Latest Version", "Upto Date", "Health"]];
  // Map json data to table
  // console.log(json);
  for (var key in json) {
    const { currentVersion, latestVersion, score, isUptoDate } = json[key];

    data.push([
      key, // name
      currentVersion, //current version in package.json
      latestVersion, //lastest version of package
      isUptoDate ? "yes" : "no",
      `${score}%`, //health of package acc. to npm server
    ]);
  }

  console.log(table(data)); //print table
}
