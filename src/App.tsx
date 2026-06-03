import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { AuthLayout } from "@/atomic-design/templates/AuthLayout";
import { AppLayout } from "@/atomic-design/templates/AppLayout";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { OnboardingPage } from "@/features/organization/pages/OnboardingPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { LeadsPage } from "@/features/leads/pages/LeadsPage";
import { LeadDetailPage } from "@/features/leads/pages/LeadDetailPage";
import { VehiclesPage } from "@/features/vehicles/pages/VehiclesPage";
import { QuotationsPage } from "@/features/quotations/pages/QuotationsPage";
import { NewQuotationPage } from "@/features/quotations/pages/NewQuotationPage";
import { TestDrivesPage } from "@/features/test-drives/pages/TestDrivesPage";
import { MembersPage } from "@/features/organization/pages/MembersPage";
import { CopilotPage } from "@/features/copilot/pages/CopilotPage";
import { queryClient } from "@/shared/api/query-client";
import { onSessionExpired } from "@/shared/api/http-client";
import { useAppStore } from "@/shared/store/app-store";
import { ROUTES } from "@/shared/constants/domain";
import { RequirePermission } from "@/shared/auth/RequirePermission";

const SessionWatcher = () => {
  const navigate = useNavigate();
  const signOut = useAppStore((s) => s.signOut);
  useEffect(() => {
    return onSessionExpired(() => {
      signOut();
      navigate(ROUTES.login, { replace: true });
    });
  }, [navigate, signOut]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionWatcher />
        <Routes>
          <Route path="/" element={<Index />} />

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Navigate to="/onboarding" replace />} />
          </Route>

          <Route path="/onboarding" element={<OnboardingPage />} />

          <Route path="/app" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="leads/:id" element={<LeadDetailPage />} />
            <Route path="vehiculos" element={<VehiclesPage />} />
            <Route path="cotizaciones" element={<QuotationsPage />} />
            <Route element={<RequirePermission cap="createQuotation" />}>
              <Route path="cotizaciones/nueva" element={<NewQuotationPage />} />
            </Route>
            <Route path="test-drives" element={<TestDrivesPage />} />
            <Route path="copilot" element={<CopilotPage />} />
            <Route element={<RequirePermission cap="viewUsers" />}>
              <Route path="usuarios" element={<MembersPage />} />
            </Route>
          </Route>

          <Route path="/dashboard" element={<Navigate to="/app" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
