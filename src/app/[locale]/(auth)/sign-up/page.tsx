"use client";
//Components
import FormLeftSection from "@/components/shared/form-left-section";
import SignUpForm from "@/Forms/SignUpForm";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React from "react";

const SignUpPage = () => {
  const t = useTranslations("signup");
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "";
  const price = searchParams.get("price") || "";
  const description = searchParams.get("description") || "";

  console.log(name, price, description);

  return (
    <div className="min-h-[117dvh] flex font-sf">
      {/* Left Side - Branding */}
      <FormLeftSection imgSrc="/images/signup.webp" />

      {/* Right Side - Form */}
      <div className="flex-1 bg-white md:mt-16 flex items-center justify-center p-8 flex-col">
        {/* Logo and Header */}
        <div className="relative z-10 md:hidden flex w-full sm:max-w-md ">
          <Link href={"/"}>
            <div className="flex items-center justify-start  gap-3 mb-5">
              <Image
                src={"/images/Logo.webp"}
                alt="Logo"
                height={1000}
                width={1000}
                className="w-[80px] object-cover"
              />

              <span className="font-medium font-sf sm:text-3xl text-xl">
                America Working
              </span>
            </div>
          </Link>
        </div>
        <div className="w-full sm:max-w-md">
          <div className="mb-8">
            <h1 className="md:text-3xl text-2xl font-bold mb-2 leading-[1.2]">
              {t.rich("title", {
                bold: (chunks) => (
                  <span className="text-blue-600">{chunks}</span>
                ),
              })}
            </h1>

            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>

          <SignUpForm
            paymentParams={
              name && price && description
                ? { name, price, description }
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
