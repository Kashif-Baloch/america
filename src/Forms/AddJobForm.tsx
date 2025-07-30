"use client";

import CustomDropdown from "@/components/common/CustomDropdown";
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import * as Yup from "yup";

interface JobData {
  title: string;
  company: string;
  salary: string;
  location: string;
  rating: string;
  hiresOutside: string;
  requirements: string;
  jobType: string;
  season: string;
  transportationHousing: string;
  phoneNumber: string;
  overtime: string;
  legalProcess: string;
  processDuration: string;
  approvalRate: string;
  employeesHired: string;
  processSpeed: string;
  approvalEfficiency: string;
  visaEmployees: string;
  certifications: string;
}

const initialValues: JobData = {
  title: "",
  company: "",
  salary: "",
  location: "",
  rating: "",
  hiresOutside: "",
  requirements: "",
  jobType: "",
  season: "",
  transportationHousing: "",
  phoneNumber: "",
  overtime: "",
  legalProcess: "",
  processDuration: "",
  approvalRate: "",
  employeesHired: "",
  processSpeed: "",
  approvalEfficiency: "",
  visaEmployees: "",
  certifications: "",
};

const validationSchema = Yup.object({
  title: Yup.string().required().min(2),
  company: Yup.string().required().min(2),
  salary: Yup.string().required(),
  location: Yup.string().required(),
  rating: Yup.string().required(),
  hiresOutside: Yup.string().required(),
  requirements: Yup.string().required().min(10),
  jobType: Yup.string().required(),
  season: Yup.string().required(),
  transportationHousing: Yup.string().required(),
  phoneNumber: Yup.string().required(),
  overtime: Yup.string().required(),
  legalProcess: Yup.string().required(),
  processDuration: Yup.string().required(),
  approvalRate: Yup.string().required(),
  employeesHired: Yup.string().required(),
  processSpeed: Yup.string().required(),
  approvalEfficiency: Yup.string().required(),
  visaEmployees: Yup.string().required(),
  certifications: Yup.string().required(),
});

function FormField({
  label,
  name,
  children,
  error,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
  error?: string | null;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-lg font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && <p className="text-lg text-red-500">{error}</p>}
    </div>
  );
}

