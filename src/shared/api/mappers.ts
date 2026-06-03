/**
 * Traductores entre los modelos de la API GIAMMA 360 y el dominio interno.
 * El dominio interno se mantuvo simple (status en lowercase, ids string,
 * `fullName`, `priceArs`) para que la UI no tenga que conocer la API.
 */
import type {
  ApiActivity,
  ApiActivityType,
  ApiDashboard,
  ApiLead,
  ApiLeadCreatePayload,
  ApiLeadSource,
  ApiLeadStatus,
  ApiQuotation,
  ApiQuotationType,
  ApiTestDrive,
  ApiTestDriveStatus,
  ApiUser,
  ApiVehicle,
  ApiVehicleStatus,
} from "./types";
import type {
  Activity,
  Lead,
  LeadSource,
  LeadStatus,
  Member,
  Quotation,
  QuotationStatus,
  QuotationType,
  TestDrive,
  TestDriveStatus,
  Vehicle,
  VehicleStatus,
} from "@/shared/types/domain";

// ==================== Lead status ====================
const LEAD_STATUS_TO_API: Record<LeadStatus, ApiLeadStatus> = {
  new: "NUEVO",
  contacted: "CONTACTADO",
  qualified: "CONTACTADO",
  "test-drive-agendado": "TEST_DRIVE_AGENDADO",
  "test-drive-completado": "TEST_DRIVE_COMPLETADO",
  quoted: "COTIZADO",
  negociacion: "NEGOCIACION",
  reservado: "RESERVADO",
  "documentacion-completa": "DOCUMENTACION_COMPLETA",
  won: "ENTREGADO",
  "no-contesta": "NO_CONTESTA",
  cancelado: "CANCELADO",
  lost: "CANCELADO",
};
const LEAD_STATUS_FROM_API: Record<ApiLeadStatus, LeadStatus> = {
  NUEVO: "new",
  CONTACTADO: "contacted",
  COTIZADO: "quoted",
  TEST_DRIVE_AGENDADO: "test-drive-agendado",
  TEST_DRIVE_COMPLETADO: "test-drive-completado",
  NEGOCIACION: "negociacion",
  RESERVADO: "reservado",
  DOCUMENTACION_COMPLETA: "documentacion-completa",
  ENTREGADO: "won",
  NO_CONTESTA: "no-contesta",
  CANCELADO: "cancelado",
};
export const toApiLeadStatus = (s: LeadStatus): ApiLeadStatus => LEAD_STATUS_TO_API[s];
export const fromApiLeadStatus = (s: ApiLeadStatus): LeadStatus => LEAD_STATUS_FROM_API[s] ?? "new";

// ==================== Lead source ====================
const LEAD_SOURCE_TO_API: Record<LeadSource, ApiLeadSource> = {
  web: "WEB",
  instagram: "REDES_SOCIALES",
  facebook: "REDES_SOCIALES",
  whatsapp: "TELEFONO",
  referido: "REFERIDO",
  showroom: "VISITA",
  mercadolibre: "OTRO",
};
const LEAD_SOURCE_FROM_API: Record<ApiLeadSource, LeadSource> = {
  WEB: "web",
  REFERIDO: "referido",
  CARTEL: "showroom",
  REDES_SOCIALES: "instagram",
  EXCEL: "web",
  TELEFONO: "whatsapp",
  VISITA: "showroom",
  OTRO: "mercadolibre",
};
export const toApiLeadSource = (s: LeadSource): ApiLeadSource => LEAD_SOURCE_TO_API[s];
export const fromApiLeadSource = (s: ApiLeadSource): LeadSource => LEAD_SOURCE_FROM_API[s] ?? "web";

