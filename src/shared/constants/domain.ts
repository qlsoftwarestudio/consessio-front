export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "test-drive",
  "quoted",
  "won",
  "lost",
] as const;

export const LEAD_STATUS_LABEL: Record<(typeof LEAD_STATUSES)[number], string> = {
  new: "Nuevo",
  contacted: "Contactado",
  qualified: "Calificado",
  "test-drive": "Test drive",
  quoted: "Cotizado",
  won: "Ganado",
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

export const VEHICLE_STATUSES = ["disponible", "reservado", "vendido"] as const;
export const VEHICLE_STATUS_LABEL: Record<(typeof VEHICLE_STATUSES)[number], string> = {
  disponible: "Disponible",
  reservado: "Reservado",
  vendido: "Vendido",
};

export const QUOTATION_TYPES = ["contado", "financiado", "plan-ahorro"] as const;
export const QUOTATION_TYPE_LABEL: Record<(typeof QUOTATION_TYPES)[number], string> = {
  contado: "Contado",
  financiado: "Financiado",
  "plan-ahorro": "Plan de ahorro",
};

export const ROLE_LABEL: Record<"owner" | "manager" | "seller", string> = {
  owner: "Propietario",
  manager: "Gerente",
  seller: "Vendedor",
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
} as const;
