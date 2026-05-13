import { Outlet, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/atomic-design/organisms/AppSidebar";
import { AppHeader } from "@/atomic-design/organisms/AppHeader";
import { useAppStore } from "@/shared/store/app-store";
import { ROUTES } from "@/shared/constants/domain";

export const AppLayout = () => {
  const user = useAppStore((s) => s.user);
  const org = useAppStore((s) => s.organization);

  if (!user) return <Navigate to={ROUTES.login} replace />;
  if (!org) return <Navigate to={ROUTES.onboarding} replace />;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
