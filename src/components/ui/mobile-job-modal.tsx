"use client";

import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { JobWithTranslations } from "@/lib/types";
import { Plan } from "@/lib/types";
import { JobDetails } from "@/components/pages/home/DetailsSubs";

export function MobileJobModal({
  job,
  isOpen,
  onClose,
  plan,
}: {
  job: JobWithTranslations | null;
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
}) {
  const t = useTranslations();

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[90vw] max-w-[95vw]">
        <div className="absolute right-4 top-4">
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 transition-colors"
            aria-label={t("common.close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="pt-6">
          <JobDetails t={t} job={job} plan={plan} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
