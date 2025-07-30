"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import useClickOutsideDetector from "@/hooks/useClickOutsideDetector";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

interface ModalContent {
  title: string;
  subtitle: string;
  buttonText: string;
}

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "pt", name: "Portuguese" },
];

const pages = [
  { id: "home", name: "Home Page", },
  { id: "about", name: "About Page", },
  { id: "faq", name: "FAQ Page", },
  { id: "visa", name: "Visa Page", },
];

export default function Hero() {
  const t = useTranslations("StickyModalEditor");
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [currentPage, setCurrentPage] = useState("home");
  const [content, setContent] = useState<ModalContent>({ title: "", subtitle: "", buttonText: "" });
  const [isPreviewVisible] = useState(false);
  const [loading, setLoading] = useState(true);
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

  const fetchContent = async (lang: string, pageId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/modal-content?page=${pageId}`);
      const data = await res.json();
      if (data && data[lang]) {
        setContent(data[lang]);
      } else {
        setContent({ title: "", subtitle: "", buttonText: "" });
      }
    } catch (err) {
      console.error(err);
      setContent({ title: "", subtitle: "", buttonText: "" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent(currentLanguage, currentPage);
  }, [currentLanguage, currentPage]);

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    setLanguageDropdownOpen(false);
  };

  const handlePageChange = (pageId: string) => {
    setCurrentPage(pageId);
    setPageDropdownOpen(false);
  };

  const handleInputChange = (field: keyof ModalContent, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/modal-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: currentPage,
          content: {
            [currentLanguage]: content,
          },
        }),
      });

      if (!res.ok) throw new Error();

      toast.success(t("successMessage"));
    } catch (err) {
      console.error(err);
      toast.error(t("errorMessage"));
    }
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
                  <Label className="text-base">{t("languageLabel")}</Label>
                  <div className="relative" ref={languageDropdownRef}>
                    <button
                      className="w-full border border-gray-300 cursor-pointer px-3 py-2 rounded bg-white text-left h-14 flex items-center"
                      onClick={() => setLanguageDropdownOpen((prev) => !prev)}
                      type="button"
                    >
                      {languages.find((l) => l.code === currentLanguage)?.name ||
                        t("selectLanguage")}
                    </button>
                    {languageDropdownOpen && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-48 overflow-auto">
                        {languages.map((lang) => (
                          <li
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${lang.code === currentLanguage ? "bg-gray-100 font-semibold" : ""
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
                  <Label className="text-base">{t("pageLabel")}</Label>
                  <div className="relative" ref={pageDropdownRef}>
                    <button
                      className="w-full border border-gray-300 cursor-pointer px-3 py-2 rounded bg-white text-left h-14 flex items-center"
                      onClick={() => setPageDropdownOpen((prev) => !prev)}
                      type="button"
                    >
                      {pages.find((p) => p.id === currentPage)?.name || t("selectPage")}
                    </button>
                    {pageDropdownOpen && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-48 overflow-auto">
                        {pages.map((page) => (
                          <li
                            key={page.id}
                            onClick={() => handlePageChange(page.id)}
                            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${page.id === currentPage ? "bg-gray-100 font-semibold" : ""
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

              {loading ? (
                <div className="text-center text-gray-500 py-8"><Loader2 className="animate-spin" /></div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label className="text-base" htmlFor="title">
                      {t("titleLabel")}
                    </Label>
                    <Input
                      id="title"
                      value={content.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="h-14 !text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base" htmlFor="subtitle">
                      {t("subtitleLabel")}
                    </Label>
                    <Input
                      id="subtitle"
                      value={content.subtitle}
                      onChange={(e) => handleInputChange("subtitle", e.target.value)}
                      className="h-14 !text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base" htmlFor="buttonText">
                      {t("buttonTextLabel")}
                    </Label>
                    <Input
                      id="buttonText"
                      value={content.buttonText}
                      onChange={(e) => handleInputChange("buttonText", e.target.value)}
                      className="h-14 !text-base"
                    />
                  </div>

                  <div className="flex gap-4 pt-4 flex-wrap">
                    <Button onClick={handleSave} className="h-12 w-40 text-base">
                      {t("saveButton")}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {isPreviewVisible && !loading && (
          <div className="sticky top-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("previewTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto border border-gray-200">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">{content.title}</h3>
                    <p className="text-gray-600 whitespace-pre-line">{content.subtitle}</p>
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
