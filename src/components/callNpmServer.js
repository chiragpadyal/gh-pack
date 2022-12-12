import axios from "axios";

export async function CheckNpmServer(json) {
  let dict = {};
  for (var key in json) {
    await axios
      .get(`https://registry.npmjs.com/-/v1/search?text=${key}&size=1`)
      .then(function (response) {
        let version = response.data.objects[0].package.version;
        let score = response.data.objects[0].score.final;
        // console.log(response.data.objects[0].package.version);
        dict[key] = {
          currentVersion: json[key],
          latestVersion: version,
          score: (score * 100) | 0,
        };
      })
      .catch((err) => {
        dict = {};
        new Error(err);
      });
  }
  return new Promise(function (myResolve, myReject) {
    if (dict == {}) myReject(new Error("unable to fetch data"));
    myResolve(dict);
  });
}
