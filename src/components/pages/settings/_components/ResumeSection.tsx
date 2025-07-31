"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, FileText, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { updateUser } from "@/lib/auth-client";
import { computeSHA256 } from "@/lib/utils";
import { v4 as uuid } from "uuid"
import { getSignedPDFUrl } from "@/lib/s3";
import kyInstance from "@/lib/ky";

interface Resume {
  id: string;
  filename: string;
  file_size: number;
  uploaded_at: string;
  url: string;
}

interface ResumeSectionProps {
  resumeLink: string | null;
  name: string;
  phone: string;
}

export function ResumeSection({ resumeLink, name, phone }: ResumeSectionProps) {
  const t = useTranslations("ResumeSection");
  const [resume, setResume] = useState<Resume | null>(
    resumeLink
      ? {
        id: "remote",
        filename: "resume.pdf",
        file_size: 0,
        uploaded_at: new Date().toISOString(),
        url: resumeLink,
      }
      : null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.info(t("errors.pdfOnly"));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("errors.fileSize"));
      return;
    }

    setIsUploading(true);

    try {
      const checksum = await computeSHA256(file);
      const fileName = `${uuid()}-${uuid()}`;

      const signedURLResult = await getSignedPDFUrl(
        file.type,
        file.size,
        checksum,
        fileName
      );

      if (!signedURLResult.success || !signedURLResult.data?.url) {
        throw new Error(signedURLResult.error || "Could not get signed URL");
      }

      const signedUrl = signedURLResult.data.url;
      const publicUrl = signedUrl.split("?")[0];

      await kyInstance.put(signedUrl, {
        body: file,
        headers: {
          "Content-Type": file.type,
        },
        timeout: 120_000,
      });

      // Set UI
      setResume({
        id: Date.now().toString(),
        filename: file.name,
        file_size: file.size,
        uploaded_at: new Date().toISOString(),
        url: publicUrl,
      });

      await fetch("/api/resume", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeLink: resumeLink }),
      });

      // Update DB
      await updateUser({
        resumeLink: publicUrl,
        name,
        phone,
        fetchOptions: {
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
          onSuccess: () => {
            toast.success(t("success.upload"));
          },
        },
      });



      event.target.value = "";
    } catch (err: any) {
      toast.error(err.message || "Resume upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!resume?.url) return;

    if (!confirm(t("confirmDelete"))) return;

    try {
      const res = await fetch("/api/resume", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeLink: resume.url }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete resume");
      }

      // Clear UI
      setResume(null);
      toast.success(t("success.delete"));

      // Update user record in DB
      await updateUser({
        resumeLink: undefined,
        name,
        phone,
        fetchOptions: {
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
          onSuccess: () => {
            toast.success(t("successMessage"));
            window.location.href = window.location.href;
          },
        },
      });
    } catch (error: any) {
      toast.error(error.message || "Something went wrong while deleting resume.");
    }
  };

  // const formatFileSize = (bytes: number) => {
  //   if (bytes === 0) return "0 Bytes";
  //   const k = 1024;
  //   const sizes = ["Bytes", "KB", "MB"];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   const value = bytes / Math.pow(k, i);
  //   return `${i === 0 ? value : value.toFixed(2)} ${sizes[i]}`;
  // };

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString(t("locale"), {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   });
  // };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          <h2 className="md:text-[40px] sm:text-[32px] text-[26px] font-bold leading-[1.2] mb-6">
            {t("title")}
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {resume ? (
          <>
            <div className="flex items-center flex-wrap gap-y-5 justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium text-lg">Resume.pdf</p>
                  <p className="text-lg text-muted-foreground">
                    {/* {resume.file_size > 0
                      ? `${formatFileSize(resume.file_size)} • `
                      : ""} */}
                    {/* {t("uploadedOn")} {formatDate(resume.uploaded_at)} */}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="cursor-pointer text-base"
                      size="lg"
                    >
                      <Eye className="size-6 mr-2" />
                      {t("actions.view")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl h-[90vh]">
                    <DialogHeader>
                      <DialogTitle>{t("title")}</DialogTitle>
                    </DialogHeader>
                    <iframe
                      src={resume.url}
                      className="w-full h-[80vh] rounded-md border"
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  className="cursor-pointer text-base"
                  size="lg"
                  onClick={handleDelete}
                >
                  <Trash2 className="size-6 mr-2" />
                  {t("actions.delete")}
                </Button>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg text-muted-foreground mb-2">
                {t("uploadNewPrompt")}
              </p>
              <label htmlFor="resume-replace" className="cursor-pointer">
                <Button
                  variant="outline"
                  className="text-lg h-14 cursor-pointer"
                  disabled={isUploading}
                  asChild
                >
                  <span>
                    <Upload className="size-6 mr-2" />
                    {isUploading ? t("uploading") : t("actions.replace")}
                  </span>
                </Button>
                <Input
                  id="resume-replace"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">{t("noResume.title")}</p>
              <p className="text-lg text-muted-foreground mb-4">
                {t("noResume.description")}
              </p>
              <label htmlFor="resume-upload" className="cursor-pointer">
                <Button disabled={isUploading} className="h-14 text-lg" asChild>
                  <span className="text-lg">
                    <Upload className="size-6 mr-2" />
                    {isUploading ? t("uploading") : t("actions.upload")}
                  </span>
                </Button>
                <Input
                  id="resume-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
