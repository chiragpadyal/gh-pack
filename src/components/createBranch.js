export async function createBranch(
  username,
  repo,
  newBranchName,
  defaultBranchName,
  octokit
) {
  //Create  a reference [Create New branch]
  const mainRef = await octokit.request(
    "GET /repos/{owner}/{repo}/git/ref/{ref}",
    {
      owner: username,
      repo: repo,
      ref: `heads/${defaultBranchName}`,
    }
  );

  await octokit.rest.git.createRef({
    owner: username,
    repo: repo,
    ref: `refs/heads/${newBranchName}`,
    sha: mainRef.data.object.sha,
  });
}
