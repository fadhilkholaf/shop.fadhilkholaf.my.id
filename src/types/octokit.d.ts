import { Endpoints } from "@octokit/types";

export type GitHubUser = Endpoints["GET /user/{account_id}"]["response"];

export type GitHubRepository =
    Endpoints["GET /repos/{owner}/{repo}"]["response"];

export type GitHubAddCollaborator =
    Endpoints["PUT /repos/{owner}/{repo}/collaborators/{username}"]["response"];