// ==================== Vehicle status ====================
const VEHICLE_STATUS_TO_API: Record<VehicleStatus, ApiVehicleStatus> = {
  disponible: "DISPONIBLE",
  reservado: "RESERVADO",
  vendido: "VENDIDO",
  "en-transito": "EN_TRANSITO",
  "en-preparacion": "EN_PREPARACION",
  "no-disponible": "NO_DISPONIBLE",
};
const VEHICLE_STATUS_FROM_API: Record<ApiVehicleStatus, VehicleStatus> = {
  DISPONIBLE: "disponible",
  RESERVADO: "reservado",
  VENDIDO: "vendido",
  EN_TRANSITO: "en-transito",
  EN_PREPARACION: "en-preparacion",
  NO_DISPONIBLE: "no-disponible",
};
export const toApiVehicleStatus = (s: VehicleStatus): ApiVehicleStatus => VEHICLE_STATUS_TO_API[s];
export const fromApiVehicleStatus = (s: ApiVehicleStatus): VehicleStatus => VEHICLE_STATUS_FROM_API[s];

// ==================== Quotation type ====================
const QUOTATION_TYPE_TO_API: Record<QuotationType, ApiQuotationType> = {
  contado: "CONTADO",
  financiado: "FINANCIADO",
  "plan-ahorro": "PLAN_FIAT",
};
const QUOTATION_TYPE_FROM_API: Record<ApiQuotationType, QuotationType> = {
  CONTADO: "contado",
  FINANCIADO: "financiado",
  PLAN_FIAT: "plan-ahorro",
};
export const toApiQuotationType = (t: QuotationType): ApiQuotationType => QUOTATION_TYPE_TO_API[t];
export const fromApiQuotationType = (t: ApiQuotationType): QuotationType => QUOTATION_TYPE_FROM_API[t];

// ==================== Test drive status ====================
const TD_STATUS_FROM_API: Record<ApiTestDriveStatus, TestDriveStatus> = {
  AGENDADO: "agendado",
  CONFIRMADO: "confirmado",
  COMPLETADO: "realizado",
  CANCELADO: "cancelado",
  NO_SHOW: "no-asistio",
};
export const fromApiTestDriveStatus = (s: ApiTestDriveStatus): TestDriveStatus =>
  TD_STATUS_FROM_API[s] ?? "agendado";

// ==================== Lead ====================
export const fromApiLead = (api: ApiLead, orgId: string): Lead => ({
  id: String(api.id),
  organizationId: orgId,
  fullName: `${api.firstName ?? ""} ${api.lastName ?? ""}`.trim() || "Sin nombre",
  email: api.email || undefined,
  phone: api.phone ?? "",
  status: fromApiLeadStatus(api.status),
  source: fromApiLeadSource(api.source),
  vehicleInterest: api.vehicleInterest,
  interestNote: api.notes,
  assignedTo: api.assignedTo ? String(api.assignedTo.id) : undefined,
  createdAt: api.createdAt,
  updatedAt: api.updatedAt ?? api.createdAt,
});

const splitName = (full: string): { firstName: string; lastName: string } => {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
};

export const toApiLeadCreate = (input: {
  fullName: string;
  phone?: string;
  email?: string;
  source: LeadSource;
  status?: LeadStatus;
  notes?: string;
  assignedToUserId?: number;
}): ApiLeadCreatePayload => {
  const { firstName, lastName } = splitName(input.fullName);
  return {
    firstName,
    lastName,
    phone: input.phone,
    email: input.email,
    source: toApiLeadSource(input.source),
    status: input.status ? toApiLeadStatus(input.status) : "NUEVO",
    notes: input.notes,
    assignedTo: input.assignedToUserId ? { id: input.assignedToUserId } : undefined,
  };
};

// ==================== Vehicle ====================
export const fromApiVehicle = (api: ApiVehicle, orgId: string): Vehicle => ({
  id: String(api.id),
  organizationId: orgId,
  brand: api.brand ?? "—",
  model: api.model,
  version: undefined,
  year: api.year ?? new Date().getFullYear(),
  km: 0,
  condition: "0km",
  priceArs: Number(api.priceList) || 0,
  status: fromApiVehicleStatus(api.status),
  color: api.color ?? "—",
  stockCode: api.vin,
});

// ==================== Quotation ====================
const quotationStatusFromApi = (sentToCustomer?: boolean): QuotationStatus =>
  sentToCustomer ? "enviada" : "borrador";

