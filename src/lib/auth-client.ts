import { createAuthClient } from "better-auth/react";
// Only exporting things that needed 
export const { signIn, signOut, useSession, $fetch, signUp } = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL
})