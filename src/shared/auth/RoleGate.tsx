import type { ReactNode } from "react";
import { useAuth } from "./useAuth";
import type { Capability } from "./permissions";

interface Props {
  cap: Capability;
  /** Renderizado cuando el usuario NO tiene la capacidad (default: null). */
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Esconde un fragmento de UI si el usuario no tiene la capacidad requerida.
 * Pensado para botones, items de menú, columnas opcionales.
 */
export const RoleGate = ({ cap, fallback = null, children }: Props) => {
  const { can } = useAuth();
  return <>{can(cap) ? children : fallback}</>;
};