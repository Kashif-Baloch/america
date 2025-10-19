"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SignInOauthButton from "@/components/ui/sign-in-oauth-button";
import { Link, useRouter } from "@/i18n/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { computeSHA256 } from "@/lib/utils";
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import { Eye, EyeOff, Loader2, Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import { v4 as uuid } from "uuid";
import { getSignedPDFUrl } from "@/lib/s3";
import kyInstance from "@/lib/ky";

interface PaymentParams {
  name: string;
  price: string;
  email: string;
  description: string;
}

interface SignUpFormProps {
  paymentParams?: PaymentParams;
}

interface SignUpFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  acceptTerms: boolean;
  resume: File | null;
}

export default function SignUpForm({ paymentParams }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("signup");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  // Yup Validation Schema WITH required resume, file type, and max size checks
  const validationSchema = Yup.object({
    firstName: Yup.string().required(t("first_name.error")),
    lastName: Yup.string(), // optional
    email: Yup.string().email(t("email.error")).required(t("email.error")),
    password: Yup.string()
      .min(8, t("password.error"))
      .required(t("password.error")),
    phoneNumber: Yup.string()
      .matches(/^[+]?[\d\s-()]+$/, t("phone.error"))
      .notRequired(),
    acceptTerms: Yup.boolean()
      .oneOf([true], t("terms.error"))
      .required(t("terms.error")),
    resume: Yup.mixed<File>()
      .nullable()
      .notRequired()
      .test("fileSize", t("resume.error.file_size"), (value) => {
        if (!value) return true; // allow empty
        const file = value as File;
        return file.size <= 5 * 1024 * 1024;
      })
      .test("fileFormat", t("resume.error.file_format"), (value) => {
        if (!value) return true; // allow empty
        const file = value as File;
        const allowed = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        return allowed.includes(file.type);
      }),
  });

  const initialValues: SignUpFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    acceptTerms: false,
    resume: null,
  };

  // Handle file selection
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    const file = event.target.files?.[0] || null;
    setFieldValue("resume", file);
  };

  // Handle file removal
  const handleRemoveFile = (
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    setFieldValue("resume", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form submission
  const handleSubmit = async (values: SignUpFormValues) => {
    const file = values.resume;

    try {
      startTransition(() => {
        (async () => {
          let publicResumeUrl: string | undefined;

          // Only process upload if a file is provided
          if (file) {
            const allowedTypes = [
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ];
            if (!allowedTypes.includes(file.type)) {
              toast.error(t("resume.error.file_format"));
              return;
            }

            const checksum = await computeSHA256(file);
            const fileName = `${uuid()}-${uuid()}`;
            const signedURLResult = await getSignedPDFUrl(
              file.type,
              file.size,
              checksum,
              fileName
            );

            if (!signedURLResult.success || !signedURLResult.data?.url) {
              toast.error(
                signedURLResult.error || "Failed to get signed URL for resume."
              );
              return;
            }

            const signedUrl = signedURLResult.data.url;
            publicResumeUrl = signedUrl.split("?")[0];

            // Upload the PDF file to S3
            await kyInstance.put(signedUrl, {
              body: file,
              headers: {
                "Content-Type": file.type,
              },
              timeout: 120_000,
            });
          }

          // Proceed with signup (resumeLink only if available)
          await signUp.email(
            {
              email: values.email,
              password: values.password,
              name: `${values.firstName} ${values.lastName || ""}`.trim(),
              phone: values.phoneNumber,
              ...(publicResumeUrl ? { resumeLink: publicResumeUrl } : {}),
            } as any,
            {
              onError: (ctx) => {
                if (ctx?.error?.code) {
                  const errCode = String(ctx.error.code ?? "UNKNOWN");
                  if (errCode === "USER_ALREADY_EXISTS") {
                    toast.error("Oops! Looks like email is already in use.");
                  } else {
                    toast.error(ctx.error.message);
                  }
                } else {
                  toast.error(ctx.error.message);
                }
              },
              onSuccess: async () => {
                toast.success(
                  "Registration complete. We've sent you a verification link. Please check your email."
                );

                // Get callbackUrl from URL params
                const searchParams = new URLSearchParams(
                  window.location.search
                );
                const callbackUrl = searchParams.get("callbackUrl");

                // Try to create a session so the user is logged in through checkout and on return
                try {
                  await signIn.email(
                    {
                      email: values.email,
                      password: values.password,
                    } as any,
                    {
                      onError: (ctx) => {
                        // proceed anyway; we'll still send email in params to checkout
                        console.error("Auto sign-in failed:", ctx?.error?.message);
                      },
                    }
                  );
                } catch (e) {
                  console.error("Auto sign-in exception:", e);
                }

                // Redirect to payment if payment params exist
                if (paymentParams) {
                  const { name, price, description } = paymentParams;
                  const params = new URLSearchParams({
                    name,
                    price,
                    description,
                    email: values.email,
                  });
                  window.location.href = `/api/payments/checkout?${params.toString()}`;
                } else {
                  // Redirect based on callbackUrl
                  if (callbackUrl === "pricing") {
                    router.replace("/pricing");
                  } else {
                    router.replace("/");
                  }
                }
              },
            }
          );
        })().catch((error) => {
          console.error(error);
          toast.error("Something went wrong during resume upload.");
        });
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong during resume upload.");
    }
  };
  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Form className="space-y-6">
          {/* First Name Field */}
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-gray-700 font-medium">
              {t("first_name.label")}
            </Label>
            <Field name="firstName">
              {({ field }: FieldProps) => (
                <Input
                  {...field}
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className={`h-12 border-0 border-b-2 rounded-none bg-transparent focus:border-blue-600 ${
                    errors.firstName && touched.firstName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              )}
            </Field>
            <ErrorMessage
              name="firstName"
              render={() =>
                errors.firstName && touched.firstName ? (
                  <div className="text-red-500">{t("first_name.error")}</div>
                ) : null
              }
            />
          </div>

          {/* Last Name Field (optional) */}
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-gray-700 font-medium">
              {t("last_name.label")}
            </Label>
            <Field name="lastName">
              {({ field }: FieldProps) => (
                <Input
                  {...field}
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  className={`h-12 border-0 border-b-2 rounded-none bg-transparent focus:border-blue-600 ${
                    errors.lastName && touched.lastName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              )}
            </Field>
          </div>

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
                  className={`h-12 border-0 border-b-2 rounded-none bg-transparent focus:border-blue-600 ${
                    errors.email && touched.email
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

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              {t("password.label")}
            </Label>
            <div className="relative">
              <Field name="password">
                {({ field }: FieldProps) => (
                  <Input
                    {...field}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••••"
                    className={`h-12 border-0 border-b-2 rounded-none bg-transparent focus:border-blue-600 outline-none pr-10 ${
                      errors.password && touched.password
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                )}
              </Field>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <ErrorMessage
              name="password"
              render={() =>
                errors.password && touched.password ? (
                  <div className="text-red-500">{t("password.error")}</div>
                ) : null
              }
            />
          </div>

          {/* Phone Number Field (optional) */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-gray-700 font-medium">
              {t("phone.label")}
            </Label>
            <Field name="phoneNumber">
              {({ field }: FieldProps) => (
                <Input
                  {...field}
                  id="phoneNumber"
                  type="tel"
                  placeholder="+91 123 456 789"
                  className={`h-12 border-0 border-b-2 rounded-none bg-transparent focus:border-blue-600 ${
                    errors.phoneNumber && touched.phoneNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              )}
            </Field>
            <ErrorMessage
              name="phoneNumber"
              render={() =>
                errors.phoneNumber && touched.phoneNumber ? (
                  <div className="text-red-500">{t("phone.error")}</div>
                ) : null
              }
            />
          </div>

          {/* Resume Upload Field (optional) */}
          <div className="space-y-2">
            <Label htmlFor="resume" className="text-gray-700 font-medium">
              {t("resume.label")}
            </Label>
            <input
              type="file"
              id="resume"
              name="resume"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileChange(e, setFieldValue)}
              className="hidden"
            />

            {!values.resume ? (
              <Button
                type="button"
                variant="outline"
                className="w-full h-14 border-2 border-dashed border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                <span>{t("resume.upload")}</span>
              </Button>
            ) : (
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700 truncate max-w-[200px]">
                    {values.resume.name}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-gray-200"
                  onClick={() => handleRemoveFile(setFieldValue)}
                  aria-label="Remove uploaded file"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            )}
            <p className="text-gray-500 mt-1">{t("resume.supported")}</p>

            {/* Error message for resume */}
            <ErrorMessage
              name="resume"
              render={(msg) =>
                errors.resume && touched.resume ? (
                  <div className="text-red-500">{msg}</div>
                ) : null
              }
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={values.acceptTerms}
              onCheckedChange={(checked) =>
                setFieldValue("acceptTerms", checked === true)
              }
              className="data-[state=checked]:bg-ghost-blue cursor-pointer data-[state=checked]:border-[#153CF517] data-[state=checked]:text-primary-blue size-6 text-2xl"
            />
            <Label htmlFor="acceptTerms" className="text-gray-600">
              {t("terms.label")}
            </Label>
          </div>
          <ErrorMessage
            name="acceptTerms"
            render={() =>
              errors.acceptTerms && touched.acceptTerms ? (
                <div className="text-red-500">{t("terms.error")}</div>
              ) : null
            }
          />

          {/* Sign Up Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 cursor-pointer text-lg bg-primary-blue text-white font-semibold rounded-full hover:bg-white hover:text-primary-blue border border-primary-blue"
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>{t("button.signup")}</>
            )}
          </Button>

          {/* Forgot Password */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-primary-blue hover:text-blue-700 cursor-pointer underline"
            >
              {t("button.forgotPassword")}
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-black font-medium">
                {t("divider.or")}
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <SignInOauthButton
            text={t("button.google")}
            paymentParams={paymentParams}
          />

          {/* Sign In Link */}
          <div className="text-center">
            <span className="text-gray-600">
              {t("login.prompt")}{" "}
              <Link
                href={"/login"}
                className="text-gray-900 font-semibold pb-[1px] cursor-pointer border-b border-b-black hover:text-blue-600"
              >
                {t("login.button")}
              </Link>
            </span>
          </div>
        </Form>
      )}
    </Formik>
  );
}
