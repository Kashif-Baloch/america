"use client";

import DetailsSub from "@/components/pages/home/DetailsSubs";
import { useSession } from "@/lib/auth-client";
import React from "react";
import { redirect } from "next/navigation";

import Hero from "@/components/pages/home/Hero";

const Page = () => {
  const { data: session } = useSession();
  if (!session) {
    redirect(`/login?callbackUrl=/jobs`);
  }
  return (
    <div>
      <Hero />
      <DetailsSub />
    </div>
  );
};

export default Page;
