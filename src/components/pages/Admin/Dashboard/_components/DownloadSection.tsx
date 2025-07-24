"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

const DownloadSection = () => {
  const t = useTranslations("dashboard");

  const handleDownload = (format: string) => {
    console.log(`Downloading data in ${format} format`);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">{t("sections.downloads")}</h2>
      <Card>
        <CardHeader>
          <CardTitle>{t("downloads.title")}</CardTitle>
          <CardDescription>{t("downloads.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="border rounded-lg p-4 flex flex-col items-center justify-center space-y-2">
              <h3 className="text-lg font-medium">{t("downloads.userData")}</h3>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => handleDownload("csv")}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownload("excel")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button variant="outline" onClick={() => handleDownload("pdf")}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4 flex flex-col items-center justify-center space-y-2">
              <h3 className="text-lg font-medium">
                {t("downloads.subscriptionData")}
              </h3>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => handleDownload("csv")}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownload("excel")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button variant="outline" onClick={() => handleDownload("pdf")}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4 flex flex-col items-center justify-center space-y-2">
              <h3 className="text-lg font-medium">
                {t("downloads.activityData")}
              </h3>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => handleDownload("csv")}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownload("excel")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button variant="outline" onClick={() => handleDownload("pdf")}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default DownloadSection;
