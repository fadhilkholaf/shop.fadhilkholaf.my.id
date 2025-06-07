"use server";

import { RequestError } from "octokit";

import { octokit } from "@/lib/octokit";
import { GitHubAddCollaborator, GitHubRepository } from "@/types/octokit";
import { ResponseTemplate } from "@/types/response";
import { responseError, responseSuccess } from "@/utils/response";

async function getGitHubAuthenticatedUser() {
    try {
        const { data } = await octokit.request("GET /user", {
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        return data;
    } catch (error) {
        console.error(error);

        return null;
    }
}

export async function getGitHubUserById(account_id: number) {
    try {
        const { data } = await octokit.request("GET /user/{account_id}", {
            account_id,
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        return data;
    } catch (error) {
        console.error(error);

        return null;
    }
}

export async function getGitHubRepository(repo: string) {
    try {
        const gitHubAuthenticatedUser = await getGitHubAuthenticatedUser();

        if (!gitHubAuthenticatedUser) {
            return null;
        }

        const { data } = await octokit.request("GET /repos/{owner}/{repo}", {
            owner: gitHubAuthenticatedUser.login,
            repo,
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        return data;
    } catch (error) {
        console.error(error);

        return null;
    }
}

export async function getGitHubRepositoryById(repository_id: number) {
    try {
        const { data } = (await octokit.request(
            "GET /repositories/{repository_id}",
            {
                repository_id,
                headers: {
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            },
        )) as GitHubRepository;

        return data;
    } catch (error) {
        console.error(error);

        return null;
    }
}

export async function getIsCollaborator(repo: string, username: string) {
    try {
        const gitHubAuthenticatedUser = await getGitHubAuthenticatedUser();

        if (!gitHubAuthenticatedUser) {
            return null;
        }

        const { status } = await octokit.request(
            "GET /repos/{owner}/{repo}/collaborators/{username}",
            {
                owner: gitHubAuthenticatedUser.login,
                repo,
                username,
                headers: {
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            },
        );

        return status;
    } catch (error) {
        if (error instanceof RequestError) {
            return null;
        }

        console.error(error);

        return null;
    }
}

export async function addRepositoryCollaborator(
    repo: string,
    username: string,
): Promise<
    ResponseTemplate<GitHubAddCollaborator["data"] | null, string | null>
> {
    try {
        const gitHubAuthenticatedUser = await getGitHubAuthenticatedUser();

        if (!gitHubAuthenticatedUser) {
            return responseError("Unauthenticated!");
        }

        const { data } = await octokit.request(
            "PUT /repos/{owner}/{repo}/collaborators/{username}",
            {
                owner: gitHubAuthenticatedUser.login,
                repo,
                username,
                permission: "pull",
                headers: {
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            },
        );

        return responseSuccess(data);
    } catch (error) {
        console.error(error);

        return responseError("Unexpected error sending invitation!");
    }
}
