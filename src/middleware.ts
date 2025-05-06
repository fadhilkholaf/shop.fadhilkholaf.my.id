import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth(async (req) => {
    const { auth, nextUrl, url } = req;
    const { pathname } = nextUrl;

    if (pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    if (
        ((auth && auth.user.role !== "admin") || !auth) &&
        pathname.startsWith("/admin")
    ) {
        return NextResponse.redirect(new URL("/not-found", url));
    }
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
