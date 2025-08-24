"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FavoritesSection } from "@/components/pages/settings/_components/FavoritesSection";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FavoritesPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const t = useTranslations("favorites");

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login?callbackUrl=/favorites");
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
        <FavoritesSection />
      </div>
    </div>
  );
}
