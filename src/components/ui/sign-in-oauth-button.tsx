"use client"
import React, { useState } from 'react'
import { Button } from './button'
import { FcGoogle } from 'react-icons/fc'
import { useLocale } from 'next-intl';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { signIn } from '@/lib/auth-client';

const SignInOauthButton = ({ text }: { text: string }) => {
    const [isPending, setIsPending] = useState<boolean>(false)
    const locale = useLocale()
    //Handle Google Sign In
    const handleGoogleSignIn = async () => {
        setIsPending(true)
        try {
            await signIn.social({
                provider: "google",
                callbackURL: `/${locale}/settings`,
                errorCallbackURL: `/${locale}/login?error=true`,
                fetchOptions: {
                    onError: (ctx) => {
                        toast.error(ctx.error.message)
                    }
                }
            })
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error?.message || "Opps! Something went wrong!")
            } else {
                toast.error("Opps! Something went wrong!")
            }
        } finally {
            setIsPending(false)
        }
    };

    return (
        <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isPending}
            className="w-full h-12 border-gray-300 cursor-pointer hover:bg-gray-50 rounded-full bg-light-gray text-gray-700"
        >
            {
                isPending ?
                    <Loader2 className='animate-spin' />
                    :
                    <>
                        <FcGoogle className="size-7" />
                        {text}
                    </>
            }
        </Button>
    )
}

export default SignInOauthButton
