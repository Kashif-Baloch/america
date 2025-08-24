import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

// import type { auth } from "./lib/auth";
// import { $fetch } from "./lib/auth-client";
import { getSessionCookie } from "better-auth/cookies";

const intlMiddleware = createMiddleware(routing);

// type Session = typeof auth.$Infer.Session;

export default async function middleware(request: NextRequest) {
  const { pathname, origin, search } = request.nextUrl;

  // Extract locale prefix (e.g. "/en", "/es")
  const localeMatch = pathname.match(/^\/(en|es|pt)(?=\/|$)/);
  const localePrefix = localeMatch?.[0] || "";
  const pathWithoutLocale = pathname.replace(/^\/(en|es|pt)(?=\/|$)/, "");

  // console.log("Accessing route:", pathWithoutLocale);

  const isProtected =
    pathWithoutLocale.startsWith("/admin") ||
    pathWithoutLocale.startsWith("/settings");
  const isAuthPage =
    pathWithoutLocale === "/login" || pathWithoutLocale === "/sign-in";

  if (isProtected || isAuthPage) {
    // for checking whole session

    // const { data: session } = await $fetch<Session>("/api/auth/get-session", {
    //     baseURL: origin,
    //     headers: {
    //         cookie: request.headers.get("cookie") || "",
    //     },
    // });

    // for checking only session existance ( make sure to have page level auth check also if using this  )

    const session = getSessionCookie(request);

    // console.log("Session in middleware :- ", { session });

    if (isProtected && !session) {
      return NextResponse.redirect(
        new URL(`${localePrefix}/login${search}`, origin)
      );
    }

    if (isAuthPage && session) {
      return NextResponse.redirect(
        new URL(`${localePrefix}/settings${search}`, origin)
      );
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
