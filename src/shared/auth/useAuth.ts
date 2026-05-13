import { useAppStore } from "@/shared/store/app-store";
import { normalizeRole, type AppRole } from "./roles";
import { can, type Capability } from "./permissions";

/**
 * Hook único para leer el rol y comprobar capacidades.
 * Uso: const { role, can } = useAuth();  if (can('importLeads')) …
 */
export const useAuth = () => {
  const user = useAppStore((s) => s.user);
  const role: AppRole = normalizeRole(user?.role);

  return {
    user,
    role,
    isAuthenticated: Boolean(user),
    can: (cap: Capability) => can(role, cap),
  };
};