export default function AddJobForm() {
  const t = useTranslations("addjob");

  const handleSubmit = (
    values: JobData,
    { setSubmitting, resetForm }: FormikHelpers<JobData>
  ) => {
    setTimeout(() => {
      toast.success("Job posted successfully!");
      resetForm();
      setSubmitting(false);
    }, 1000);
  };

  // Helper for rating options
  const ratingOptions = Array.from({ length: 5 }, (_, i) => ({
    value: String(i + 1),
    label: t(i === 0 ? "star" : "stars", { count: i + 1 }),
  }));

  return (
    <div className="bg-white py-12 font-sf px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t("addJob")}</h1>
        <p className="text-lg text-gray-600">{t("fillForm")}</p>
      </div>
      <div className="max-w-6xl mx-auto">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("basicInfo")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label={t("jobTitle")}
                    name="title"
                    error={
                      errors.title && touched.title
                        ? t("jobTitle") + " required"
                        : null
                    }
                  >
                    <Field
                      id="title"
                      name="title"
                      placeholder={t("jobTitle")}
                      className="block w-full border rounded px-4 py-3 text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                    />

                  </FormField>
                  <FormField
                    label={t("companyName")}
                    name="company"
                    error={
                      errors.company && touched.company
                        ? t("companyName") + " required"
                        : null
                    }
                  >
                    <Field
                      id="company"
                      name="company"
                      placeholder={t("companyName")}
                      className="block w-full border rounded px-4 py-3 text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                    />
                  </FormField>
                  <FormField
                    label={t("salary")}
                    name="salary"
                    error={
                      errors.salary && touched.salary
                        ? t("salary") + " required"
                        : null
                    }
                  >
                    <Field
                      id="salary"
                      name="salary"
                      placeholder={t("salary")}
                      className="block w-full border rounded px-4 py-3 text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                    />
                  </FormField>
                  <FormField
                    label={t("location")}
                    name="location"
                    error={
                      errors.location && touched.location
                        ? t("location") + " required"
                        : null
                    }
                  >
                    <Field
                      id="location"
                      name="location"
                      placeholder={t("location")}
                      className="block w-full border rounded px-4 py-3 text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                    />
                  </FormField>
                  <FormField
                    label={t("companyRating")}
                    name="rating"
                    error={
                      errors.rating && touched.rating
                        ? t("companyRating") + " required"
                        : null
                    }
                  >
                    <Field name="rating">
                      {({ field, form }: FieldProps<string>) => (
                        <CustomDropdown
                          options={ratingOptions}
                          value={field.value}
                          onChange={(val: string) =>
                            form.setFieldValue(field.name, val)
                          }
                          placeholder={t("companyRating")}
                        />
                      )}
                    </Field>
                  </FormField>
                  <FormField
                    label={t("phoneNumber")}
                    name="phoneNumber"
                    error={
                      errors.phoneNumber && touched.phoneNumber
                        ? t("phoneNumber") + " required"
                        : null
                    }
                  >
                    <Field
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder={t("phoneNumber")}
                      className="block w-full border rounded px-4 py-3 text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                    />
                  </FormField>
                </div>
              </div>

              {/* Job Specifications */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("jobSpecifications")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label={t("jobType")}
                    name="jobType"
                    error={
                      errors.jobType && touched.jobType
                        ? t("jobType") + " required"
                        : null
                    }
                  >
                    <Field name="jobType">
                      {({ field, form }: FieldProps<string>) => (
                        <CustomDropdown
                          options={[
                            { value: "full-time", label: t("fullTime") },
                            { value: "part-time", label: t("partTime") },
                            { value: "contract", label: t("contract") },
                            { value: "temporary", label: t("temporary") },
                            { value: "internship", label: t("internship") },
                          ]}
                          value={field.value}
                          onChange={(val: string) =>
                            form.setFieldValue(field.name, val)
                          }
                          placeholder={t("selectPlaceholder")}
                        />
                      )}
                    </Field>
                  </FormField>
                  <FormField
                    label={t("season")}
                    name="season"
                    error={
                      errors.season && touched.season
                        ? t("season") + " required"
                        : null
                    }
                  >
                    <Field name="season">
                      {({ field, form }: FieldProps<string>) => (
                        <CustomDropdown
                          options={[
                            { value: "spring", label: t("spring") },
                            { value: "summer", label: t("summer") },
                            { value: "fall", label: t("fall") },
                            { value: "winter", label: t("winter") },
                            { value: "year-round", label: t("yearRound") },
                          ]}
                          value={field.value}
                          onChange={(val: string) =>
                            form.setFieldValue(field.name, val)
                          }
                          placeholder={t("selectPlaceholder")}
                        />
                      )}
                    </Field>
                  </FormField>
                  <FormField
                    label={t("hiresOutside")}
                    name="hiresOutside"
                    error={
                      errors.hiresOutside && touched.hiresOutside
                        ? t("hiresOutside") + " required"
                        : null
                    }
                  >
                    <Field name="hiresOutside">
                      {({ field, form }: FieldProps<string>) => (
                        <CustomDropdown
                          options={[
                            { value: "yes", label: t("yes") },
                            { value: "no", label: t("no") },
                            { value: "sometimes", label: t("sometimes") },
                          ]}
                          value={field.value}
                          onChange={(val: string) =>
                            form.setFieldValue(field.name, val)
                          }
                          placeholder={t("selectPlaceholder")}
                        />
                      )}
                    </Field>
                  </FormField>
                  <FormField
                    label={t("transportationHousing")}
                    name="transportationHousing"
                    error={
                      errors.transportationHousing &&
                        touched.transportationHousing
                        ? t("transportationHousing") + " required"
                        : null
                    }
                  >
                    <Field name="transportationHousing">
                      {({ field, form }: FieldProps<string>) => (
                        <CustomDropdown
                          options={[
                            { value: "provided", label: t("provided") },
                            { value: "not-provided", label: t("notProvided") },
                            { value: "partial", label: t("partial") },
                            {
                              value: "transportation-only",
                              label: t("transportationOnly"),
                            },
                            { value: "housing-only", label: t("housingOnly") },
                          ]}
                          value={field.value}
                          onChange={(val: string) =>
                            form.setFieldValue(field.name, val)
                          }
                          placeholder={t("selectPlaceholder")}
                        />
                      )}
                    </Field>
                  </FormField>
                  <FormField
                    label={t("overtimeAvailable")}
                    name="overtime"
                    error={
                      errors.overtime && touched.overtime
                        ? t("overtimeAvailable") + " required"
                        : null
                    }
                  >
                    <Field name="overtime">
                      {({ field, form }: FieldProps<string>) => (
                        <CustomDropdown
                          options={[
                            { value: "available", label: t("available") },
                            {
                              value: "not-available",
                              label: t("notAvailable"),
                            },
                            { value: "limited", label: t("limited") },
                          ]}
                          value={field.value}
                          onChange={(val: string) =>
                            form.setFieldValue(field.name, val)
                          }
                          placeholder={t("selectPlaceholder")}
                        />
                      )}
                    </Field>
                  </FormField>
                  <FormField
                    label={t("visaEmployees")}
                    name="visaEmployees"
                    error={
                      errors.visaEmployees && touched.visaEmployees
                        ? t("visaEmployees") + " required"
                        : null
                    }
                  >
                    <Field
                      id="visaEmployees"
                      name="visaEmployees"
                      placeholder={t("visaEmployees")}
                      className="block w-full border rounded px-4 py-3 text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                    />
                  </FormField>
                </div>
              </div>

              {/* Process Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("processInfo")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label={t("processDuration")}
                    name="processDuration"
                    error={
                      errors.processDuration && touched.processDuration
                        ? t("processDuration") + " required"
                        : null
                    }
                  >
                    <Field
                      id="processDuration"
                      name="processDuration"
                      placeholder={t("processDuration")}
                      className="block w-full border rounded px-4 py-3 text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                    />
                  </FormField>
                  <FormField
                    label={t("approvalRate")}
                    name="approvalRate"
                    error={
                      errors.approvalRate && touched.approvalRate
                        ? t("approvalRate") + " required"
                        : null
                    }
                  >
                    <Field
                      id="approvalRate"
                      name="approvalRate"
                      placeholder={t("approvalRate")}
                      className="block w-full border rounded px-4 py-3 text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                    />
                  </FormField>
                  <FormField
                    label={t("employeesHired")}
                    name="employeesHired"
                    error={
                      errors.employeesHired && touched.employeesHired
                        ? t("employeesHired") + " required"
                        : null
                    }
                  >
                    <Field
                      id="employeesHired"
                      name="employeesHired"
                      placeholder={t("employeesHired")}
                      className="block w-full border rounded px-4 py-3 text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                    />
                  </FormField>
                  <FormField
                    label={t("processSpeed")}
                    name="processSpeed"
                    error={
                      errors.processSpeed && touched.processSpeed
                        ? t("processSpeed") + " required"
                        : null
                    }
                  >
                    <Field name="processSpeed">
                      {({ field, form }: FieldProps<string>) => (
                        <CustomDropdown
                          options={[
                            { value: "fast", label: t("fast") },
                            { value: "medium", label: t("medium") },
                            { value: "slow", label: t("slow") },
                          ]}
                          value={field.value}
                          onChange={(val: string) =>
                            form.setFieldValue(field.name, val)
                          }
                          placeholder={t("selectPlaceholder")}
                        />
                      )}
                    </Field>
                  </FormField>
                  <FormField
                    label={t("approvalEfficiency")}
                    name="approvalEfficiency"
                    error={
                      errors.approvalEfficiency && touched.approvalEfficiency
                        ? t("approvalEfficiency") + " required"
                        : null
                    }
                  >
                    <Field name="approvalEfficiency">
                      {({ field, form }: FieldProps<string>) => (
                        <CustomDropdown
                          options={[
                            { value: "high", label: t("high") },
                            { value: "medium", label: t("medium") },
                            { value: "low", label: t("low") },
                          ]}
                          value={field.value}
                          onChange={(val: string) =>
                            form.setFieldValue(field.name, val)
                          }
                          placeholder={t("selectPlaceholder")}
                        />
                      )}
                    </Field>
                  </FormField>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("detailedInfo")}
                </h3>
                <div className="space-y-6">
                  <FormField
                    label={t("jobRequirements")}
                    name="requirements"
                    error={
                      errors.requirements && touched.requirements
                        ? t("jobRequirements") + " required"
                        : null
                    }
                  >
                    <Field
                      as="textarea"
                      id="requirements"
                      name="requirements"
                      placeholder={t("jobRequirements")}
                      className="min-h-[100px] border rounded px-4 py-2 w-full focus:ring focus:ring-blue-200 focus:border-blue-400 transition text-lg placeholder:text-lg"
                    />
                  </FormField>
                  <FormField
                    label={t("legalProcess")}
                    name="legalProcess"
                    error={
                      errors.legalProcess && touched.legalProcess
                        ? t("legalProcess") + " required"
                        : null
                    }
                  >
                    <Field
                      as="textarea"
                      id="legalProcess"
                      name="legalProcess"
                      placeholder={t("legalProcess")}
                      className="min-h-[100px] border rounded px-4 py-2 w-full focus:ring focus:ring-blue-200 focus:border-blue-400 transition text-lg placeholder:text-lg"
                    />
                  </FormField>
                  <FormField
                    label={t("certifications")}
                    name="certifications"
                    error={
                      errors.certifications && touched.certifications
                        ? t("certifications") + " required"
                        : null
                    }
                  >
                    <Field
                      as="textarea"
                      id="certifications"
                      name="certifications"
                      placeholder={t("certifications")}
                      className="min-h-[100px] border rounded px-4 py-2 w-full focus:ring focus:ring-blue-200 focus:border-blue-400 transition text-lg placeholder:text-lg"
                    />
                  </FormField>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-44 h-14 cursor-pointer text-lg bg-primary-blue  text-white font-semibold rounded-full hover:bg-white hover:text-primary-blue border border-primary-blue"
                >
                  {isSubmitting ? t("postingJob") : t("postJob")}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
