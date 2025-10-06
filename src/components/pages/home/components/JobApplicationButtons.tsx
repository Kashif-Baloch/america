import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import type { JobWithTranslations, Plan } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function JobApplicationButtons({
  t,
  plan,
  job,
}: {
  t: ReturnType<typeof useTranslations>;
  plan: Plan;
  job: JobWithTranslations;
}) {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const canUseWebsite =
    plan === "BASIC" || plan === "PRO" || plan === "PRO_PLUS";
  const canUseEmail = plan === "PRO" || plan === "PRO_PLUS";

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success(t("job.common.copied"));
  };

  const handleCopyAllEmails = () => {
    if (job.companyEmails?.length > 0) {
      const allEmails = job.companyEmails.join("\n");
      navigator.clipboard.writeText(allEmails);
      toast.success(t("job.common.allCopied"));
    }
  };

  return (
    <div className="flex gap-4 w-full justify-between flex-wrap">
      <div className="flex items-center sm:flex-row flex-col-reverse max-sm:w-full gap-2">
        <Button
          disabled={!canUseWebsite}
          onClick={() => window.open(job.websiteLink || "#", "_blank")}
          className={`bg-primary-blue max-sm:w-full px-5 md:h-14 h-12 rounded-xl xl:text-lg sm:font-bold font-normal tracking-wider text-white ${
            !canUseWebsite ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {t("job.apply.website")}
        </Button>
        <Badge
          variant="secondary"
          className={`lg:text-[17px] sm:block hidden text-sm px-3 rounded bg-ghost-green text-secondary-green`}
        >
          {t("job.detail.basic")}
        </Badge>
      </div>
      <div className="flex items-center sm:flex-row flex-col-reverse max-sm:w-full gap-2">
        <Button
          onClick={() => setIsEmailDialogOpen(true)}
          disabled={!canUseEmail}
          className={`md:h-14 max-sm:w-full h-12 px-5 rounded-xl xl:text-lg sm:font-bold font-normal tracking-wider text-white bg-gradient-to-r duration-300 from-[#CB9442] to-[#FEDC6E] ${
            !canUseEmail
              ? "opacity-60 cursor-not-allowed"
              : "hover:from-black hover:to-black cursor-pointer"
          }`}
        >
          {t("job.apply.email")}
        </Button>
        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold">
                {t("job.common.availableEmails")}
              </DialogTitle>
              {job.companyEmails?.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAllEmails}
                  disabled={!canUseEmail}
                  className="mt-2 mx-auto flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {t("job.common.copyAll")}
                </Button>
              )}
            </DialogHeader>
            <div className="space-y-3 py-4">
              {job.companyEmails?.length > 0 ? (
                job.companyEmails.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <span className="text-sm sm:text-base break-all">
                        {email}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCopyEmail(email)}
                      disabled={!canUseEmail}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">{t("common.copy")}</span>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  {t("job.common.noEmails")}
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
        <Badge
          variant="secondary"
          className={`lg:text-[17px] sm:block hidden text-sm px-3 rounded bg-ghost-golden text-golden`}
        >
          {t("job.detail.pro")}
        </Badge>
      </div>
    </div>
  );
}
