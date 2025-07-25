import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

import type { auth } from "./lib/auth";
import { $fetch } from "./lib/auth-client";

const intlMiddleware = createMiddleware(routing);

type Session = typeof auth.$Infer.Session;

export default async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname.replace(/^\/(en|es|pt)(?=\/|$)/, '');
    console.log('Accessing route:', pathname);

    // 🔐 Auth check only for admin protected routes
    if (pathname.startsWith("/admin")) {
        const { data: session } = await $fetch<Session>("/api/auth/get-session", {
            baseURL: request.nextUrl.origin,
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        });

        if (!session) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // 🔐 Auth check only for admin protected routes
    if (pathname.startsWith("/settings")) {
        const { data: session } = await $fetch<Session>("/api/auth/get-session", {
            baseURL: request.nextUrl.origin,
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        });

        if (!session) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // Run the intl middleware (required for translations to work)
    return intlMiddleware(request);
}


export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};