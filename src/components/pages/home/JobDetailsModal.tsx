"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { JobWithTranslations } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "@/hooks/use-media-query";
import { JobDetails } from "./DetailsSubs";
import { useEffect, useState } from "react";

export function JobDetailsModal({
  job,
  isOpen,
  onOpenChange,
  plan,
}: {
  job: JobWithTranslations | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  plan: any;
}) {
  const t = useTranslations("home");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isMobile) return null;
  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[90vw] max-w-[95vw] p-0">
        <div className="p-6">
          <JobDetails t={t} job={job} plan={plan} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
