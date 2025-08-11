"use client";
import Hero from "@/components/pages/Admin/jobdetails/Hero";
import { JobWithTranslations } from "@/lib/types";

const DetailsPage = ({ job }: { job: JobWithTranslations }) => {
    return <Hero job={job} />;
};

export default DetailsPage;
