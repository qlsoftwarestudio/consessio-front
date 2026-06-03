/**
 * Tipos que reflejan EXACTAMENTE las respuestas/payloads de la API GIAMMA 360.
 * No usar en componentes — usar los tipos de `src/shared/types/domain.ts`
 * y traducir vía `mappers.ts`.
 */

// ==================== Comunes ====================
export interface ApiPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

// ==================== Auth ====================
export type ApiRole = "GERENTE" | "SUPERVISOR" | "VENDEDORA" | "PLANES" | "ADMIN_SISTEMA";

export interface ApiAuthResponse {
  message: string;
  token: string;
}

export interface ApiLoginPayload {
  tenantCode: string;
  email: string;
  password: string;
}

export interface ApiOnboardingPayload {
  businessName: string;
  adminName: string;
  adminLastname: string;
  adminEmail: string;
  password: string;
}

// ==================== User ====================
export interface ApiUser {
  id: number;
  name: string;
  lastname: string;
  email: string;
  role: ApiRole;
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface ApiUserCreatePayload {
  name: string;
  lastname: string;
  email: string;
  password: string;
  role: ApiRole;
  isActive: boolean;
  phone?: string;
}

// ==================== Lead ====================
export type ApiLeadStatus =
  | "NUEVO"
  | "CONTACTADO"
  | "COTIZADO"
  | "TEST_DRIVE_AGENDADO"
  | "TEST_DRIVE_COMPLETADO"
  | "NEGOCIACION"
  | "RESERVADO"
  | "DOCUMENTACION_COMPLETA"
  | "ENTREGADO"
  | "NO_CONTESTA"
  | "CANCELADO";

export type ApiLeadSource =
  | "WEB"
  | "REFERIDO"
  | "CARTEL"
  | "REDES_SOCIALES"
  | "EXCEL"
  | "TELEFONO"
  | "VISITA"
  | "OTRO";

export interface ApiLeadAssignee {
  id: number;
  name?: string;
  lastname?: string;
}

export interface ApiLead {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  dni?: string;
  address?: string;
  city?: string;
  status: ApiLeadStatus;
  source: ApiLeadSource;
  vehicleInterest?: string;
  notes?: string;
  assignedTo?: ApiLeadAssignee | null;
  createdAt: string;
  updatedAt?: string;
  lastContactAt?: string | null;
}

export interface ApiLeadCreatePayload {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  dni?: string;
  address?: string;
  city?: string;
  status?: ApiLeadStatus;
  source?: ApiLeadSource;
  notes?: string;
  assignedTo?: { id: number };
}

// ==================== Vehicle ====================
export type ApiVehicleStatus = "DISPONIBLE" | "RESERVADO" | "VENDIDO" | "EN_TRANSITO" | "EN_PREPARACION" | "NO_DISPONIBLE";

export interface ApiVehicle {
  id: number;
  vin: string;
  brand?: string;
  model: string;
  year?: number;
  color?: string;
  priceList: number;
  status: ApiVehicleStatus;
  branch?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiVehicleCreatePayload {
  vin: string;
  brand?: string;
  model: string;
  year?: number;
  color?: string;
  priceList: number;
  status?: ApiVehicleStatus;
  branch?: string;
  notes?: string;
}

// ==================== Quotation ====================
export type ApiQuotationType = "CONTADO" | "FINANCIADO" | "PLAN_FIAT";
export type ApiPlanType = "100%" | "70/30" | "50/50" | "ADQUIRIDO";

export interface ApiQuotation {
  id: number;
  type: ApiQuotationType;
  vehicleModel: string;
  vehicleVin?: string;
  priceList: number;
  discount: number;
  priceFinal: number;
  downPayment?: number;
  financingMonths?: number;
  interestRate?: number;
  monthlyPayment?: number;
  bank?: string;
  planType?: ApiPlanType;
  planInstallments?: number;
  planInstallmentAmount?: number;
  planAdjudication?: number;
  totalInterest?: number;
  totalFinancingCost?: number;
  notes?: string;
  lead?: { id: number; firstName?: string; lastName?: string };
  createdBy?: { id: number; name?: string; lastname?: string };
  validUntil?: string;
  sentToCustomer?: boolean;
  sentAt?: string | null;
  createdAt: string;
}

export interface ApiQuotationCreatePayload {
  type: ApiQuotationType;
  vehicleModel: string;
  priceList: number;
  discount: number;
  priceFinal: number;
  downPayment?: number;
  financingMonths?: number;
  interestRate?: number;
  bank?: string;
  planType?: ApiPlanType;
  planInstallments?: number;
  notes?: string;
  lead: { id: number };
}

// ==================== Activity ====================
export type ApiActivityType =
  | "LEAD_CREATED"
  | "LEAD_UPDATED"
  | "LEAD_ASSIGNED"
  | "STATUS_CHANGED"
  | "LLAMADA"
  | "WHATSAPP"
  | "EMAIL"
  | "COTIZACION"
  | "TEST_DRIVE_AGENDADO"
  | "TEST_DRIVE_COMPLETADO"
  | "DOCUMENTO_SUBIDO"
  | "DOCUMENTO_VERIFICADO"
  | "NOTA"
  | "RESERVA"
  | "VENTA"
  | "EXCEL_UPLOAD";

export interface ApiActivity {
  id: number;
  type: ApiActivityType;
  description: string;
  lead?: { id: number; firstName?: string; lastName?: string };
  user?: { id: number; name?: string; lastname?: string };
  createdAt: string;
}

// ==================== Test Drive ====================
export type ApiTestDriveStatus = "AGENDADO" | "CONFIRMADO" | "COMPLETADO" | "CANCELADO" | "NO_SHOW";

export interface ApiTestDrive {
  id: number;
  scheduledAt?: string;
  scheduledDate?: string;
  durationMinutes?: number;
  duration?: number;
  status: ApiTestDriveStatus;
  notes?: string;
  feedback?: string;
  cancelReason?: string;
  lead: { id: number; firstName?: string; lastName?: string };
  vehicle: { id: number; brand?: string; model?: string; vin?: string };
  assignedTo?: { id: number; name?: string; lastname?: string };
}

export interface ApiTestDriveCreatePayload {
  scheduledAt: string;
  durationMinutes: number;
  notes?: string;
  lead: { id: number };
  vehicle: { id: number };
}

// ==================== Document ====================
export type ApiDocumentType =
  | "DNI_FRENTE"
  | "DNI_DORSO"
  | "CUIL_CUIT"
  | "RECIBO_SUELDO_1"
  | "RECIBO_SUELDO_2"
  | "RECIBO_SUELDO_3"
  | "SERVICIO"
  | "GARANTE_DNI_FRENTE"
  | "GARANTE_DNI_DORSO"
  | "GARANTE_CUIL"
  | "GARANTE_RECIBO_1"
  | "CONTRATO_RESERVA"
  | "ORDEN_COMPRA"
  | "OTRO";

export interface ApiDocument {
  id: number;
  type: ApiDocumentType;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  originalFilename?: string;
  storedFilename?: string;
  contentType?: string;
  size?: number;
  uploadedAt: string;
  uploadedBy?: { id: number; name?: string; lastname?: string };
  verified: boolean;
  verifiedAt?: string;
  verifiedBy?: { id: number; name?: string; lastname?: string };
  notes?: string;
}

export interface ApiDocumentStats {
  totalDocs: number;
  verifiedDocs: number;
  pendingDocs: number;
}

// ==================== Excel ====================
export type ApiExcelUploadStatus = "UPLOADED" | "PROCESSING" | "COMPLETED" | "ERROR";

export interface ApiExcelUpload {
  id: number;
  filename: string;
  status: ApiExcelUploadStatus;
  processedCount?: number;
  errorCount?: number;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

// ==================== Dashboard ====================
export interface ApiDashboard {
  leads: {
    total: number;
    newThisMonth: number;
    byStatus: Partial<Record<ApiLeadStatus, number>>;
  };
  vehicles: {
    total: number;
    available: number;
    reserved: number;
    sold: number;
  };
  quotations: {
    total: number;
    thisMonth: number;
    byType: Partial<Record<ApiQuotationType, number>>;
    totalValue: number;
  };
  testDrives: {
    total: number;
    pending: number;
    completed: number;
  };
  conversionRate: number;
}

// ==================== Copilot ====================
export interface ApiCopilotDailySummary {
  date: string;
  newLeadsToday: number;
  hotLeadsCount: number;
  abandonedLeadsCount: number;
  testDrivesToday: number;
  pendingTestDrives: number;
  salesThisMonth: number;
  salesRevenueThisMonth: number;
  headline: string;
  highlights: string[];
}

export interface ApiCopilotHotLead {
  leadId: number;
  fullName: string;
  phone: string;
  status: string;
  score: number;
  reason: string;
  suggestedAction: string;
  assignedToName?: string;
  vehicleInterest?: string;
  lastContactAt?: string;
}

export interface ApiCopilotAbandonedLead {
  leadId: number;
  fullName: string;
  phone: string;
  status: string;
  daysSinceLastContact: number;
  assignedToName?: string;
  suggestedAction: string;
}

export type ApiCopilotPriority = "ALTA" | "MEDIA" | "BAJA";

export interface ApiCopilotNextAction {
  leadId: number;
  fullName: string;
  status: string;
  action: string;
  priority: ApiCopilotPriority;
  suggestedMessage?: string;
  phone?: string;
}

export interface ApiCopilotRankingItem {
  userId: number;
  name: string;
  leadsAssigned: number;
  activitiesCount: number;
  sales: number;
  conversionRate: number;
  revenue: number;
}
