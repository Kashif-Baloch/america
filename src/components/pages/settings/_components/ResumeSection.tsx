"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface Resume {
  id: string;
  filename: string;
  file_size: number;
  uploaded_at: string;
}

export function ResumeSection() {
  const t = useTranslations("ResumeSection");
  const [resume, setResume] = useState<Resume | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    // Mock upload process
    setTimeout(() => {
      setResume({
        id: Date.now().toString(),
        filename: file.name,
        file_size: file.size,
        uploaded_at: new Date().toISOString(),
      });
      setIsUploading(false);
      toast.success(t("success.upload"));
      // Reset the input
      event.target.value = "";
    }, 2000);
  };

  const handleDelete = () => {
    if (confirm(t("confirmDelete"))) {
      setResume(null);
      toast.success(t("success.delete"));
    }
  };

  const handleView = () => {
    toast.success(t("success.view"));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = bytes / Math.pow(k, i);
    return `${i === 0 ? value : value.toFixed(2)} ${sizes[i]}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(t("locale"), {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
          <div className="space-y-4">
            <div className="flex items-center flex-wrap gap-y-5 justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium text-lg">{resume.filename}</p>
                  <p className="text-lg text-muted-foreground">
                    {formatFileSize(resume.file_size)} • {t("uploadedOn")}{" "}
                    {formatDate(resume.uploaded_at)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="cursor-pointer text-base"
                  size="lg"
                  onClick={handleView}
                >
                  <Eye className="size-6 mr-2" />
                  {t("actions.view")}
                </Button>
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
          </div>
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
