"use client";

import { Check, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ThankYouPage() {
  const t = useTranslations("thankyou");
  const [showPage, setShowPage] = useState(true);
  const router = useRouter();
  const benefits = t.raw("benefits") as string[];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
      toast.error("Payment failed");
      router.push("/pricing");
      return;
    }

    fetch("/api/payments/confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId: id }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Payment not approved");
        setShowPage(false);
        toast.success("Payment successful");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Payment failed");
        router.push("/pricing");
      });
  }, [router]);

  if (showPage) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <Loader2Icon size={40} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 font-sf lg:px-8">
      <div className="max-w-3xl mx-auto overflow-hidden p-8">
        <div className="flex justify-center mb-10">
          <Image
            height={900}
            width={900}
            src="/images/Logo.webp"
            priority
            alt="America Working Logo"
            className="h-24 w-auto"
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          {t("title")}
        </h1>

        <p className="text-lg text-center text-gray-600 mb-8 whitespace-pre-line">
          {t("caption")}
          <span className="fi fi-us ml-1 text-xl"></span>
          <br />
          <br />
          {t("caption2")}
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => (window.location.href = "/")}
            className="hidden md:inline-flex justify-center items-center bg-primary-blue cursor-pointer text-white w-fit md:h-14 h-12 text-lg py-2 rounded-full font-semibold hover:bg-white hover:text-primary-blue border border-primary-blue duration-300 px-4"
          >
            {t("button_job_search")}
          </button>
          <Link
            href="/settings"
            className="hidden md:inline-flex justify-center items-center hover:bg-primary-blue cursor-pointer hover:text-white w-fit md:h-14 h-12 text-lg py-2 rounded-full font-semibold bg-white text-primary-blue border border-primary-blue duration-300 px-4"
          >
            {t("button_user_panel")}
          </Link>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {t("benefits_title")}
          </h2>
          <ul className="space-y-4">
            {benefits.map((text, index) => (
              <BenefitItem key={index} text={text} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <li className="flex items-start">
      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
      <span className="text-gray-700 text-lg">{text}</span>
    </li>
  );
}
