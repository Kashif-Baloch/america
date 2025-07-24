"use client";
import { useCenterScrollTrigger } from "@/hooks/useCenterScrollTrigger";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
interface FloatingBoxInterface {
  message: string;
  tagline: string;
}
const FloatingBox = (props: FloatingBoxInterface) => {
  const t = useTranslations("floatingBox");
  const hasReachedCenter = useCenterScrollTrigger();

  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className={` !z-50 fixed top-20 md:top-1/2 px-4 md:px-0 font-sf flex  justify-end 2xl:right-[5%] right-0 md:right-[2%] ${
        hasReachedCenter ? "animate-slide-in block" : " opacity-0 hidden"
      }`}
    >
      <div
        className={`bg-[url('/images/gift-subscription-bg.png')] bg-cover text-white md:py-5 py-9 font-sf rounded-2xl  px-5  md:max-w-[360px]`}
      >
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-6 md:right-2 cursor-pointer text-white text-lg bg-white/20 rounded-full w-6 h-6 flex items-center justify-center hover:bg-white/40 transition"
          aria-label="Close"
        >
          ×
        </button>
        <h3 className="text-[22px] font-bold text-center">
          {/* {t("visaMessage")} */}
          {props.message}

          {/* {t("applyNow")} */}
        </h3>
        <p className="text-center text-white/90 tracking-wider my-3 text-lg font-light">
          {props.tagline}
        </p>
        <Link
          href={"/pricing"}
          className="text-white bg-gradient-to-r from-[#CB9442] to-[#FEDC6E]  mt-5 font-medium mx-auto h-12 w-32 rounded-full flex justify-center items-center duration-300 hover:from-black hover:to-black"
        >
          {t("subscribe")}
        </Link>
      </div>
    </div>
  );
};

export default FloatingBox;
