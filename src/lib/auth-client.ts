import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "@/lib/auth";

// Only exporting things that needed 
export const { signIn, signOut, useSession, $fetch, sendVerificationEmail, signUp, forgetPassword, resetPassword, updateUser } = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        inferAdditionalFields<typeof auth>()
    ]
})