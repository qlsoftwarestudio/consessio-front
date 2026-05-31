export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "test-drive-agendado"
  | "test-drive-completado"
  | "quoted"
  | "negociacion"
  | "reservado"
  | "documentacion-completa"
  | "won"
  | "no-contesta"
  | "cancelado"
  | "lost";

export type LeadSource =
  | "web"
  | "instagram"
  | "facebook"
  | "whatsapp"
  | "referido"
  | "showroom"
  | "mercadolibre";

export type VehicleStatus = "disponible" | "reservado" | "vendido" | "en-transito" | "en-preparacion" | "no-disponible";
export type VehicleCondition = "0km" | "usado";

export type QuotationType = "contado" | "financiado" | "plan-ahorro";
export type QuotationStatus = "borrador" | "enviada" | "aceptada" | "rechazada";

export type TestDriveStatus = "agendado" | "confirmado" | "realizado" | "cancelado" | "no-asistio";

export type AppRole = "ADMIN_SISTEMA" | "GERENTE" | "SUPERVISOR" | "VENDEDORA" | "PLANES";

export interface Organization {
  id: string;
  name: string;
  brands: string[];
  createdAt: string;
}

export interface Member {
  id: string;
  organizationId: string;
  fullName: string;
  email: string;
  role: AppRole;
  avatarUrl?: string;
}

export interface Lead {
  id: string;
  organizationId: string;
  fullName: string;
  email?: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  vehicleInterest?: string;
  interestVehicleId?: string;
  interestNote?: string;
  assignedTo?: string; // member id
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  organizationId: string;
  brand: string;
  model: string;
  version?: string;
  year: number;
  km: number;
  condition: VehicleCondition;
  priceArs: number;
  status: VehicleStatus;
  color: string;
  imageUrl?: string;
  stockCode: string;
}

export interface Quotation {
  id: string;
  organizationId: string;
  leadId: string;
  vehicleId: string;
  type: QuotationType;
  status: QuotationStatus;
  listPriceArs: number;
  discountArs: number;
  downPaymentArs: number;
  installments?: number;
  installmentArs?: number;
  annualRate?: number;
  totalArs: number;
  createdAt: string;
  createdBy: string;
}

export interface TestDrive {
  id: string;
  organizationId: string;
  leadId: string;
  vehicleId: string;
  scheduledAt: string;
  durationMin: number;
  sellerId: string;
  status: TestDriveStatus;
  notes?: string;
}

export interface Activity {
  id: string;
  organizationId: string;
  leadId?: string;
  type:
    | "lead_created"
    | "lead_updated"
    | "lead_assigned"
    | "status_changed"
    | "call"
    | "whatsapp"
    | "email"
    | "quotation"
    | "test_drive_agendado"
    | "test_drive_completado"
    | "documento_subido"
    | "documento_verificado"
    | "note"
    | "reserva"
    | "venta"
    | "excel_upload";
  message: string;
  actorId?: string;
  createdAt: string;
}
