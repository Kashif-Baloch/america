"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import useClickOutsideDetector from "@/hooks/useClickOutsideDetector";
import { useTranslations } from "next-intl";

interface ModalContent {
  title: string;
  subtitle: string;
  buttonText: string;
}

const defaultContents: Record<string, ModalContent> = {
  en: {
    title: "Legal workers in U.S earn up to *",
    subtitle: "40% MORE!\nLimited spots - sign up now!",
    buttonText: "Subscribe",
  },
  es: {
    title: "Trabajadores legales en EE.UU. ganan hasta *",
    subtitle: "40% MÁS!\nCupos limitados - ¡regístrese ahora!",
    buttonText: "Suscribirse",
  },
  pt: {
    title: "Trabalhadores legais nos EUA ganham até *",
    subtitle: "40% MAIS!\nVagas limitadas - inscreva-se agora!",
    buttonText: "Assinar",
  },
};

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "pt", name: "Portuguese" },
];

const pages = [
  { id: "home", name: "Home Page" },
  { id: "about", name: "About Page" },
  { id: "faq", name: "FAQ Page" },
  { id: "visa", name: "Visa Page" },
];

export default function Hero() {
  const t = useTranslations("StickyModalEditor");
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [currentPage, setCurrentPage] = useState("home");
  const [content, setContent] = useState<ModalContent>(defaultContents.en);
  const [isPreviewVisible] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [pageDropdownOpen, setPageDropdownOpen] = useState(false);

  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const pageDropdownRef = useRef<HTMLDivElement>(null);

  useClickOutsideDetector(languageDropdownRef, () => {
    setLanguageDropdownOpen(false);
  });

  useClickOutsideDetector(pageDropdownRef, () => {
    setPageDropdownOpen(false);
  });

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    setLanguageDropdownOpen(false);
    const savedContent = localStorage.getItem(
      `modalContent-${lang}-${currentPage}`
    );
    setContent(savedContent ? JSON.parse(savedContent) : defaultContents[lang]);
  };

  const handlePageChange = (pageId: string) => {
    setCurrentPage(pageId);
    setPageDropdownOpen(false);
    const savedContent = localStorage.getItem(
      `modalContent-${currentLanguage}-${pageId}`
    );
    setContent(
      savedContent ? JSON.parse(savedContent) : defaultContents[currentLanguage]
    );
  };

  const handleInputChange = (field: keyof ModalContent, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    localStorage.setItem(
      `modalContent-${currentLanguage}-${currentPage}`,
      JSON.stringify(content)
    );
    toast.success(t("successMessage"));
  };

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h2 className="md:text-[40px] text-center sm:text-[32px] text-[26px] font-bold leading-[1.2] mb-6">
        {t("title")}
      </h2>

      <div className="w-full gap-8">
        <div className="space-y-6">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-xl">{t("editSectionTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-base" htmlFor="language">
                    {t("languageLabel")}
                  </Label>
                  <div className="relative" ref={languageDropdownRef}>
                    <button
                      className="w-full border border-gray-300 cursor-pointer px-3 py-2 rounded bg-white text-left h-14 flex items-center"
                      onClick={() => setLanguageDropdownOpen((prev) => !prev)}
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={languageDropdownOpen}
                    >
                      {languages.find((l) => l.code === currentLanguage)
                        ?.name || t("selectLanguage")}
                    </button>
                    {languageDropdownOpen && (
                      <ul
                        role="listbox"
                        tabIndex={-1}
                        className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-48 overflow-auto"
                      >
                        {languages.map((lang) => (
                          <li
                            key={lang.code}
                            role="option"
                            aria-selected={lang.code === currentLanguage}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                              lang.code === currentLanguage
                                ? "bg-gray-100 font-semibold"
                                : ""
                            }`}
                          >
                            {lang.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base" htmlFor="page">
                    {t("pageLabel")}
                  </Label>
                  <div className="relative" ref={pageDropdownRef}>
                    <button
                      className="w-full border border-gray-300 cursor-pointer px-3 py-2 rounded bg-white text-left h-14 flex items-center"
                      onClick={() => setPageDropdownOpen((prev) => !prev)}
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={pageDropdownOpen}
                    >
                      {pages.find((p) => p.id === currentPage)?.name ||
                        t("selectPage")}
                    </button>
                    {pageDropdownOpen && (
                      <ul
                        role="listbox"
                        tabIndex={-1}
                        className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-48 overflow-auto"
                      >
                        {pages.map((page) => (
                          <li
                            key={page.id}
                            role="option"
                            aria-selected={page.id === currentPage}
                            onClick={() => handlePageChange(page.id)}
                            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                              page.id === currentPage
                                ? "bg-gray-100 font-semibold"
                                : ""
                            }`}
                          >
                            {page.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base" htmlFor="title">
                  {t("titleLabel")}
                </Label>
                <Input
                  className="h-14 !text-base placeholder:text-base"
                  id="title"
                  value={content.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base" htmlFor="subtitle">
                  {t("subtitleLabel")}
                </Label>
                <Input
                  id="subtitle"
                  className="h-14 !text-base placeholder:text-base"
                  value={content.subtitle}
                  onChange={(e) =>
                    handleInputChange("subtitle", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base" htmlFor="buttonText">
                  {t("buttonTextLabel")}
                </Label>
                <Input
                  className="h-14 !text-base placeholder:text-base"
                  id="buttonText"
                  value={content.buttonText}
                  onChange={(e) =>
                    handleInputChange("buttonText", e.target.value)
                  }
                />
              </div>

              <div className="flex gap-4 pt-4 flex-wrap">
                <Button onClick={handleSave} className="h-12 w-40 text-base">
                  {t("saveButton")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {isPreviewVisible && (
          <div className="sticky top-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("previewTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto border border-gray-200">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {content.title}
                    </h3>
                    <p className="text-gray-600 whitespace-pre-line">
                      {content.subtitle}
                    </p>
                    <Button className="w-full bg-primary-blue hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-200">
                      {content.buttonText}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
