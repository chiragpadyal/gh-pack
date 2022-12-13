export function branchName() {
  let random = crypto.randomBytes(5).toString("hex");
  return `v-${random}`;
}
