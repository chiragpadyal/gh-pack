import * as fs from "fs";
import * as process from "process";
import * as path from "path";

export function FileHandler(string) {
  return new Promise(function (myResolve, myReject) {
    let combine = path.join(process.cwd(), string); // join the argument path and pwd where command is run
    fs.readFile(combine, "utf8", (err, data) => {
      // read the package.json file
      if (err) myReject("reject");
      let out = JSON.parse(data).dependencies;
      myResolve(out);
    });
  });
}
