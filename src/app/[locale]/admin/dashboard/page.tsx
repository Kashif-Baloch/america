import Hero from "@/components/pages/Admin/Dashboard/Hero";
import { redirect } from "next/navigation";
import React from "react";

const Dashboard = () => {
  redirect("/admin/jobs");
  return <Hero />;
};

export default Dashboard;
