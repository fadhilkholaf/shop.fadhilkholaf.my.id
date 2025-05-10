import Image from "next/image";

import { auth } from "@/lib/auth";
import { getRepositoryCollaborators, getGithubUser } from "@/actions/octokit";
import { RequestCollaborator } from "@/components/RequestCollaborator";
// import { createPaypalOrder } from "@/actions/paypal";

export default async function RootPage() {
    const session = await auth();

    if (!session) {
        return null;
    }

    const user = await getGithubUser(session.user.githubId);

    if (!user) {
        return null;
    }

    const repositoryCollaborators =
        await getRepositoryCollaborators("hillaryours");

    const isAlreadyCollaborator = repositoryCollaborators?.some(
        (c) => c.id === session.user.githubId,
    );

    // await createPaypalOrder();

    return (
        <main>
            <header>
                <h1>Hello world!</h1>
            </header>
            <main>
                <p>{user.login}</p>
                {!isAlreadyCollaborator && (
                    <RequestCollaborator
                        repo="hillaryours"
                        username={user?.login}
                    />
                )}
                <p>
                    {
                        <Image
                            src={session.user.image}
                            alt={session.user.name}
                            width={460}
                            height={460}
                            priority
                        />
                    }
                </p>
            </main>
        </main>
    );
}
