import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

const Hero = () => {
  const t = useTranslations("hero");
  const stats = t.raw("stats") as { title: string; subtitle: string }[];
  return (
    <div className="helmet text-center md:pt-20 pt-10 font-sf">
      <h1 className="md:text-[48px] sm:text-4xl text-3xl font-bold max-w-[657px] mx-auto   leading-[1.2] mb-7">
        {t("headline")}
        <span className="inline-block text-primary-blue  px-1 rounded-sm">
          {t("highlight")}
        </span>
      </h1>

      <div className="mb-12 md:max-w-[657px] w-full  mx-auto">
        <p className="  w-full mx-auto leading-relaxed text-center">
          {t("description")}
        </p>
      </div>
      <Image
        src={"/images/about-hero.jpg"}
        alt="About Us Image"
        height={1000}
        width={1000}
        className="w-full h-full  rounded-3xl"
      />
      <div className="my-10">
        <h1 className="md:text-[48px] sm:text-4xl text-3xl  sm:text-left  text-center  leading-[1.2] mb-7">
          {t("subheadline")}
        </h1>

        <div className="mt-12 ">
          <p className="  w-full sm:text-left  text-center leading-relaxed text-light-black">
            {t.rich("body", {
              bold1: (chunks) => <strong className="mx-2">{chunks}</strong>,
              bold2: (chunks) => <strong className="mx-2">{chunks}</strong>,
            })}
          </p>
        </div>
        {/* Rendering the Stats */}
        <div className="flex flex-wrap gap-8 justify-between mb-20 mt-16">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:items-start items-center sm:text-left  text-center max-sm:w-full sm:min-w-[180px]"
            >
              <h1 className="md:text-[48px] sm:text-4xl text-3xl text-left leading-[1.2] mb-2 ">
                {stat.title}
              </h1>
              <p className="text-[#47505C]/65 font-inter text-left">
                {stat.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
