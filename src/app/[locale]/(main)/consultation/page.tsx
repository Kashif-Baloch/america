import { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { ConsultationScheduler } from "@/components/consultation/ConsultationScheduler";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Schedule Consultation | America Working",
  description: "Schedule a consultation with our career experts",
};

export default async function ConsultationPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.email || !session.user.id) {
    redirect("/login?callbackUrl=/consultation");
  }

  const subscription = await db.subscription.findUnique({
    where: {
      userId: session.user.id,
      status: "active",
      plan: "PRO_PLUS",
      endsAt: {
        gt: new Date(),
      },
    },
  });

  if (!subscription) {
    redirect("/pricing?upgrade=pro-plus");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <ConsultationScheduler />
      </div>
    </div>
  );
}
