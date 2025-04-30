"use client";

import Form from "next/form";

import { useSession } from "next-auth/react";
import { createPaypalOrder } from "@/actions/paypal";

export default function ClientPage() {
    const { data: session, update } = useSession();

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
                    await createPaypalOrder();
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
        </main>
    );
}
