"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { useState } from "react";

import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import * as Yup from "yup";

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactForm = () => {
  const t = useTranslations("contact.form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locale = useLocale() as "en" | "es" | "pt"
  // Yup validation schema
  const ContactFormSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required(t("required")),
    email: Yup.string()
      .email("Please enter a valid email address")
      .required(t("required")),
    phone: Yup.string()
      .min(10, "Phone number must be at least 10 characters")
      .required(t("required")),
    subject: Yup.string()
      .min(3, "Subject must be at least 3 characters")
      .required(t("required")),
    message: Yup.string()
      .min(10, "Message must be at least 10 characters")
      .required(t("required")),
  });

  const handleSubmit = async (
    values: ContactFormValues,
    { resetForm }: FormikHelpers<ContactFormValues>
  ) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      // const data = await res.json();

      if (res.ok) {
        toast.success(t("success"));
        resetForm();
      } else {
        locale
        toast.error("Failed to send message.");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.log(error);
      resetForm();
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        resetForm();
      }, 1500);
    }
  };
  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      }}
      validationSchema={ContactFormSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="space-y-6 md:p-5 sm:p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg text-[#33334E]">
                {t("name")}
              </Label>
              <Field
                as={Input}
                id="name"
                name="name"
                placeholder={t("namePlaceholder")}
                className={`sm:h-[68px] h-[55px] text-[#686781] !text-lg placeholder:text-[#686781] placeholder:text-base rounded-full ${touched.name && errors.name
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-[#E4E4ED] focus:border-primary-blue focus:ring-blue-500"
                  }`}
              />
              <ErrorMessage
                name="name"
                component="p"
                className="text-sm text-red-600"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg text-[#33334E]">
                {t("email")}
              </Label>
              <Field
                as={Input}
                id="email"
                name="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                className={`sm:h-[68px] h-[55px] text-[#686781] !text-lg placeholder:text-[#686781] placeholder:text-base rounded-full ${touched.email && errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-[#E4E4ED] focus:border-primary-blue focus:ring-blue-500"
                  }`}
              />
              <ErrorMessage
                name="email"
                component="p"
                className="text-sm text-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-lg text-[#33334E]">
                {t("phone")}
              </Label>
              <Field
                as={Input}
                id="phone"
                name="phone"
                placeholder={t("phonePlaceholder")}
                className={`sm:h-[68px] h-[55px] text-[#686781] !text-lg placeholder:text-[#686781] placeholder:text-base rounded-full ${touched.phone && errors.phone
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-[#E4E4ED] focus:border-primary-blue focus:ring-blue-500"
                  }`}
              />
              <ErrorMessage
                name="phone"
                component="p"
                className="text-sm text-red-600"
              />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-lg text-[#33334E]">
                {t("subject")}
              </Label>
              <Field
                as={Input}
                id="subject"
                name="subject"
                placeholder={t("subjectPlaceholder")}
                className={`sm:h-[68px] h-[55px] text-[#686781] !text-lg placeholder:text-[#686781] placeholder:text-base rounded-full ${touched.subject && errors.subject
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-[#E4E4ED] focus:border-primary-blue focus:ring-blue-500"
                  }`}
              />
              <ErrorMessage
                name="subject"
                component="p"
                className="text-sm text-red-600"
              />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-lg text-[#33334E]">
              {t("message")}
            </Label>
            <Field
              as={Textarea}
              id="message"
              name="message"
              rows={6}
              placeholder={t("messagePlaceholder")}
              className={`resize-none pt-4 rounded-2xl !text-lg placeholder:text-lg min-h-[126px] ${touched.message && errors.message
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-[#E4E4ED] focus:border-primary-blue focus:ring-blue-500"
                }`}
            />
            <ErrorMessage
              name="message"
              component="p"
              className="text-sm text-red-600"
            />
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full xl:h-16 h-14 cursor-pointer text-lg bg-primary-blue hover:bg-white hover:text-primary-blue border border-primary-blue text-white font-semibold rounded-full disabled:bg-primary-blue disabled:cursor-not-allowed"
          >
            {isSubmitting ? t("sending") : t("submit")}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ContactForm;
