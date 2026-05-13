export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "test-drive"
  | "quoted"
  | "won"
  | "lost";

export type LeadSource =
  | "web"
  | "instagram"
  | "facebook"
  | "whatsapp"
  | "referido"
  | "showroom"
  | "mercadolibre";

export type VehicleStatus = "disponible" | "reservado" | "vendido";
export type VehicleCondition = "0km" | "usado";

export type QuotationType = "contado" | "financiado" | "plan-ahorro";
export type QuotationStatus = "borrador" | "enviada" | "aceptada" | "rechazada";

export type TestDriveStatus = "agendado" | "realizado" | "cancelado" | "no-asistio";

export type AppRole = "owner" | "manager" | "seller";

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
  type: "lead_created" | "status_changed" | "note" | "quotation" | "test_drive" | "call" | "whatsapp";
  message: string;
  actorId?: string;
  createdAt: string;
}
