import axios from "axios";
import semver from "semver";

export async function checkNpmServer(json) {
  let dict = {};
  for (var key in json) {
    await axios
      .get(`https://registry.npmjs.com/-/v1/search?text=${key}&size=1`)
      .then(function (response) {
        let version = response.data.objects[0].package.version;
        let score = response.data.objects[0].score.final;
        // console.log(response.data.objects[0].package.version);
        let parseVersion = (val) =>
          semver.valid(val) ? val : val.substring(1);
        dict[key] = {
          currentVersion: parseVersion(json[key]),
          latestVersion: version,
          score: (score * 100) | 0,
          isUptoDate: semver.gte(
            //check if package is uptodate acc. to lastest version
            parseVersion(json[key]),
            parseVersion(version)
          )
            ? true
            : false,
        };
        // console.log(dict);
      })
      .catch((err) => {
        console.log(err);
        dict = {};
        new Error(err);
      });
  }
  return new Promise(function (myResolve, myReject) {
    if (dict == {}) myReject(new Error("unable to fetch data"));
    myResolve(dict);
  });
}
