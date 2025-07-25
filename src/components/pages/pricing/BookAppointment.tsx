import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import React from "react";

const BookAppointment = () => {
  const t = useTranslations("pricing.book");
  return (
    <div className="helmet font-sf my-10">
      <div className="max-w-[817px] text-center mx-auto">
        <h2 className="sm:text-[32px] text-center   text-2xl font-medium  leading-[1.2]">
          {t.rich("headline", {
            highlight: (chunks) => (
              <span className="text-primary-blue pl-2">{chunks}</span>
            ),
          })}
        </h2>

        <p className="my-5 w-full mx-auto leading-relaxed">
          {t("description")}
        </p>

        <Link
          target="_blank"
          href={
            "https://docs.google.com/forms/d/e/1FAIpQLSeTmbT_WZDtfr8wKjMy8Gy_B58IZj9Ia67MnX_twE6ZL5ou-A/viewform?usp=header"
          }
          className="uppercase bg-primary-blue hover:bg-primary-blue/90 duration-300 text-white grid place-items-center mx-auto rounded-full w-60 h-12 cursor-pointer blue-btn-shadow "
        >
          {t("button")}
        </Link>
      </div>
    </div>
  );
};

export default BookAppointment;
