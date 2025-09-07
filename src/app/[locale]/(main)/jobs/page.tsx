"use client";

import DetailsSub from "@/components/pages/home/DetailsSubs";
import { useSession } from "@/lib/auth-client";
import React from "react";
import { redirect } from "next/navigation";

const Page = () => {
  const { data: session } = useSession();
  if (!session) {
    redirect(`/login?callbackUrl=/jobs`);
  }
  return (
    <div>
      <DetailsSub />
    </div>
  );
};

export default Page;
