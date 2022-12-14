/*
packageList ={
    packageName,
    version
    },

contentJSON :- dependencies from package.json
*/
import { checkNpmServer } from "./checkNpmServer.js";
import semver from "semver";

export async function updatedPackageJSON(contentJSON, packageList) {
  try {
    let changedPackage = {};
    // console.log(contentJSON);
    let key = packageList;
    let data = await checkNpmServer(contentJSON);
    // console.log(data);
    let pkgName = key["packageName"];
    if (data[pkgName]) {
      //check if package exist
      if (data[pkgName]["currentVersion"] !== key["version"]) {
        // check if current and update is of same version
        if (key["version"] === "latest") {
          // check if update is of keyword latest
          contentJSON[pkgName] = `^${data[pkgName]["latestVersion"]}`;
          changedPackage = {
            packageName: pkgName,
            version: data[pkgName]["latestVersion"],
          };
        } else {
          if (semver.lte(key["version"], data[pkgName]["latestVersion"])) {
            //check if update is <= latestVersion
            contentJSON[pkgName] = `^${key["version"]}`;
            changedPackage = {
              packageName: pkgName,
              version: key["version"],
            };
          } else {
            console.log(
              "Package version cannot be greater than latest version!"
            );
          }
        }
      }
    } else {
      console.log("No such package in package.json");
    }
    return { changedPackage, contentJSON };
  } catch (err) {
    console.log(err);
  }
}
/*
---------Testing------------

let dependencies = {
  bootstrap: "^1.0.0",
  "immutability-helper": "^1.0.0",
  "keycode-js": "^0.0.4",
  react: "^1.0.0",
  "react-dom": "^1.0.0",
  recompose: "^0.10.0",
};

let updatePackageName = "recompose";
let version = "0.10.0";
updatedPackageJSON(dependencies, {
  packageName: updatePackageName,
  version,
}).then(({ changedPackage, contentJSON }) => {
  console.log(changedPackage);
  console.log(contentJSON);
});
*/
