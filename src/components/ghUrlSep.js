export function ghUrlSeparate(link) {
  const url = new URL(link);
  if (url.hostname == ("github.com" || "www.github.com")) {
    let pathname = url.pathname.split("/");
    let repository = pathname[2];

    repository =
      repository.split(".")[1] == "git" ? repository.split(".")[0] : repository;

    return {
      username: pathname[1],
      repo: repository,
    };
  }
}
