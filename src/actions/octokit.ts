"use server";

import { revalidatePath } from "next/cache";

import { RequestError } from "octokit";

import { octokit } from "@/lib/octokit";
import {
    type GitHubAddCollaborator,
    type GitHubRepository,
    type GitHubUser,
} from "@/types/octokit";
import { type ResponseTemplate } from "@/types/response";
import { responseError, responseSuccess } from "@/utils/response";

async function getGitHubAuthenticatedUser(): Promise<
    ResponseTemplate<GitHubUser["data"], null> | ResponseTemplate<null, string>
> {
    try {
        const { data } = await octokit.request("GET /user", {
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        return responseSuccess(data);
    } catch (error) {
        console.error(error);

        return responseError("Unexpected error getting authenticated user!");
    }
}

export async function getGitHubUserById(
    account_id: number,
): Promise<
    ResponseTemplate<GitHubUser["data"], null> | ResponseTemplate<null, string>
> {
    try {
        const { data } = await octokit.request("GET /user/{account_id}", {
            account_id,
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        return responseSuccess(data);
    } catch (error) {
        console.error(error);

        return responseError("Unexpected error getting user by id!");
    }
}

export async function getGitHubRepository(
    repo: string,
): Promise<
    | ResponseTemplate<GitHubRepository["data"], null>
    | ResponseTemplate<null, string>
> {
    try {
        const gitHubAuthenticatedUser = await getGitHubAuthenticatedUser();

        if (!gitHubAuthenticatedUser.result) {
            return gitHubAuthenticatedUser;
        }

        const { data } = await octokit.request("GET /repos/{owner}/{repo}", {
            owner: gitHubAuthenticatedUser.result.login,
            repo,
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        return responseSuccess(data);
    } catch (error) {
        console.error(error);

        return responseError("Unexpected error getting repository!");
    }
}

export async function getGitHubRepositoryById(
    repository_id: number,
): Promise<
    | ResponseTemplate<GitHubRepository["data"], null>
    | ResponseTemplate<null, string>
> {
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

        return responseSuccess(data);
    } catch (error) {
        console.error(error);

        return responseError("Unexpected error getting repository by id!");
    }
}

export async function getIsCollaborator(
    repo: string,
    username: string,
): Promise<ResponseTemplate<string, null> | ResponseTemplate<null, string>> {
    try {
        const gitHubAuthenticatedUser = await getGitHubAuthenticatedUser();

        if (!gitHubAuthenticatedUser.result) {
            return gitHubAuthenticatedUser;
        }

        await octokit.request(
            "GET /repos/{owner}/{repo}/collaborators/{username}",
            {
                owner: gitHubAuthenticatedUser.result.login,
                repo,
                username,
                headers: {
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            },
        );

        return responseSuccess("User is a collaborator!");
    } catch (error) {
        if (error instanceof RequestError) {
            return responseError("User is not a collaborator!");
        }

        console.error(error);

        return responseError(
            "Unexpected error getting is user a collaborator!",
        );
    }
}

export async function addRepositoryCollaborator(
    repo: string,
    username: string,
): Promise<
    | ResponseTemplate<GitHubAddCollaborator["data"], null>
    | ResponseTemplate<null, string>
> {
    try {
        const gitHubAuthenticatedUser = await getGitHubAuthenticatedUser();

        if (!gitHubAuthenticatedUser.result) {
            return gitHubAuthenticatedUser;
        }

        const { data } = await octokit.request(
            "PUT /repos/{owner}/{repo}/collaborators/{username}",
            {
                owner: gitHubAuthenticatedUser.result.login,
                repo,
                username,
                permission: "pull",
                headers: {
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            },
        );

        revalidatePath("/", "layout");

        return responseSuccess(data);
    } catch (error) {
        if (error instanceof RequestError) {
            return responseError("Error sending invitation!");
        }

        console.error(error);

        return responseError("Unexpected error sending invitation!");
    }
}
