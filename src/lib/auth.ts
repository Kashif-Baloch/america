import { Role } from "@prisma/client";
import { betterAuth, User } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { hashPassword, verifyPassword } from "./argon2";
import { db } from "./prisma";
import { normalizeName, VALID_DOMAINS } from "./utils";
import { sendEmailAction } from "@/actions/send-email.action";
import { styles } from "@/utils/constant/styles.constents";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 60 * 60, // 1 hour
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({
      user,
      url,
    }: {
      user: User;
      url: string;
    }) => {
      const link = new URL(url);
      link.searchParams.set("callbackURL", "/verify");
      await sendEmailAction({
        to: user.email,
        subject: "Verify your email address",
        html: `
                          <div style="${styles.container}">
                          <h1 style="${styles.heading}">Verify your email address</h1>
                          <p style="${styles.paragraph}">Please verify your email address to complete the registration process.</p>
                          <a href="${link}" style="${styles.link}">Click Here</a>
                          </div>
                          `,
      });
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: false,
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmailAction({
        to: user.email,
        subject: "Reset your password",
        html: `
                          <div style="${styles.container}">
                          <h1 style="${styles.heading}">Reset your password</h1>
                          <p style="${styles.paragraph}">Please click the link below to reset your password.</p>
                          <a href="${url}" style="${styles.link}">Click Here</a>
                          </div>
                          `,
      });
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
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") ?? [];

          await sendEmailAction({
            to: user.email,
            subject: "Gracias por registrarte en America Working 🇺🇸",

            html: `
                          <div style="${styles.container}">
                            <p style="font-size: 18px; line-height: 1.6;">
                              Gracias por registrarte en <strong>America Working 🇺🇸</strong>
                            </p>
                    
                            <p style="font-size: 16px; line-height: 1.6;">
                              ¡Ya formas parte de nuestra comunidad! Tu cuenta ha sido creada con éxito y estás a un paso de acceder a cientos de empleadores que buscan personas como tú para trabajar legalmente en Estados Unidos.
                            </p>
                    
                            <p style="font-size: 16px; line-height: 1.6;">
                              Explora nuestros diferentes planes y funciones disponibles en<br>
                              👉 <a href="https://www.americaworking.co" target="_blank" style="color: #1a73e8;">www.americaworking.co</a>
                            </p>
                    
                            <p style="font-size: 16px; line-height: 1.6;">
                              <strong>Solo te falta un paso más:</strong><br>
                              activar tu suscripción para desbloquear todas las herramientas.
                            </p>
                    
                            <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />
                    
                            <p style="font-size: 15px; line-height: 1.6;">
                              ¿Tienes preguntas?<br>
                              Escríbenos a <a href="mailto:letstart@americaworking.co">letstart@americaworking.co</a> o por WhatsApp desde la página web.
                            </p>
                    
                            <p style="font-size: 15px; line-height: 1.6;">
                              Gracias por confiar en nosotros.<br>
                              <strong>El equipo de America Working</strong><br>
                              <a href="https://www.americaworking.co" target="_blank">www.americaworking.co</a>
                            </p>
                          </div>
                        `,
          });

          if (ADMIN_EMAILS.includes(user.email)) {
            return { data: { ...user, role: Role.ADMIN } };
          }

          return { data: { ...user, role: Role.USER } };
        },
      },
    },
  },
  // for user roles
  user: {
    additionalFields: {
      role: {
        type: ["USER", "ADMIN"] as Array<Role>,
        input: false, // just if you don't want to put it manually when creating user
      },
      phone: {
        type: "string",
        input: true,
      },
      resumeLink: {
        type: "string",
        input: true,
      },

    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60,
  },
  account: {
    accountLinking: {
      enabled: false,
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: [String(process.env.NEXT_PUBLIC_API_URL)],
  plugins: [nextCookies()],
});

export type ErrorCodeBetterAuth = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
