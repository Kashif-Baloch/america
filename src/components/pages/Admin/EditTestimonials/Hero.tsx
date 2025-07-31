"use client";

import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import { v4 as uuid } from "uuid"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Loader2, LucideQuote, Pencil, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import "flag-icons/css/flag-icons.min.css";
import flagOptions from "@/utils/constant/FlagOptions";
import useClickOutsideDetector from "@/hooks/useClickOutsideDetector";
import { computeSHA256 } from "@/lib/utils";
import { getSignedURL } from "@/lib/s3";
import kyInstance from "@/lib/ky";

// Types
type Testimonial = {
  id: string;
  name: string;
  country: string;
  flag: string;
  text: {
    en: string;
    es: string;
    pt: string;
  };
  image: string;
};

export default function TestimonialsCMS() {
  const t = useTranslations("testimonials");

  const [testimonials, setTestimonials] = useState<Testimonial[]>([

  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [activeLanguage, setActiveLanguage] = useState<"en" | "es" | "pt">(
    "en"
  );

  // Dynamic validation schema with translations
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("validation.nameRequired")),
    country: Yup.string().required(t("validation.countryRequired")),
    flag: Yup.string().required(t("validation.flagRequired")),
    text: Yup.object().shape({
      en: Yup.string().required(t("validation.englishTextRequired")),
      es: Yup.string().required(t("validation.spanishTextRequired")),
      pt: Yup.string().required(t("validation.portugueseTextRequired")),
    }),
    image: Yup.string().required(t("validation.imageRequired")),
  });

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      name: "",
      country: "",
      flag: "",
      text: {
        en: "",
        es: "",
        pt: "",
      },
      image: "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (editingId) {
        updateTestimonial(values);
      } else {
        addTestimonial(values);
      }
    },
  });

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // Replace with your actual API call
        const response = await fetch("/api/testimonials");
        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        toast.error(t("messages.failedToLoad"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, [t]);

  // Update preview image
  useEffect(() => {
    if (formik.values.image) {
      setPreviewImage(formik.values.image);
    }
  }, [formik.values.image]);

  const addTestimonial = async (values: Omit<Testimonial, "id">) => {
    try {
      const newTestimonial = {
        ...values,
        image: "https://avatars.githubusercontent.com/u/61820514?v=4",
        id: Date.now().toString(),
      };

      // API call to add testimonial
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTestimonial),
      });

      if (response.ok) {
        setTestimonials([...testimonials, newTestimonial]);
        formik.resetForm();
        toast.success(t("messages.addedSuccessfully"));
      } else {
        throw new Error("Failed to add testimonial");
      }
    } catch (error) {
      console.error("Error adding testimonial:", error);
      toast.error(t("messages.failedToAdd"));
    }
  };

  const updateTestimonial = async (values: Omit<Testimonial, "id">) => {
    if (!editingId) return;

    try {
      const updatedTestimonial = {
        ...values,
        image: values.image,
        id: editingId,
      };

      // API call to update testimonial
      const response = await fetch(`/api/testimonials/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTestimonial),
      });

      if (response.ok) {
        setTestimonials(
          testimonials.map((t) => (t.id === editingId ? updatedTestimonial : t))
        );
        formik.resetForm();
        setEditingId(null);
        toast.success(t("messages.updatedSuccessfully"));
      } else {
        throw new Error("Failed to update testimonial");
      }
    } catch (error) {
      console.error("Error updating testimonial:", error);
      toast.error(t("messages.failedToUpdate"));
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      // API call to delete testimonial
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTestimonials(testimonials.filter((t) => t.id !== id));
        toast.success(t("messages.deletedSuccessfully"));
      } else {
        throw new Error("Failed to delete testimonial");
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error(t("messages.failedToDelete"));
    }
  };

  const editTestimonial = (testimonial: Testimonial) => {
    formik.setValues({
      name: testimonial.name,
      country: testimonial.country,
      flag: testimonial.flag,
      text: testimonial.text,
      // image: testimonial.image,
      image: testimonial.image,
    });
    setPreviewImage(testimonial.image)
    setEditingId(testimonial.id);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true)
      const file = e.target.files?.[0];
      if (file) {
        const checksum = await computeSHA256(file);
        const signedURLResult = await getSignedURL(file.type, file.size, checksum, `${uuid()}-${uuid()}`);

        if (signedURLResult.error !== undefined) {
          toast.error("Can't get signedURL from server");
          return;
        }

        const url = signedURLResult.data.url;
        const mainURL = url.split("?")[0];

        await kyInstance.put(url, {
          body: file,
          headers: { 'Content-Type': file.type },
          timeout: 120_000
        });

        formik.setFieldValue("image", mainURL as string);
        // const reader = new FileReader();
        // reader.onload = (event) => {
        //   if (event.target?.result) {
        //     formik.setFieldValue("image", event.target.result as string);
        //   }
        // };
        // reader.readAsDataURL(file);
      }
    } finally {
      setIsUploading(false)
    }
  };

  const languageLabels = {
    en: {
      label: t("languages.english"),
      error: t("validation.englishTextRequired"),
    },
    es: {
      label: t("languages.spanish"),
      error: t("validation.spanishTextRequired"),
    },
    pt: {
      label: t("languages.portuguese"),
      error: t("validation.portugueseTextRequired"),
    },
  };

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedValue = formik.values.flag;
  const selectedOption = flagOptions.find((opt) => opt.value === selectedValue);

  // Close dropdown if click outside
  useClickOutsideDetector(dropdownRef, () => {
    setIsOpen(false);
  });

  const toggleDropdown = () => setIsOpen((open) => !open);

  const handleSelect = (value: string) => {
    formik.setFieldValue("flag", value);
    formik.setFieldTouched("flag", true, true);
    setIsOpen(false);
  };

  return (
    <div className="sm:px-12 px-4 py-8 font-sf relative">
      {isUploading
        &&
        <div className="absolute top-0 left-0 w-full h-full z-[100] bg-white/70 flex items-center flex-col gap-1 justify-center">
          <Loader2 className="animate-spin" />
          Uploading Image..
        </div>}
      <h2 className="md:text-[40px] text-center sm:text-[32px] text-[26px] font-bold leading-[1.2] mb-6">
        {t("title")}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {editingId
                ? t("form.editTestimonial")
                : t("form.addNewTestimonial")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <Label className="text-base mb-2" htmlFor="name">
                  {t("form.name")}
                </Label>
                <Input
                  className="h-14 !text-base placeholder:text-base"
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.name}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-base mb-2" htmlFor="country">
                  {t("form.country")}
                </Label>
                <Input
                  className="h-14 !text-base placeholder:text-base"
                  id="country"
                  name="country"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.country && formik.errors.country && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.country}
                  </div>
                )}
              </div>

              <div className="relative" ref={dropdownRef}>
                <label
                  className="text-base mb-2 block select-none cursor-pointer"
                  onClick={toggleDropdown}
                >
                  {t("form.flag")}
                </label>

                <div
                  className="border border-gray-300 rounded p-2 cursor-pointer flex items-center justify-between"
                  onClick={toggleDropdown}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleDropdown();
                    }
                    if (e.key === "Escape") {
                      setIsOpen(false);
                    }
                  }}
                  role="button"
                  aria-haspopup="listbox"
                  aria-expanded={isOpen}
                  aria-labelledby="flag-label"
                >
                  {selectedOption ? (
                    <div className="flex items-center gap-2">
                      <span className={`fi fi-${selectedOption.value}`} />
                      <span>{selectedOption.label}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">
                      {t("form.selectFlag")}
                    </span>
                  )}
                  <svg
                    className={`w-4 h-4 ml-2 transition-transform ${isOpen ? "transform rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {isOpen && (
                  <div
                    className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded border border-gray-300 bg-white shadow-lg"
                    role="listbox"
                  >
                    {flagOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`cursor-pointer select-none px-3 py-2 flex items-center gap-2 hover:bg-gray-100 ${selectedValue === option.value
                          ? "bg-gray-200 font-semibold"
                          : ""
                          }`}
                        onClick={() => handleSelect(option.value)}
                        role="option"
                        aria-selected={selectedValue === option.value}
                        tabIndex={-1}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSelect(option.value);
                          }
                        }}
                      >
                        <span className={`fi fi-${option.value}`} />
                        <span>{option.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {formik.touched.flag && formik.errors.flag && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.flag}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-base mb-3">
                  {t("form.testimonialText")}
                </Label>
                <div className="flex gap-2 mb-4">
                  {(["en", "es", "pt"] as const).map((lang) => (
                    <Button
                      key={lang}
                      variant={activeLanguage === lang ? "default" : "outline"}
                      size="lg"
                      className="text-base"
                      type="button"
                      onClick={() => setActiveLanguage(lang)}
                    >
                      {languageLabels[lang].label}
                    </Button>
                  ))}
                </div>
                <Textarea
                  name={`text.${activeLanguage}`}
                  value={formik.values.text[activeLanguage]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="!text-base placeholder:text-base h-32"
                  placeholder={t("form.enterTestimonialIn", {
                    language: languageLabels[activeLanguage].label,
                  })}
                />
                {formik.touched.text?.[activeLanguage] &&
                  formik.errors.text?.[activeLanguage] && (
                    <div className="text-red-500 text-sm mt-1">
                      {languageLabels[activeLanguage].error}
                    </div>
                  )}
              </div>

              <div>
                <Label className="text-base mb-2" htmlFor="image">
                  {t("form.image")}
                </Label>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-full">
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer border h-20 justify-center rounded-md p-2 flex items-center gap-2"
                    >
                      <Upload size={16} />
                      <span>{t("form.uploadImage")}</span>
                    </label>
                    <input
                      className="h-14 !text-base placeholder:text-base hidden"
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
                {formik.touched.image && formik.errors.image && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.image}
                  </div>
                )}
                {previewImage && (
                  <div className="mt-2">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary">
                      <Image
                        src={previewImage}
                        alt={t("form.preview")}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              <CardFooter className="flex justify-end gap-2 px-0 pb-0 pt-6">
                {editingId && (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      formik.resetForm();
                      setEditingId(null);
                    }}
                  >
                    {t("form.cancel")}
                  </Button>
                )}
                <Button type="submit" className="text-base px-4 h-12">
                  {editingId ? t("form.update") : t("form.add")}{" "}
                  {t("form.testimonial")}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>

        {/* List Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t("list.testimonials")}</CardTitle>
            <CardDescription className="text-base">
              {t("list.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-lg">{t("list.loading")}</div>
            ) : testimonials.length === 0 ? (
              <div className="text-lg">{t("list.noTestimonials")}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-base">
                      {t("table.name")}
                    </TableHead>
                    <TableHead className="text-base">
                      {t("table.country")}
                    </TableHead>
                    <TableHead className="text-base">
                      {t("table.flag")}
                    </TableHead>
                    <TableHead className="text-base">
                      {t("table.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell>{testimonial.name}</TableCell>
                      <TableCell>{testimonial.country}</TableCell>
                      <TableCell>
                        <span className={`fi fi-${testimonial.flag}`} />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => editTestimonial(testimonial)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => deleteTestimonial(testimonial.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <div className="mt-12 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">{t("preview.title")}</h2>
        <div className="bg-white border border-border rounded-[32px] font-sf px-8 py-2 pt-10 pb-9 shadow-xs max-w-[370px] text-center flex flex-col items-center relative w-full min-w-[340px]">
          {formik.values.flag && (
            <div className="absolute top-8 left-8 flex flex-col items-center">
              <span
                className={`fi fi-${formik.values.flag} rounded-sm flex text-4xl flex-shrink-0`}
              />
              <span className="mt-2">
                {formik.values.country || t("preview.country")}
              </span>
            </div>
          )}
          <div className="relative mb-5">
            {previewImage ? (
              <span className="block rounded-full border-4 border-primary-blue shadow-lg">
                <Image
                  src={previewImage}
                  alt={formik.values.name || t("preview.alt")}
                  width={110}
                  height={110}
                  className="rounded-full object-cover object-center size-32"
                />
              </span>
            ) : (
              <div className="size-32 rounded-full border-4 border-primary-blue bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">{t("preview.noImage")}</span>
              </div>
            )}
            <span className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-primary-blue text-white w-12 h-12 flex items-center justify-center rounded-full text-3xl">
              <LucideQuote />
            </span>
          </div>
          <p className="text-gray-500 mb-8 font-inter min-h-[210px] md:min-h-[180px]">
            {formik.values.text[activeLanguage] ||
              t("preview.testimonialText", {
                language: languageLabels[activeLanguage].label,
              })}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-xl font-sf font-semibold">
              {formik.values.name || t("preview.name")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
