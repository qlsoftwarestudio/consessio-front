import { Navigate } from "react-router-dom";
import { useAppStore } from "@/shared/store/app-store";
import { ROUTES } from "@/shared/constants/domain";

const Index = () => {
  const user = useAppStore((s) => s.user);
  const org = useAppStore((s) => s.organization);
  if (user && org) return <Navigate to={ROUTES.dashboard} replace />;
  return <Navigate to={ROUTES.login} replace />;
};

export default Index;
