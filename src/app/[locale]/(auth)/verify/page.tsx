import FormLeftSection from "@/components/shared/form-left-section";
import { SendVerificationEmailForm } from "@/components/ui/send-verification-email-form";
import { Link, redirect } from "@/i18n/navigation";
import Image from "next/image";

interface PageProps {
    searchParams: Promise<{ error: string }>;
    params: Promise<{ locale: string }>;
}

export default async function Page({ searchParams, params }: PageProps) {
    const { locale } = await params;
    const error = (await searchParams).error;

    if (!error) redirect({ href: "/settings", locale });

    const formatError = (text: string) =>
        text
            .replace(/_/g, " ")
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

    return (
        <div className="min-h-[117dvh] flex font-sf">
            {/* Left Side - Branding */}
            <FormLeftSection imgSrc="/images/signup.webp" />

            {/* Right Side - Form */}
            <div className="flex-1 bg-white md:mt-16 flex items-center justify-center p-8 flex-col">
                {/* Logo and Header */}
                <div className="relative z-10 md:hidden flex w-full sm:max-w-md ">
                    <Link href={"/"}>
                        <div className="flex items-center justify-start  gap-3">
                            <Image
                                src={"/images/Logo.webp"}
                                alt="Logo"
                                height={1000}
                                width={1000}
                                className="w-[80px] object-cover"
                            />

                            <span className="font-medium font-sf sm:text-3xl text-xl mb-2">
                                America Working
                            </span>
                        </div>
                    </Link>
                </div>
                <div className="w-full sm:max-w-md">
                    <div className="py-2 max-w-screen-lg mx-auto space-y-8">


                        <h1 className="text-3xl font-bold">Verify Your Email</h1>

                        <p className="text-destructive">
                            {error === "email_not_verified" ? (
                                <>
                                    Your email address is not verified yet. We’ve sent you a verification link — please check your inbox. If you didn’t receive it, you can request a new one below.
                                </>
                            ) : (
                                <>
                                    {formatError(error)}. Please request a new verification email below if needed.
                                </>
                            )}
                        </p>
                        <SendVerificationEmailForm />
                    </div>
                </div>
            </div>
        </div>

    );
}
