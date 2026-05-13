/**
 * Endpoints de la API GIAMMA 360.
 * Todas las rutas son relativas a `VITE_API_BASE_URL`.
 */
export const ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    onboarding: "/api/auth/onboarding",
  },
  leads: {
    base: "/api/leads",
    byId: (id: number | string) => `/api/leads/${id}`,
    search: "/api/leads/search",
    byStatus: (status: string) => `/api/leads/status/${status}`,
    myLeads: "/api/leads/my-leads",
    unassigned: "/api/leads/unassigned",
    assign: (id: number | string) => `/api/leads/${id}/assign`,
    setStatus: (id: number | string) => `/api/leads/${id}/status`,
    statsByStatus: "/api/leads/stats/by-status",
  },
  vehicles: {
    base: "/api/vehicles",
    available: "/api/vehicles/available",
    search: "/api/vehicles/search",
    byId: (id: number | string) => `/api/vehicles/${id}`,
    byVin: (vin: string) => `/api/vehicles/vin/${vin}`,
    reserve: (id: number | string) => `/api/vehicles/${id}/reserve`,
    sell: (id: number | string) => `/api/vehicles/${id}/sell`,
    isAvailable: (id: number | string) => `/api/vehicles/${id}/available`,
    statsByStatus: "/api/vehicles/stats/by-status",
  },
  quotations: {
    base: "/api/quotations",
    byId: (id: number | string) => `/api/quotations/${id}`,
    byLead: (leadId: number | string) => `/api/quotations/lead/${leadId}`,
    byType: (type: string) => `/api/quotations/type/${type}`,
    valid: "/api/quotations/valid",
    send: (id: number | string) => `/api/quotations/${id}/send`,
    statsByType: "/api/quotations/stats/by-type",
  },
  users: {
    base: "/api/users",
    byId: (id: number | string) => `/api/users/${id}`,
    me: "/api/users/me",
  },
  activities: {
    base: "/api/activities",
    byLead: (leadId: number | string) => `/api/activities/lead/${leadId}`,
    timeline: (leadId: number | string) => `/api/activities/lead/${leadId}/timeline`,
  },
  testDrives: {
    base: "/api/test-drives",
    byLead: (leadId: number | string) => `/api/test-drives/lead/${leadId}`,
    byVehicle: (vehicleId: number | string) => `/api/test-drives/vehicle/${vehicleId}`,
    calendar: "/api/test-drives/calendar",
    complete: (id: number | string) => `/api/test-drives/${id}/complete`,
    cancel: (id: number | string) => `/api/test-drives/${id}/cancel`,
  },
  documents: {
    byLead: (leadId: number | string) => `/api/documents/lead/${leadId}`,
    upload: "/api/documents/upload",
    download: (id: number | string) => `/api/documents/${id}/download`,
    byId: (id: number | string) => `/api/documents/${id}`,
  },
  excel: {
    uploadLeads: "/api/excel/upload-leads",
    process: "/api/excel/process",
  },
  dashboard: {
    base: "/api/dashboard",
    kpis: "/api/dashboard/kpis",
    pipeline: "/api/dashboard/pipeline",
  },
} as const;
