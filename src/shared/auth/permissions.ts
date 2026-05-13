import type { AppRole } from "./roles";

/**
 * Capacidades del producto. La UI consume estas capacidades, no roles directos,
 * para que la matriz se pueda evolucionar sin tocar componentes.
 */
export const CAPABILITIES = [
  "manageUsers",        // ver/crear/editar usuarios
  "viewUsers",          // entrar a /usuarios (lectura)
  "manageOrganization", // editar datos de la empresa
  "seeAllLeads",        // ver todos los leads (no solo asignados)
  "manageLeads",        // crear/editar leads
  "reassignLeads",      // cambiar el vendedor asignado
  "importLeads",        // importar Excel
  "manageVehicles",     // crear/editar/borrar vehículos
  "changeVehicleStock", // reservar / vender
  "createQuotation",    // crear cotizaciones
  "createTestDrive",    // agendar test drives
] as const;

export type Capability = (typeof CAPABILITIES)[number];

const MATRIX: Record<AppRole, Capability[]> = {
  ADMIN: [
    "manageUsers",
    "viewUsers",
    "manageOrganization",
    "seeAllLeads",
    "manageLeads",
    "reassignLeads",
    "importLeads",
    "manageVehicles",
    "changeVehicleStock",
    "createQuotation",
    "createTestDrive",
  ],
  GERENTE: [
    "viewUsers",
    "seeAllLeads",
    "manageLeads",
    "reassignLeads",
    "importLeads",
    "manageVehicles",
    "changeVehicleStock",
    "createQuotation",
    "createTestDrive",
  ],
  VENDEDOR: [
    "manageLeads",
    "changeVehicleStock",
    "createQuotation",
    "createTestDrive",
  ],
  ADMINISTRATIVO: [
    "seeAllLeads",
    // solo lectura: sin manage* ni create*
  ],
};

export const can = (role: AppRole | undefined | null, cap: Capability): boolean => {
  if (!role) return false;
  return MATRIX[role]?.includes(cap) ?? false;
};

/** Atajo para múltiples capacidades (todas requeridas). */
export const canAll = (role: AppRole | undefined | null, caps: Capability[]): boolean =>
  caps.every((c) => can(role, c));