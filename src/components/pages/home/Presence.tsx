import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const Presence = () => {
  const t = useTranslations("home.presence");

  return (
    <div className="max-w-[603px] w-11/12 my-16 font-sf mx-auto">
      <h1 className="md:text-5xl sm:text-4xl text-3xl font-bold leading-[1.2] max-sm:w-10/12 mx-auto text-center">
        {t("title")} <span className="fi fi-us size-7 align-middle"></span>{" "}
        <span>{t("country1")}</span>
        <span className="fi fi-co size-7 align-middle"></span> {t("country2")}
      </h1>

      <div className="flex justify-center flex-wrap sm:flex-row flex-col gap-5 my-9">
        <div className="flex flex-col gap-y-6 items-center max-sm:w-full">
          <div className="bg-primary-dark-blue font-sf font-medium tracking-wide p-3 max-w-52 text-center rounded-md text-white">
            {t("presence_colombia_bogota")}
          </div>
          <Link
            href={"https://ruesfront.rues.org.co/buscar/RM/AmericaWorking"}
            target="_blank"
          >
            <Image
              src={"/images/camora.webp"}
              alt=""
              height={1000}
              width={1000}
              className="sm:size-[160px] size-28 rounded-2xl object-contain"
            />
          </Link>
        </div>
        <div className="flex flex-col gap-y-6 items-center max-sm:w-full">
          <div className="bg-primary-dark-blue font-sf font-medium tracking-wide p-3 max-w-52 text-center rounded-md text-white">
            {t("presence_wyoming")}
          </div>
          <Link
            href={
              "https://wyobiz.wyo.gov/business/FilingDetails.aspx?eFNum=065038044054087207243016094013144104058045214019"
            }
            target="_blank"
          >
            <Image
              src={"/images/wybiz.webp"}
              alt=""
              height={1000}
              width={1000}
              className="sm:size-[160px] w-28 object-contain"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Presence;
