export async function deleteBranch(repo, reference, username, octokit) {
  await octokit.request("DELETE /repos/{owner}/{repo}/git/refs/heads/{ref}", {
    owner: username,
    repo: repo,
    ref: reference,
  });
}
// https://api.github.com/repos/chiragpadyal/test-npm-gui/git/refs/heads/test
