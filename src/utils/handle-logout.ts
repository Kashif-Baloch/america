import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";

export const LogoutUser = async ({ onSuccess }: { onSuccess: () => void }) => {
    return await signOut(
        {
            fetchOptions: {
                onError: (ctx) => {
                    toast.error(ctx.error.message)
                },
                onSuccess
            }
        }
    )
}