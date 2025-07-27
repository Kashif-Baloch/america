import FormLeftSection from "@/components/shared/form-left-section";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function Page() {
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
                    <div className="py-2 container mx-auto max-w-screen-lg space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold">Verification Link Sent</h1>

                            <p className="text-muted-foreground">
                                We&apos;ve successfully re-sent the verification email to your inbox. Please check your email and click the link to verify your account.
                            </p>

                            <p className="text-muted-foreground pb-2">
                                Didn&apos;t receive the email? Make sure to check your spam or junk folder as well.
                            </p>

                            <Button
                                asChild
                                className="w-full h-12 cursor-pointer text-lg bg-primary-blue hover:bg-white hover:text-primary-blue border border-primary-blue text-white font-semibold rounded-full"
                            >
                                <Link href={"/"}>
                                    <ArrowLeft /> Return to Home
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
