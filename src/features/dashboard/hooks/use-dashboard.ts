import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../api/dashboard.service";

export const useDashboard = () =>
  useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardService.get(),
  });