export const fromApiQuotation = (api: ApiQuotation, orgId: string): Quotation => ({
  id: String(api.id),
  organizationId: orgId,
  leadId: api.lead?.id ? String(api.lead.id) : "",
  vehicleId: "",
  type: fromApiQuotationType(api.type),
  status: quotationStatusFromApi(api.sentToCustomer),
  listPriceArs: Number(api.priceList) || 0,
  discountArs: Number(api.discount) || 0,
  downPaymentArs: Number(api.downPayment ?? api.priceFinal) || 0,
  installments: api.financingMonths ?? api.planInstallments,
  installmentArs: api.monthlyPayment ?? api.planInstallmentAmount,
  annualRate: api.interestRate,
  totalArs: Number(api.totalFinancingCost ?? api.priceFinal) || 0,
  createdAt: api.createdAt,
  createdBy: "u-current",
});

// ==================== Activity ====================
const ACTIVITY_TYPE_FROM_API: Record<ApiActivityType, Activity["type"]> = {
  LEAD_CREATED: "lead_created",
  LEAD_UPDATED: "lead_updated",
  LEAD_ASSIGNED: "lead_assigned",
  STATUS_CHANGED: "status_changed",
  LLAMADA: "call",
  WHATSAPP: "whatsapp",
  EMAIL: "email",
  COTIZACION: "quotation",
  TEST_DRIVE_AGENDADO: "test_drive_agendado",
  TEST_DRIVE_COMPLETADO: "test_drive_completado",
  DOCUMENTO_SUBIDO: "documento_subido",
  DOCUMENTO_VERIFICADO: "documento_verificado",
  NOTA: "note",
  RESERVA: "reserva",
  VENTA: "venta",
  EXCEL_UPLOAD: "excel_upload",
};

export const fromApiActivity = (api: ApiActivity, orgId: string): Activity => ({
  id: String(api.id),
  organizationId: orgId,
  leadId: api.lead?.id ? String(api.lead.id) : undefined,
  type: ACTIVITY_TYPE_FROM_API[api.type] ?? "note",
  message: api.description,
  actorId: api.user?.id ? String(api.user.id) : undefined,
  createdAt: api.createdAt,
});

// ==================== Test Drive ====================
export const fromApiTestDrive = (api: ApiTestDrive, orgId: string): TestDrive => ({
  id: String(api.id),
  organizationId: orgId,
  leadId: String(api.lead.id),
  vehicleId: String(api.vehicle.id),
  scheduledAt: api.scheduledDate,
  durationMin: api.duration,
  sellerId: api.assignedTo ? String(api.assignedTo.id) : "",
  status: fromApiTestDriveStatus(api.status),
  notes: api.notes,
});

// ==================== User ====================
export const fromApiUser = (api: ApiUser, orgId: string): Member => ({
  id: String(api.id),
  organizationId: orgId,
  fullName: `${api.name ?? ""} ${api.lastname ?? ""}`.trim() || api.email,
  email: api.email,
  role: api.role,
});

// ==================== Dashboard ====================
export interface DashboardSnapshot {
  activeLeads: number;
  availableVehicles: number;
  quotationsMonth: number;
  pendingTestDrives: number;
  pipeline: Array<{ status: LeadStatus; count: number }>;
  conversionRate: number;
  totalQuotationValue: number;
}

export const fromApiDashboard = (api: ApiDashboard): DashboardSnapshot => {
  const pipeline = (Object.entries(api.leads.byStatus) as Array<[ApiLeadStatus, number]>).map(
    ([k, v]) => ({ status: fromApiLeadStatus(k), count: v ?? 0 }),
  );
  const activeLeads =
    api.leads.total -
    (api.leads.byStatus.ENTREGADO ?? 0) -
    (api.leads.byStatus.CANCELADO ?? 0);

  return {
    activeLeads,
    availableVehicles: api.vehicles.available,
    quotationsMonth: api.quotations.thisMonth,
    pendingTestDrives: api.testDrives.pending,
    pipeline,
    conversionRate: api.conversionRate,
    totalQuotationValue: api.quotations.totalValue,
  };
};
