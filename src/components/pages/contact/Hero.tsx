import ContactForm from "@/Forms/ContactForm";
import { Link } from "@/i18n/navigation";
import { MailIcon } from "@/utils/Icons";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("contact");
  return (
    <div className="helmet  font-sf md:pt-20 pt-10">
      <div className="grid xl:grid-cols-[419px_1fr] gap-12 lg:gap-20 items-start">
        {/* Left side */}
        <div className="space-y-8">
          <h1 className="md:text-[48px] sm:text-4xl text-3xl font-bold  text-left   leading-[1.2] mb-7">
            {t("headline")}
          </h1>
          <p className="  w-full mx-auto leading-[20px] text-light-black">
            {t("description")}
          </p>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center">
              <MailIcon />
            </div>
            {/* <Link
              href={"mailto:letstart@americaworking.co"}
              className="text-[17px] font-medium"
            >
              letstart@americaworking.co
            </Link> */}
            <Link
              href={`mailto:${t("emailLabel")}`}
              className="text-[17px] font-medium"
            >
              {t("emailLabel")}
            </Link>
          </div>
        </div>

        {/* Right side */}
        <div className="bg-white rounded-3xl sm:shadow-[0px_7px_14px_0px_#080F3408] sm:border border-[#E4E4ED] sm:p-8 p-0">
          <ContactForm />
        </div>
      </div>

      {/* Direct email options */}
      {/* <div className="mt-20">
        <h2 className="text-[32px] font-medium text-center mb-12">
          You can also email us directly
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8  mx-auto">
          {[
            {
              icon: <SupportIcon />,
              title: "Support",
              email: "letstart@americaworking.co ",
            },
            {
              icon: <FeatureIcon />,
              title: "Featured jobs",
              email: "letstart@americaworking.co ",
            },
            {
              icon: <PartnershipIcon />,
              title: "Partnerships",
              email: "letstart@americaworking.co ",
            },
          ].map(({ icon, title, email }) => (
            <div
              key={title}
              className=" flex p-3 sm:gap-4 gap-2 max-md:max-w-[400px] w-full max-md:mx-auto  justify-center min-h-[136px] items-center border border-[#E4E4ED] shadow-[0px_7px_14px_0px_#080F3408] rounded-[20px]"
            >
              <div className="grid place-items-center ">{icon}</div>
              <div>
                <h3 className="text-xl font-medium  mb-1">{title}</h3>
                <Link
                  href={`mailto:${email}`}
                  className="text-primary-blue sm:text-base text-sm hover:text-primary-dark-blue duration-300 font-inter  font-medium"
                >
                  {email}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
