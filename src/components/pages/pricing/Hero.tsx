import { useTranslations } from "next-intl";
import React from "react";

const Hero = () => {
  const t = useTranslations("pricing");
  return (
    <div>
      <div className="helmet text-center md:pt-20 pt-10 font-sf">
        <h1 className="md:text-[48px] sm:text-4xl text-3xl font-bold   leading-[1.2] mb-6">
          {t("headline")}{" "}
          <span className="inline-block text-primary-blue  px-1 rounded-sm">
            {t("highlight")}
          </span>
          {t("end")}
        </h1>

        <div className="mb-12 md:max-w-[478px] sm:max-w-[400px] mx-auto">
          <p className="  w-full mx-auto leading-relaxed">{t("description")}</p>
        </div>

        <h1 className="md:text-[40px] sm:text-[32px] text-[26px] font-bold   leading-[1.2] mb-6">
          {t("subheadline")}
        </h1>

        <div className="mb-12 md:max-w-[478px] sm:max-w-[400px] mx-auto">
          <p className="  w-full mx-auto leading-relaxed">
            {t("subdescription")}
          </p>
        </div>
        <div className="max-w-[748px] mx-auto text-left px-6 py-10 rounded-2xl border-l-4 border-l-primary-blue bg-ghost-blue/80">
          <p className="leading-[25px] tracking-wide text-light-black">
            {t.rich("disclaimer", {
              strong: (chunks) => <strong className="mx-1">{chunks}</strong>,
              br: () => <br></br>,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
