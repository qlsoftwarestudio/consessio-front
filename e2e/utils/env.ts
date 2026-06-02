export const e2eEnv = {
  frontendUrl: process.env.FRONTEND_URL?.trim() || "http://localhost:5173",
  apiBaseUrl: process.env.API_BASE_URL?.trim() || "https://api-consessio-production.up.railway.app",
  adminEmail: process.env.E2E_ADMIN_EMAIL?.trim() || "",
  adminPassword: process.env.E2E_ADMIN_PASSWORD?.trim() || "",
};
