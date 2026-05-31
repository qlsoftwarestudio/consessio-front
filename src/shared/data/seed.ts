import type {
  Activity,
  Lead,
  Member,
  Organization,
  Quotation,
  TestDrive,
  Vehicle,
} from "@/shared/types/domain";

const ORG_ID = "org-demo";
const NOW = Date.now();
const daysAgo = (n: number) => new Date(NOW - n * 86400_000).toISOString();
const hoursFromNow = (n: number) => new Date(NOW + n * 3600_000).toISOString();

export const seedOrganization: Organization = {
  id: ORG_ID,
  name: "Concesionario Demo",
  brands: ["Toyota", "Volkswagen", "Ford", "Fiat", "Chevrolet"],
  createdAt: daysAgo(120),
};

export const seedMembers: Member[] = [
  { id: "m1", organizationId: ORG_ID, fullName: "Lucía Fernández", email: "lucia@demo.com", role: "ADMIN_SISTEMA" },
  { id: "m2", organizationId: ORG_ID, fullName: "Martín Pérez", email: "martin@demo.com", role: "GERENTE" },
  { id: "m3", organizationId: ORG_ID, fullName: "Carla Giménez", email: "carla@demo.com", role: "VENDEDORA" },
  { id: "m4", organizationId: ORG_ID, fullName: "Diego Ruiz", email: "diego@demo.com", role: "VENDEDORA" },
];

export const seedVehicles: Vehicle[] = [
  { id: "v1", organizationId: ORG_ID, brand: "Toyota", model: "Hilux", version: "SRX 4x4 AT", year: 2024, km: 0, condition: "0km", priceArs: 58_900_000, status: "disponible", color: "Gris Oscuro", stockCode: "TY-HX-001" },
  { id: "v2", organizationId: ORG_ID, brand: "Volkswagen", model: "Amarok", version: "Highline 4x4", year: 2024, km: 0, condition: "0km", priceArs: 54_500_000, status: "disponible", color: "Blanco", stockCode: "VW-AM-014" },
  { id: "v3", organizationId: ORG_ID, brand: "Ford", model: "Ranger", version: "Limited 4x4 AT", year: 2024, km: 0, condition: "0km", priceArs: 62_300_000, status: "reservado", color: "Negro", stockCode: "FD-RG-007" },
  { id: "v4", organizationId: ORG_ID, brand: "Fiat", model: "Cronos", version: "Drive 1.3", year: 2024, km: 0, condition: "0km", priceArs: 21_700_000, status: "disponible", color: "Rojo", stockCode: "FT-CR-022" },
  { id: "v5", organizationId: ORG_ID, brand: "Chevrolet", model: "Tracker", version: "Premier AT", year: 2023, km: 18_500, condition: "usado", priceArs: 28_900_000, status: "disponible", color: "Azul", stockCode: "CH-TK-103" },
  { id: "v6", organizationId: ORG_ID, brand: "Toyota", model: "Corolla", version: "XEi 2.0 CVT", year: 2024, km: 0, condition: "0km", priceArs: 33_800_000, status: "disponible", color: "Plata", stockCode: "TY-CO-040" },
  { id: "v7", organizationId: ORG_ID, brand: "Volkswagen", model: "Taos", version: "Comfortline", year: 2023, km: 12_000, condition: "usado", priceArs: 32_100_000, status: "vendido", color: "Gris", stockCode: "VW-TA-088" },
  { id: "v8", organizationId: ORG_ID, brand: "Ford", model: "Territory", version: "Titanium", year: 2024, km: 0, condition: "0km", priceArs: 47_400_000, status: "disponible", color: "Blanco Perla", stockCode: "FD-TR-011" },
];

