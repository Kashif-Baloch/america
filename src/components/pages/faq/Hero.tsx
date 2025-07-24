import { useTranslations } from "next-intl";
import React from "react";

const Hero = () => {
  const t = useTranslations("faq.hero");
  return (
    <div className="helmet text-center md:pt-20 pt-10 font-sf">
      <h1 className="md:text-[48px] sm:text-4xl text-3xl font-bold max-w-[657px] mx-auto   leading-[1.2] mb-7">
        {t.rich("headline", {
          blue: (chunks) => (
            <span className="inline-block text-primary-blue px-1 rounded-sm">
              {chunks}
            </span>
          ),
        })}
      </h1>

      <div className="mb-12 md:max-w-[478px] sm:max-w-[400px] mx-auto">
        <p className="  w-full mx-auto leading-relaxed">{t("description")}</p>
      </div>
    </div>
  );
};

export default Hero;
