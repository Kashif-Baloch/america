"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgetPassword } from "@/lib/auth-client";
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

interface ForgotPasswordFormValues {
  email: string;
}

export default function ForgotPasswordForm() {
  const router = useRouter();
  const t = useTranslations("forgotpassword");
  const [isPending, setIsPending] = useState(false);

  // Yup Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string().email(t("email.error")).required(t("email.error")),
  });

  const initialValues: ForgotPasswordFormValues = {
    email: "",
  };

  // Handle form submission
  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    setIsPending(true)
    if (!values.email) return toast.error("Please enter your email.");

    await forgetPassword({
      email: values.email,
      redirectTo: "/password-reset",
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success(t("success_message"));
          router.push("/forgot-password/success");
        },
      },
    });

    setIsPending(false)

  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="space-y-6">
          {/* Header */}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              {t("email.label")}
            </Label>
            <Field name="email">
              {({ field }: FieldProps) => (
                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="johndoe@email.com"
                  className={`h-12 border-0 border-b-2 rounded-none bg-transparent focus:border-blue-600 ${errors.email && touched.email
                    ? "border-red-500"
                    : "border-gray-300"
                    }`}
                />
              )}
            </Field>
            <ErrorMessage
              name="email"
              render={() =>
                errors.email && touched.email ? (
                  <div className="text-red-500">{t("email.error")}</div>
                ) : null
              }
            />
          </div>

          {/* Reset Password Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 cursor-pointer text-lg bg-primary-blue text-white font-semibold rounded-full hover:bg-white hover:text-primary-blue border border-primary-blue"
          >
            {
              isPending ?
                <>
                  <Loader2 className="animate-spin" />
                </>
                :
                <>
                  {t("reset_button")}
                </>
            }
          </Button>

          {/* Back to Login */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="text-primary-blue hover:text-blue-700 cursor-pointer underline"
            >
              {t("back_to_login")}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
