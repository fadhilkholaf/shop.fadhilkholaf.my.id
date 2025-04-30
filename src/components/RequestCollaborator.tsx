"use client";

import { addRepositoryCollaborator } from "@/actions/github";
import Form from "next/form";

export function RequestCollaborator({
    repo,
    username,
}: {
    repo: string;
    username: string;
}) {
    return (
        <Form
            action={async function () {
                const requestCollaboration = await addRepositoryCollaborator(
                    repo,
                    username,
                );

                console.log(requestCollaboration);
            }}
        >
            <header>
                <h1>Request Collaboration</h1>
            </header>
            <footer>
                <button type="submit">Request Collaboration</button>
            </footer>
        </Form>
    );
}
