import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFoundPage() {
  const t = useTranslations("NotFound");

  return (
    <section className="min-h-screen h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-8xl font-bold !text-blue-700 dark:text-white mb-6">
          404
        </h2>
        <h2 className="text-4xl md:text-5xl font-bold !text-gray-900 dark:text-white mb-6">
          {t("title")}
        </h2>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          {t("description")}
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
        >
          {t("backToHome")}
          <svg
            className="w-5 h-5 ml-2 -mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
