import { AppSidebar } from "@/components/shared/AppSidebar";
import TopBar from "@/components/shared/TopBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
