import crypto from "crypto";

export function newBranchNameGenerator(packageName, version) {
  let txt = crypto.randomBytes(4).toString("hex");
  let random = `dependencies/${packageName}@${version}/${txt}`;
  return random;
}
