import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import type { Capability } from "./permissions";
import { ROUTES } from "@/shared/constants/domain";
import { toast } from "@/hooks/use-toast";

interface Props {
  cap: Capability;
  redirectTo?: string;
}

/**
 * Guard a nivel ruta. Si falta el permiso:
 *   1) muestra un toast destructivo
 *   2) redirige al dashboard (o a `redirectTo` si se pasó)
 */
export const RequirePermission = ({ cap, redirectTo = ROUTES.dashboard }: Props) => {
  const { can, isAuthenticated } = useAuth();
  const location = useLocation();
  const allowed = isAuthenticated && can(cap);

  useEffect(() => {
    if (!allowed && isAuthenticated) {
      toast({
        title: "Acceso restringido",
        description: "No tenés permisos para ver esta sección.",
        variant: "destructive",
      });
    }
  }, [allowed, isAuthenticated, location.pathname]);

  if (!isAuthenticated) return <Navigate to={ROUTES.login} replace />;
  if (!allowed) return <Navigate to={redirectTo} replace />;
  return <Outlet />;
};