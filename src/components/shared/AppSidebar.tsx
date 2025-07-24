"use client";
import * as React from "react";
import {
  // Home,
  // Users,
  FileText,
  FilePlus2,
  X,
  StickyNote,
  Tag,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { GoCodeReview } from "react-icons/go";

function stripLocale(pathname: string) {
  // Add all your supported locales here
  return pathname.replace(/^\/(en|es|pt)(\/|$)/, "/");
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("dashboardnavigation");
  const navMain = [
    // { title: t("dashboard"), url: "/admin/dashboard", icon: Home },
    // { title: t("users"), url: "/admin/users", icon: Users },
    { title: t("jobs"), url: "/admin/jobs", icon: FileText },
    { title: t("addJob"), url: "/admin/addjob", icon: FilePlus2 },
    { title: t("editPricing"), url: "/admin/edit-pricing", icon: Tag },
    {
      title: t("editStickyModal"),
      url: "/admin/sticky-modals",
      icon: StickyNote,
    },
    // { title: t("editAbout"), url: "/admin/edit-about", icon: Info },
    {
      title: t("edit_testimonials"),
      url: "/admin/edit-testimonials",
      icon: GoCodeReview,
    },
  ];
  const pathname = usePathname();
  const currentPath = stripLocale(pathname);

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b px-6 py-4 relative">
        <SidebarTrigger className="absolute top-6 right-2  cursor-pointer lg:hidden">
          <X className="size-7" />
        </SidebarTrigger>
        <Link href={"/dashboard"}>
          <div className="flex items-center gap-3">
            <Image
              src={"/images/Logo.webp"}
              alt=""
              height={500}
              width={500}
              className="size-10 object-contain"
            />
            <h4 className="text-lg font-medium">America Working</h4>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navMain.map((item) => {
              const isActive =
                item.url === "/"
                  ? currentPath === "/"
                  : currentPath === item.url ||
                    currentPath.startsWith(item.url + "/");
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="h-10">
                    <Link
                      href={item.url}
                      className={`flex items-center font-sf gap-3 px-3 py-3 w-full
                        text-lg tracking-wide capitalize rounded-lg transition-colors
                        ${
                          isActive
                            ? "bg-muted text-primary-blue "
                            : "hover:bg-gray-100 text-gray-800"
                        }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="tracking-wide">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
