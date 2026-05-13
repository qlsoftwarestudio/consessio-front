import { env } from "@/shared/config/env";
import { http, writeSession } from "@/shared/api/http-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type {
  ApiAuthResponse,
  ApiLoginPayload,
  ApiOnboardingPayload,
  ApiUser,
} from "@/shared/api/types";

export interface SessionInfo {
  token: string;
  email: string;
  role: string;
  tenantId: number;
  userId: number;
  fullName?: string;
}

export const authService = {
  async login(payload: ApiLoginPayload): Promise<SessionInfo> {
    if (env.useMockApi) {
      // Mock: cualquier email/contraseña entra
      const session: SessionInfo = {
        token: "mock-token-" + Date.now(),
        email: payload.email,
        role: "ADMIN",
        tenantId: 1,
        userId: 1,
        fullName: payload.email.split("@")[0] ?? "Usuario",
      };
      writeSession(session);
      return session;
    }
    const res = await http<ApiAuthResponse>(ENDPOINTS.auth.login, {
      method: "POST",
      body: payload,
      silent: true,
    });
    const session: SessionInfo = { ...res };
    writeSession(session);
    return session;
  },

  async onboarding(payload: ApiOnboardingPayload): Promise<SessionInfo> {
    if (env.useMockApi) {
      const session: SessionInfo = {
        token: "mock-token-" + Date.now(),
        email: payload.adminEmail,
        role: "ADMIN",
        tenantId: 1,
        userId: 1,
        fullName: `${payload.adminName} ${payload.adminLastname}`.trim(),
      };
      writeSession(session);
      return session;
    }
    // El endpoint de onboarding crea tenant + admin y devuelve un token estilo login
    const res = await http<ApiAuthResponse>(ENDPOINTS.auth.onboarding, {
      method: "POST",
      body: payload,
    });
    const session: SessionInfo = {
      ...res,
      fullName: `${payload.adminName} ${payload.adminLastname}`.trim(),
    };
    writeSession(session);
    return session;
  },

  async me(): Promise<ApiUser | null> {
    if (env.useMockApi) return null;
    return http<ApiUser>(ENDPOINTS.users.me);
  },

  signOut() {
    writeSession(null);
  },
};
