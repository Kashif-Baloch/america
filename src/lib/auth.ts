import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { hashPassword, verifyPassword } from "./argon2";
import { db } from "./prisma";
import { normalizeName, VALID_DOMAINS } from "./utils";
import { Role } from "@/generated/prisma";

export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        autoSignIn: true,
        password: {
            hash: hashPassword,
            verify: verifyPassword,
        },
    },
    hooks: {
        before: createAuthMiddleware(async (ctx) => {

            if (ctx.path === "/sign-up/email") {
                const email = String(ctx.body.email);
                const domain = email.split("@")[1].toLowerCase();

                if (!VALID_DOMAINS().includes(domain)) {
                    throw new APIError("BAD_REQUEST", {
                        message: "Opps! Invalid domain. Please use a valid email.",
                    });
                }

            }

            if (ctx.path === "/sign-in/magic-link") {
                const name = normalizeName(ctx.body.name);

                return {
                    context: { ...ctx, body: { ...ctx.body, name } },
                };
            }

            if (ctx.path === "/update-user") {
                const name = normalizeName(ctx.body.name);

                return {
                    context: { ...ctx, body: { ...ctx.body, name } },
                };
            }

        })
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") ?? []

                    if (ADMIN_EMAILS.includes(user.email)) {
                        return { data: { ...user, role: Role.ADMIN } };
                    }

                    return { data: { ...user, role: Role.USER } };
                }
            }
        }
    },
    // for user roles 
    user: {
        additionalFields: {
            role: {
                type: ["USER", "ADMIN"] as Array<Role>,
                input: false // just if you don't want to put it manually when creating user
            },
            phone: {
                type: "string",
                input: true
            },
            resumeLink: {
                type: "string",
                input: true
            }
        }
    },
    session: {
        expiresIn: 30 * 24 * 60 * 60
    },
    advanced: {
        database: {
            generateId: false
        }
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    trustedOrigins: [
        String(process.env.NEXT_PUBLIC_API_URL)
    ],
    plugins: [nextCookies()]
});

export type ErrorCodeBetterAuth = keyof typeof auth.$ERROR_CODES | "UNKNOWN"