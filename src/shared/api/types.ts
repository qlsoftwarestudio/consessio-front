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
export type ApiRole = "ADMIN" | "GERENTE" | "VENDEDOR" | "ADMINISTRATIVO";

export interface ApiAuthResponse {
  token: string;
  email: string;
  role: ApiRole;
  tenantId: number;
  userId: number;
}

export interface ApiLoginPayload {
  email: string;
  password: string;
}

export interface ApiOnboardingPayload {
  businessName: string;
  adminName: string;
  adminLastname: string;
  adminEmail: string;
  adminPassword: string;
}

// ==================== User ====================
export interface ApiUser {
  id: number;
  name: string;
  lastname: string;
  email: string;
  role: ApiRole;
  phone?: string;
  active?: boolean;
  createdAt?: string;
}

export interface ApiUserCreatePayload {
  name: string;
  lastname: string;
  email: string;
  password: string;
  role: ApiRole;
  phone?: string;
}

// ==================== Lead ====================
export type ApiLeadStatus =
  | "NUEVO"
  | "CONTACTADO"
  | "EN_SEGUIMIENTO"
  | "COTIZADO"
  | "TEST_DRIVE"
  | "NEGOCIACION"
  | "ENTREGADO"
  | "DESCARTADO";

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
  notes?: string;
  assignedTo?: ApiLeadAssignee | null;
  createdAt: string;
  updatedAt?: string;
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
export type ApiVehicleStatus = "DISPONIBLE" | "RESERVADO" | "VENDIDO" | "NO_DISPONIBLE";

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
  | "CREACION"
  | "ACTUALIZACION"
  | "COTIZACION"
  | "TEST_DRIVE"
  | "LLAMADA"
  | "EMAIL"
  | "VISITA"
  | "ESTADO_CAMBIADO"
  | "ASIGNACION"
  | "NOTA";

export interface ApiActivity {
  id: number;
  type: ApiActivityType;
  description: string;
  lead?: { id: number; firstName?: string; lastName?: string };
  user?: { id: number; name?: string; lastname?: string };
  createdAt: string;
}

// ==================== Test Drive ====================
export type ApiTestDriveStatus = "PENDIENTE" | "COMPLETADO" | "CANCELADO" | "NO_ASISTIO";

export interface ApiTestDrive {
  id: number;
  scheduledDate: string;
  duration: number;
  status: ApiTestDriveStatus;
  notes?: string;
  feedback?: string;
  cancelReason?: string;
  lead: { id: number; firstName?: string; lastName?: string };
  vehicle: { id: number; brand?: string; model?: string; vin?: string };
  assignedTo?: { id: number; name?: string; lastname?: string };
}

export interface ApiTestDriveCreatePayload {
  scheduledDate: string;
  duration: number;
  notes?: string;
  lead: { id: number };
  vehicle: { id: number };
}

// ==================== Document ====================
export type ApiDocumentType =
  | "DNI"
  | "LICENCIA"
  | "PASAPORTE"
  | "COMPROBANTE_DOMICILIO"
  | "RECIBO_SUELDO"
  | "FICHA_INSCRIPCION"
  | "CONTRATO"
  | "OTRO";

export interface ApiDocument {
  id: number;
  type: ApiDocumentType;
  originalFilename: string;
  storedFilename: string;
  contentType: string;
  size: number;
  uploadedAt: string;
}

// ==================== Excel ====================
export interface ApiExcelUploadResult {
  success: boolean;
  processed: number;
  duplicates: number;
  errors: number;
  message: string;
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
