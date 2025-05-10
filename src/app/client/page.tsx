"use client";

import Form from "next/form";

import { useSession } from "next-auth/react";
import { createPaypalOrder } from "@/actions/paypal";
import { getGithubUser } from "@/actions/octokit";

export default function ClientPage() {
    const { data: session, update } = useSession();

    // console.log(session);

    if (!session) {
        return null;
    }

    return (
        <main>
            <Form
                action={async function (formData) {
                    const name = formData.get("session");
                    await update({
                        ...session,
                        user: { ...session.user, name },
                    });
                }}
            >
                <div>
                    <label htmlFor="session">Update session</label>
                    <input
                        type="text"
                        name="session"
                        id="session"
                        placeholder="update session"
                    />
                </div>
                <button type="submit">Update</button>
            </Form>
            <Form
                action={async function () {
                    // await createPaypalOrder();
                }}
            >
                {/* <div>
                    <label htmlFor="session">Update session</label>
                    <input
                        type="text"
                        name="session"
                        id="session"
                        placeholder="update session"
                    />
                </div> */}
                <button type="submit">Create Order</button>
            </Form>
            <Form
                action={async function () {
                    const user = await getGithubUser(session.user.githubId);

                    console.log(user);
                }}
            >
                <button type="submit">Revoke credentials</button>
            </Form>
        </main>
    );
}
