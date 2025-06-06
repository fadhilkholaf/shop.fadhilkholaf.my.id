import { Endpoints } from "@octokit/types";

export type GitHubRepository =
    Endpoints["GET /repos/{owner}/{repo}"]["response"];
