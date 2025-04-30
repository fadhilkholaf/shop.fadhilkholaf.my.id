import NextAuth from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import GitHub from "next-auth/providers/github";

import { createUser, getUser, updateUser } from "@/query/user";
import { Role } from "@/prisma/generated";

declare module "next-auth" {
    interface Session {
        user: {
            publicId: string;
            githubId: number;
            role: Role;
            name: string;
            image: string;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        publicId: string;
        githubId: number;
        role: Role;
        name: string;
        image: string;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    theme: {
        brandColor: "#fccee8",
        colorScheme: "light",
        logo: "https://95k1y8fb5v.ufs.sh/f/EyY37ktHRd8rEl1LgntHRd8rjI3XZ1LO2eloC0sGA5tDNJSU",
    },
    providers: [GitHub],
    callbacks: {
        async signIn({ user, profile }) {
            const existingUser = await getUser({
                githubId: Number(profile!.id),
            });
            if (!existingUser) {
                await createUser({
                    githubId: Number(profile!.id),
                    email: user.email!,
                    name: user.name!,
                    image: user.image!,
                });
            }
            return true;
        },
        async jwt({ token, user, profile, session, trigger }) {
            if (trigger === "update") {
                await updateUser(
                    { publicId: token.publicId },
                    {
                        publicId: session.user.publicId,
                        name: session.user.name,
                        image: session.user.image,
                    },
                );

                token.publicId = session.user.publicId;
                token.name = session.user.name;
                token.image = session.user.image;
            }

            if (user) {
                const existingUser = await getUser({
                    githubId: Number(profile!.id),
                });

                if (existingUser) {
                    token.publicId = existingUser.publicId;
                    token.githubId = existingUser.githubId;
                    token.role = existingUser.role;
                    token.name = existingUser.name;
                    token.image = existingUser.image;
                }
            }
            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    publicId: token.publicId,
                    githubId: token.githubId,
                    role: token.role,
                    name: token.name,
                    image: token.image,
                },
            };
        },
    },
});
