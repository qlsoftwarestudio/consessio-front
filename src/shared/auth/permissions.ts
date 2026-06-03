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
  "uploadDocuments",
  "verifyDocuments",
  "deleteDocuments",
] as const;

export type Capability = (typeof CAPABILITIES)[number];

const MATRIX: Record<AppRole, Capability[]> = {
  ADMIN_SISTEMA: [
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
    "uploadDocuments",
    "verifyDocuments",
    "deleteDocuments",
  ],
  GERENTE: [
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
    "uploadDocuments",
    "verifyDocuments",
    "deleteDocuments",
  ],
  SUPERVISOR: [
    "viewUsers",
    "seeAllLeads",
    "manageLeads",
    "reassignLeads",
    "importLeads",
    "manageVehicles",
    "changeVehicleStock",
    "createQuotation",
    "createTestDrive",
    "uploadDocuments",
    "verifyDocuments",
    "deleteDocuments",
  ],
  VENDEDORA: [
    "manageLeads",
    "changeVehicleStock",
    "createQuotation",
    "createTestDrive",
    "uploadDocuments",
  ],
  PLANES: [
    "manageLeads",
    "changeVehicleStock",
    "createQuotation",
    "createTestDrive",
    "uploadDocuments",
  ],
};

export const can = (role: AppRole | undefined | null, cap: Capability): boolean => {
  if (!role) return false;
  return MATRIX[role]?.includes(cap) ?? false;
};

/** Atajo para múltiples capacidades (todas requeridas). */
export const canAll = (role: AppRole | undefined | null, caps: Capability[]): boolean =>
  caps.every((c) => can(role, c));