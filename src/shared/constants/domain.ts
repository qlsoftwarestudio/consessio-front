export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "test-drive-agendado",
  "test-drive-completado",
  "quoted",
  "negociacion",
  "reservado",
  "documentacion-completa",
  "won",
  "no-contesta",
  "cancelado",
  "lost",
] as const;

export const LEAD_STATUS_LABEL: Record<(typeof LEAD_STATUSES)[number], string> = {
  new: "Nuevo",
  contacted: "Contactado",
  qualified: "Calificado",
  "test-drive-agendado": "Test drive agendado",
  "test-drive-completado": "Test drive completado",
  quoted: "Cotizado",
  negociacion: "Negociación",
  reservado: "Reservado",
  "documentacion-completa": "Documentación completa",
  won: "Ganado",
  "no-contesta": "No contesta",
  cancelado: "Cancelado",
  lost: "Perdido",
};

export const LEAD_SOURCES = [
  "web",
  "instagram",
  "facebook",
  "whatsapp",
  "referido",
  "showroom",
  "mercadolibre",
] as const;

export const LEAD_SOURCE_LABEL: Record<(typeof LEAD_SOURCES)[number], string> = {
  web: "Web",
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  referido: "Referido",
  showroom: "Showroom",
  mercadolibre: "Mercado Libre",
};

export const VEHICLE_STATUSES = ["disponible", "reservado", "vendido", "en-transito", "en-preparacion", "no-disponible"] as const;
export const VEHICLE_STATUS_LABEL: Record<(typeof VEHICLE_STATUSES)[number], string> = {
  disponible: "Disponible",
  reservado: "Reservado",
  vendido: "Vendido",
  "en-transito": "En tránsito",
  "en-preparacion": "En preparación",
  "no-disponible": "No disponible",
};

export const QUOTATION_TYPES = ["contado", "financiado", "plan-ahorro"] as const;
export const QUOTATION_TYPE_LABEL: Record<(typeof QUOTATION_TYPES)[number], string> = {
  contado: "Contado",
  financiado: "Financiado",
  "plan-ahorro": "Plan de ahorro",
};

export const BRANDS = [
  "Toyota",
  "Volkswagen",
  "Ford",
  "Fiat",
  "Chevrolet",
  "Renault",
  "Peugeot",
  "Citroën",
  "Nissan",
  "Honda",
] as const;

export const ROUTES = {
  login: "/login",
  signup: "/signup",
  onboarding: "/onboarding",
  dashboard: "/app",
  leads: "/app/leads",
  leadDetail: (id: string) => `/app/leads/${id}`,
  vehicles: "/app/vehiculos",
  quotations: "/app/cotizaciones",
  newQuotation: "/app/cotizaciones/nueva",
  testDrives: "/app/test-drives",
  members: "/app/usuarios",
  copilot: "/app/copilot",
} as const;
