"use client";

import Form from "next/form";

import { addRepositoryCollaborator } from "@/actions/octokit";
import { GitHubRepository, GitHubUser } from "@/types/octokit";

export default function RequestInvitationButton({
    gitHubRepository,
    gitHubUser,
}: {
    gitHubRepository: GitHubRepository["data"];
    gitHubUser: GitHubUser["data"];
}) {
    return (
        <Form
            action={async function () {
                const response = await addRepositoryCollaborator(
                    gitHubRepository.name,
                    gitHubUser.login,
                );

                if (!response.result) {
                    return;
                }

                window.open(response.result.html_url, "_blank");
            }}
        >
            <button type="submit" className="w-full">
                <p className="bg-secondary text-primary w-full rounded-lg p-4 text-center">
                    Request invitation
                </p>
            </button>
        </Form>
    );
}
