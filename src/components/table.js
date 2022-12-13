import { table } from "table";
import semver from "semver";
export async function tableView(json) {
  const data = [["Name", "Version", "Latest Version", "Upto Date", "Health"]];
  // Map json data to table
  for (var key in json) {
    let parseVersion = (val) => (semver.valid(val) ? val : val.substring(1));

    data.push([
      key, // name
      json[key].currentVersion, //current version in package.json
      json[key].latestVersion, //lastest version of package
      semver.gte(
        //check if package is uptodate acc. to lastest version
        parseVersion(json[key].currentVersion),
        parseVersion(json[key].latestVersion)
      )
        ? "yes"
        : "no",
      `${json[key].score}%`, //health of package acc. to npm server
    ]);
  }

  console.log(table(data)); //print table
}