export const seedLeads: Lead[] = [
  { id: "l1", organizationId: ORG_ID, fullName: "Juan Cabrera", phone: "1144556677", email: "juan.c@mail.com", status: "new", source: "instagram", interestVehicleId: "v1", createdAt: daysAgo(0), updatedAt: daysAgo(0), assignedTo: "m3" },
  { id: "l2", organizationId: ORG_ID, fullName: "María López", phone: "1133221100", email: "maria@mail.com", status: "contacted", source: "web", interestVehicleId: "v6", createdAt: daysAgo(1), updatedAt: daysAgo(0), assignedTo: "m3" },
  { id: "l3", organizationId: ORG_ID, fullName: "Pablo Sánchez", phone: "1166778899", status: "qualified", source: "whatsapp", interestVehicleId: "v2", createdAt: daysAgo(2), updatedAt: daysAgo(1), assignedTo: "m4" },
  { id: "l4", organizationId: ORG_ID, fullName: "Sofía Romero", phone: "1199887766", email: "sofi@mail.com", status: "test-drive-agendado", source: "showroom", interestVehicleId: "v3", createdAt: daysAgo(3), updatedAt: daysAgo(0), assignedTo: "m4" },
  { id: "l5", organizationId: ORG_ID, fullName: "Ricardo Funes", phone: "1155443322", status: "quoted", source: "referido", interestVehicleId: "v8", createdAt: daysAgo(5), updatedAt: daysAgo(1), assignedTo: "m3" },
  { id: "l6", organizationId: ORG_ID, fullName: "Andrea Vidal", phone: "1122334455", email: "andrea@mail.com", status: "won", source: "mercadolibre", interestVehicleId: "v7", createdAt: daysAgo(8), updatedAt: daysAgo(2), assignedTo: "m4" },
  { id: "l7", organizationId: ORG_ID, fullName: "Hernán Castro", phone: "1177665544", status: "lost", source: "facebook", interestVehicleId: "v4", createdAt: daysAgo(10), updatedAt: daysAgo(4), assignedTo: "m3" },
  { id: "l8", organizationId: ORG_ID, fullName: "Florencia Díaz", phone: "1144112233", email: "flor@mail.com", status: "new", source: "web", interestVehicleId: "v5", createdAt: daysAgo(0), updatedAt: daysAgo(0), assignedTo: "m4" },
  { id: "l9", organizationId: ORG_ID, fullName: "Gonzalo Méndez", phone: "1188776655", status: "contacted", source: "instagram", interestVehicleId: "v1", createdAt: daysAgo(1), updatedAt: daysAgo(0), assignedTo: "m3" },
  { id: "l10", organizationId: ORG_ID, fullName: "Valeria Ortega", phone: "1166554433", email: "vale@mail.com", status: "qualified", source: "web", interestVehicleId: "v8", createdAt: daysAgo(4), updatedAt: daysAgo(1), assignedTo: "m4" },
];

export const seedQuotations: Quotation[] = [
  { id: "q1", organizationId: ORG_ID, leadId: "l5", vehicleId: "v8", type: "financiado", status: "enviada", listPriceArs: 47_400_000, discountArs: 1_400_000, downPaymentArs: 20_000_000, installments: 36, installmentArs: 950_000, annualRate: 38, totalArs: 46_000_000, createdAt: daysAgo(2), createdBy: "m3" },
  { id: "q2", organizationId: ORG_ID, leadId: "l6", vehicleId: "v7", type: "contado", status: "aceptada", listPriceArs: 32_100_000, discountArs: 800_000, downPaymentArs: 31_300_000, totalArs: 31_300_000, createdAt: daysAgo(6), createdBy: "m4" },
  { id: "q3", organizationId: ORG_ID, leadId: "l3", vehicleId: "v2", type: "plan-ahorro", status: "borrador", listPriceArs: 54_500_000, discountArs: 0, downPaymentArs: 5_450_000, installments: 84, installmentArs: 620_000, totalArs: 54_500_000, createdAt: daysAgo(1), createdBy: "m4" },
];

export const seedTestDrives: TestDrive[] = [
  { id: "t1", organizationId: ORG_ID, leadId: "l4", vehicleId: "v3", scheduledAt: hoursFromNow(26), durationMin: 45, sellerId: "m4", status: "agendado" },
  { id: "t2", organizationId: ORG_ID, leadId: "l2", vehicleId: "v6", scheduledAt: hoursFromNow(72), durationMin: 30, sellerId: "m3", status: "agendado" },
  { id: "t3", organizationId: ORG_ID, leadId: "l10", vehicleId: "v8", scheduledAt: hoursFromNow(120), durationMin: 45, sellerId: "m4", status: "agendado" },
  { id: "t4", organizationId: ORG_ID, leadId: "l6", vehicleId: "v7", scheduledAt: hoursFromNow(-72), durationMin: 45, sellerId: "m4", status: "realizado" },
];

export const seedActivities: Activity[] = [
  { id: "a1", organizationId: ORG_ID, leadId: "l1", type: "lead_created", message: "Nuevo lead desde Instagram", actorId: "m3", createdAt: daysAgo(0) },
  { id: "a2", organizationId: ORG_ID, leadId: "l2", type: "whatsapp", message: "Mensaje de WhatsApp enviado", actorId: "m3", createdAt: daysAgo(0) },
  { id: "a3", organizationId: ORG_ID, leadId: "l4", type: "test_drive_agendado", message: "Test drive agendado para mañana", actorId: "m4", createdAt: daysAgo(0) },
  { id: "a4", organizationId: ORG_ID, leadId: "l5", type: "quotation", message: "Cotización financiada enviada", actorId: "m3", createdAt: daysAgo(2) },
  { id: "a5", organizationId: ORG_ID, leadId: "l6", type: "status_changed", message: "Lead marcado como Ganado 🎉", actorId: "m4", createdAt: daysAgo(2) },
  { id: "a6", organizationId: ORG_ID, leadId: "l3", type: "call", message: "Llamada de calificación", actorId: "m4", createdAt: daysAgo(1) },
];
