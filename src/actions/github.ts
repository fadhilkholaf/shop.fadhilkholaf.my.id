"use server";

import { octokit } from "@/lib/octokit";

async function getMe() {
    try {
        const { data } = await octokit.request("GET /user", {
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        return data;
    } catch (error) {
        console.log(error);

        return null;
    }
}

export async function getGithubUser(id: number) {
    try {
        const { data } = await octokit.request("GET /user/{id}", {
            id,
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        return data;
    } catch (error) {
        console.log(error);

        return null;
    }
}

export async function getGithubRepository(repo: string) {
    try {
        const me = await getMe();

        if (!me) {
            return null;
        }

        const { data } = await octokit.request("GET /repos/{owner}/{repo}", {
            owner: me.login,
            repo,
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        return data;
    } catch (error) {
        console.log(error);

        return null;
    }
}

export async function getGithubRepositoryById(id: number) {
    try {
        const { data } = await octokit.request("GET /repositories/{id}", {
            id,
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        return data;
    } catch (error) {
        console.log(error);

        return null;
    }
}

export async function getRepositoryCollaborators(repo: string) {
    try {
        const me = await getMe();

        if (!me) {
            return null;
        }

        const { data } = await octokit.request(
            "GET /repos/{owner}/{repo}/collaborators",
            {
                owner: me.login,
                repo,
                headers: {
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            },
        );

        return data;
    } catch (error) {
        console.log(error);

        return null;
    }
}

export async function addRepositoryCollaborator(
    repo: string,
    username: string,
) {
    try {
        const me = await getMe();

        if (!me) {
            return null;
        }

        const { data } = await octokit.request(
            "PUT /repos/{owner}/{repo}/collaborators/{username}",
            {
                owner: me.login,
                repo,
                username,
                permission: "pull",
                headers: {
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            },
        );

        return data;
    } catch (error) {
        console.log(error);

        return null;
    }
}
