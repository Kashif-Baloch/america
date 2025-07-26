import { AppSidebar } from "@/components/shared/AppSidebar";
import TopBar from "@/components/shared/TopBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;

}) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  const { locale } = await params

  if (!session || session.user.role !== "ADMIN") {
    // if you want redirect instead of error message 
    // redirect({ href: "/", locale })
    console.log(locale)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="p-5 max-w-md border border-destructive bg-destructive/10 text-destructive rounded-lg text-sm font-medium space-y-2">
          <p>⚠️ <strong>Access Denied</strong></p>
          <p>You are currently logged in as a regular user, but this section is restricted to administrators only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[117dvh] w-full">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main className="flex-1 overflow-auto">
            <TopBar />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
