/**
 * Roles unificados con la API GIAMMA 360.
 * El backend devuelve y persiste estos valores; el front debe usar siempre estos
 * (no usar `owner/manager/seller` del modelo viejo, que queda solo para compat de mock).
 */
export const APP_ROLES = ["ADMIN_SISTEMA", "GERENTE", "SUPERVISOR", "VENDEDORA", "PLANES"] as const;
export type AppRole = (typeof APP_ROLES)[number];

export const ROLE_LABEL: Record<AppRole, string> = {
  ADMIN_SISTEMA: "Admin Sistema",
  GERENTE: "Gerente",
  SUPERVISOR: "Supervisor",
  VENDEDORA: "Vendedora",
  PLANES: "Planes",
};

/** Tono visual por rol (usa tokens semánticos). */
export const ROLE_TONE: Record<AppRole, string> = {
  ADMIN_SISTEMA: "bg-primary/15 text-primary ring-primary/30",
  GERENTE: "bg-info/15 text-info ring-info/30",
  SUPERVISOR: "bg-info/15 text-info ring-info/30",
  VENDEDORA: "bg-success/15 text-success ring-success/30",
  PLANES: "bg-success/15 text-success ring-success/30",
};

/** Coerciona cualquier string que venga del backend a un AppRole válido. */
export const normalizeRole = (raw?: string | null): AppRole => {
  if (!raw) return "VENDEDORA";
  const upper = raw.toUpperCase();
  return (APP_ROLES as readonly string[]).includes(upper)
    ? (upper as AppRole)
    : "VENDEDORA";
};