"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@/i18n/navigation";
import { signIn } from "@/lib/auth-client";
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import * as Yup from "yup";

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  acceptTerms: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
});

interface LoginFormValues {
  email: string;
  password: string;
  acceptTerms: boolean;
}

export default function LoginForm() {
  const t = useTranslations("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter()
  const initialValues: LoginFormValues = {
    email: "",
    password: "",
    acceptTerms: false,
  };

  //Handle Form Submit
  const handleSubmit = (values: LoginFormValues) => {
    startTransition(async () => {
      await signIn.email(
        {
          email: values.email,
          password: values.password,
        },
        {
          onError: (ctx) => {
            console.log(ctx)
            if (ctx.error.message) {
              toast.error(ctx.error.message)
            } else if (ctx.error.statusText) {
              toast.error(ctx.error.statusText)
            } else {
              toast.error("Something went wrong please try again later")
            }
          },
          onSuccess: () => {
            toast.success("Login successful. Good to have you back.")
            router.replace(`/settings`)
          }
        }
      );
    });
  };

  //Handle Google Sign In
  const handleGoogleSignIn = () => {
    console.log("Google sign in clicked");
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Form className="space-y-6">
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
              component="div"
              render={() => (
                <div className="text-red-500 text-sm">{t("email.error")}</div>
              )}
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
                    className={`h-12 border-0 border-b-2 rounded-none bg-transparent focus:border-blue-600 ring-red-transparent outline-none pr-10 ${errors.password && touched.password
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
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <ErrorMessage
              name="password"
              component="div"
              render={() => (
                <div className="text-red-500 text-sm">
                  {t("password.error")}
                </div>
              )}
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={values.acceptTerms}
              onCheckedChange={(checked) =>
                setFieldValue("acceptTerms", checked)
              }
              className="data-[state=checked]:bg-ghost-blue cursor-pointer data-[state=checked]:border-[#153CF517] data-[state=checked]:text-primary-blue size-6 text-2xl"
            />
            <Label htmlFor="acceptTerms" className="text-sm text-gray-600">
              {t("terms.label")}
            </Label>
          </div>
          <ErrorMessage
            name="acceptTerms"
            component="div"
            render={() => (
              <div className="text-red-500 text-sm">{t("terms.error")}</div>
            )}
          />

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 cursor-pointer text-lg bg-primary-blue hover:bg-white hover:text-primary-blue border border-primary-blue text-white font-semibold rounded-full"
          >
            {
              isPending
                ?
                <Loader2 className="animate-spin" />
                :
                <>
                  {t("button.login")}
                </>
            }
          </Button>

          {/* Forgot Password */}
          <div className="text-center">
            <Link
              href={"/forgot-password"}
              className="text-primary-blue hover:text-blue-700 cursor-pointer text-sm underline"
            >
              {t("button.forgotPassword")}
            </Link>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-black font-medium">
                {t("divider.or")}
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            className="w-full h-12 border-gray-300 cursor-pointer hover:bg-gray-50 rounded-full bg-light-gray text-gray-700"
          >
            <FcGoogle className="size-7" />
            {t("button.google")}
          </Button>

          {/* Sign In Link */}
          <div className="text-center">
            <span className="text-gray-600 text-sm">
              {t("signup.prompt")}{" "}
              <Link
                href={"/sign-up"}
                className="text-gray-900 font-semibold pb-[1px] cursor-pointer border-b border-b-black  hover:text-blue-600"
              >
                {t("signup.button")}
              </Link>
            </span>
          </div>
        </Form>
      )}
    </Formik>
  );
}
