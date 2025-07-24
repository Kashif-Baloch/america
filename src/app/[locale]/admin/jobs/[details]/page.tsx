"use client";
import Hero from "@/components/pages/Admin/jobdetails/Hero";
import { JobData } from "@/components/pages/home/Details";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React from "react";

const DetailsPage = () => {
  const params = useParams();
  const jobId = Number(params.details);
  const t = useTranslations("home");

  const AllJobsData: JobData[] = [
    {
      id: 1,
      title: t("job.detail.adminTitle"),
      company: t("job.detail.basic"),
      salary: "$25 - $30",
      location: "Pro",
      rating: "4.9",
      hiresOutside: "Pro",
      requirements: t("job.requirements.adminReq"),
      jobType: "Pro",
      season: "Pro",
      transportationHousing: "Pro",
      phoneNumber: "Pro",
      overtime: "Pro",
      legalProcess: "Pro",
      processDuration: "Pro",
      approvalRate: "Pro",
      employeesHired: "Pro",
      processSpeed: "Pro+",
      approvalEfficiency: "Pro+",
      visaEmployees: "Pro+",
      certifications: "Pro+",
    },
    {
      id: 2,
      title: t("job.detail.marketingTitle"),
      company: t("job.detail.basic"),
      salary: "$30 - $35",
      location: "Pro",
      rating: "4.7",
      hiresOutside: "Pro",
      requirements: t("job.requirements.marketingReq"),
      jobType: "Pro",
      season: "Pro",
      transportationHousing: "Pro",
      phoneNumber: "Pro",
      overtime: "Pro",
      legalProcess: "Pro",
      processDuration: "Pro",
      approvalRate: "Pro",
      employeesHired: "Pro",
      processSpeed: "Pro+",
      approvalEfficiency: "Pro+",
      visaEmployees: "Pro+",
      certifications: "Pro+",
    },
  ];

  const job = AllJobsData.find((job) => job.id === jobId) || AllJobsData[0];
  return <Hero job={job} />;
};

export default DetailsPage;
