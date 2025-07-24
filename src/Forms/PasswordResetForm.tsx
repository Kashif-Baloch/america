"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

interface PasswordResetFormValues {
  newPassword: string;
  confirmPassword: string;
}

export default function PasswordResetForm() {
  const router = useRouter();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const t = useTranslations("passwordreset");

  // Yup Validation Schema
  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(8, t("password.error"))
      .required(t("password.error")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], t("confirm_password.error"))
      .required(t("confirm_password.required")),
  });

  const initialValues: PasswordResetFormValues = {
    newPassword: "",
    confirmPassword: "",
  };

  // Handle form submission
  const handleSubmit = (values: PasswordResetFormValues) => {
    toast.success(t("success_message"));
    console.log(values);
    // Place submission logic here
    // After successful reset, you might want to redirect to login
    setTimeout(() => {
      router.push("/login");
    }, 1500);
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
          {/* New Password Field */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-gray-700 font-medium">
              {t("password.label")}
            </Label>
            <div className="relative">
              <Field name="newPassword">
                {({ field }: FieldProps) => (
                  <Input
                    {...field}
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••••••••"
                    className={`h-12 border-0 border-b-2 rounded-none bg-transparent focus:border-blue-600 outline-none pr-10 ${
                      errors.newPassword && touched.newPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                )}
              </Field>
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <ErrorMessage
              name="newPassword"
              render={() =>
                errors.newPassword && touched.newPassword ? (
                  <div className="text-red-500">{t("password.error")}</div>
                ) : null
              }
            />
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-gray-700 font-medium"
            >
              {t("confirm_password.label")}
            </Label>
            <div className="relative">
              <Field name="confirmPassword">
                {({ field }: FieldProps) => (
                  <Input
                    {...field}
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••••••••"
                    className={`h-12 border-0 border-b-2 rounded-none bg-transparent focus:border-blue-600 outline-none pr-10 ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                )}
              </Field>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <ErrorMessage
              name="confirmPassword"
              render={(msg) =>
                errors.confirmPassword && touched.confirmPassword ? (
                  <div className="text-red-500">{msg}</div>
                ) : null
              }
            />
          </div>

          {/* Reset Password Button */}
          <Button
            type="submit"
            className="w-full h-12 cursor-pointer text-lg bg-primary-blue text-white font-semibold rounded-full hover:bg-white hover:text-primary-blue border border-primary-blue"
          >
            {t("reset_button")}
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
