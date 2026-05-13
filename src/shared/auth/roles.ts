/**
 * Roles unificados con la API GIAMMA 360.
 * El backend devuelve y persiste estos valores; el front debe usar siempre estos
 * (no usar `owner/manager/seller` del modelo viejo, que queda solo para compat de mock).
 */
export const APP_ROLES = ["ADMIN", "GERENTE", "VENDEDOR", "ADMINISTRATIVO"] as const;
export type AppRole = (typeof APP_ROLES)[number];

export const ROLE_LABEL: Record<AppRole, string> = {
  ADMIN: "Administrador",
  GERENTE: "Gerente",
  VENDEDOR: "Vendedor",
  ADMINISTRATIVO: "Administrativo",
};

/** Tono visual por rol (usa tokens semánticos). */
export const ROLE_TONE: Record<AppRole, string> = {
  ADMIN: "bg-primary/15 text-primary ring-primary/30",
  GERENTE: "bg-info/15 text-info ring-info/30",
  VENDEDOR: "bg-success/15 text-success ring-success/30",
  ADMINISTRATIVO: "bg-surface-2 text-foreground/80 ring-border",
};

/** Coerciona cualquier string que venga del backend a un AppRole válido. */
export const normalizeRole = (raw?: string | null): AppRole => {
  if (!raw) return "VENDEDOR";
  const upper = raw.toUpperCase();
  return (APP_ROLES as readonly string[]).includes(upper)
    ? (upper as AppRole)
    : "VENDEDOR";
};