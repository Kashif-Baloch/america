"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

const DiscoverWhatSetsUsApart = () => {
  const t = useTranslations("discover");
  const cards = t.raw("cards") as {
    title: string;
    description: string;
    image: string;
  }[];

  return (
    <div className="helmet font-sf mt-10">
      <h1 className="md:text-[48px]  sm:text-4xl text-center text-3xl font-medium max-w-[657px] mx-auto leading-[1.2] mb-7">
        {t("title")}
      </h1>

      <div className="mb-12 w-full sm:max-w-[720px] text-center mx-auto">
        <p className="w-full mx-auto leading-relaxed text-light-black">
          {t("description")}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-[#EDECE8]/50 w-[379px] font-inter min-h-[305px] pb-5 rounded-[20px] px-9"
          >
            <Image
              src={card.image}
              alt={card.title}
              height={1000}
              width={1000}
              className="size-[81px] aspect-square rounded-2xl object-cover"
            />
            <h3 className="text-lg my-5 font-medium">{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoverWhatSetsUsApart;
