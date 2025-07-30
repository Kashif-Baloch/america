"use client";

import { useCenterScrollTrigger } from "@/hooks/useCenterScrollTrigger";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface ModalContent {
  title: string;
  subtitle: string;
  buttonText: string;
}

const pathToPageMap: Record<string, string> = {
  "/": "home",
  "/about": "about",
  "/visa-process": "visa",
  "/faqs": "faq",
};

const FloatingBox = () => {
  const t = useTranslations("floatingBox");
  const locale = useLocale();
  const pathname = usePathname();
  const hasReachedCenter = useCenterScrollTrigger();

  const [isVisible, setIsVisible] = useState(true);
  const [content, setContent] = useState<ModalContent | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      const cleanPath = pathname.replace(/^\/(en|es|pt)/, "") || "/";
      const pageKey = pathToPageMap[cleanPath] || null;

      if (!pageKey) return;

      try {
        const res = await fetch(`/api/modal-content?page=${pageKey}`);
        const data = await res.json();
        if (data && data[locale]) {
          setContent(data[locale]);
        }
      } catch (error) {
        console.error("Failed to fetch floating box content", error);
      }
    };

    fetchContent();
  }, [locale, pathname]);

  if (!isVisible || !content) return null;

  return (
    <div
      className={`!z-50 fixed top-20 md:top-1/2 px-4 md:px-0 font-sf flex justify-end 2xl:right-[5%] right-0 md:right-[2%] ${hasReachedCenter ? "animate-slide-in block" : "opacity-0 hidden"
        }`}
    >
      <div className="bg-[url('/images/gift-subscription-bg.png')] bg-cover text-white md:py-5 py-9 font-sf rounded-2xl px-5 md:max-w-[360px]">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-6 md:right-2 cursor-pointer text-white text-lg bg-white/20 rounded-full w-6 h-6 flex items-center justify-center hover:bg-white/40 transition"
          aria-label="Close"
        >
          ×
        </button>
        <h3 className="text-[22px] font-bold text-center">{content.title}</h3>
        <p className="text-center text-white/90 tracking-wider my-3 text-lg font-light whitespace-pre-line">
          {content.subtitle}
        </p>
        <Link
          href="/pricing"
          className="text-white bg-gradient-to-r text-center from-[#CB9442] to-[#FEDC6E] mt-5 font-medium mx-auto h-12 px-8 rounded-full flex justify-center items-center duration-300 hover:from-black hover:to-black"
        >
          {content.buttonText || t("subscribe")}
        </Link>
      </div>
    </div>
  );
};

export default FloatingBox;
