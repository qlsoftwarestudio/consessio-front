import { env } from "@/shared/config/env";
import { http, writeSession, type SessionPayload } from "@/shared/api/http-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type {
  ApiAuthResponse,
  ApiLoginPayload,
  ApiOnboardingPayload,
  ApiUser,
  ApiUserCreatePayload,
} from "@/shared/api/types";

export interface SessionInfo {
  token: string;
  email: string;
  role: string;
  tenantId: number;
  userId: number;
  fullName?: string;
}

/** Decodifica el payload de un JWT (sin validar firma) */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Construye SessionInfo completo a partir del token + datos de /users/me */
async function buildSession(token: string, email: string): Promise<SessionInfo> {
  // Guardamos token provisional para que /users/me pueda autenticar
  writeSession({ token });

  const jwtPayload = decodeJwtPayload(token);
  const tenantId = typeof jwtPayload?.tenantId === "number" ? jwtPayload.tenantId : 0;

  const me = await http<ApiUser>(ENDPOINTS.users.me);

  const session: SessionInfo = {
    token,
    email: me.email || email,
    role: me.role,
    tenantId,
    userId: me.id,
    fullName: `${me.name ?? ""} ${me.lastname ?? ""}`.trim() || email,
  };
  writeSession(session);
  return session;
}

export const authService = {
  async login(payload: ApiLoginPayload): Promise<SessionInfo> {
    if (env.useMockApi) {
      // Mock: cualquier email/contraseña entra
      const session: SessionInfo = {
        token: "mock-token-" + Date.now(),
        email: payload.email,
        role: "ADMIN_SISTEMA",
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
    return buildSession(res.token, payload.email);
  },

  async register(payload: ApiUserCreatePayload): Promise<SessionInfo> {
    if (env.useMockApi) {
      const session: SessionInfo = {
        token: "mock-token-" + Date.now(),
        email: payload.email,
        role: payload.role,
        tenantId: 1,
        userId: Date.now(),
        fullName: `${payload.name} ${payload.lastname}`.trim(),
      };
      writeSession(session);
      return session;
    }
    const res = await http<ApiAuthResponse>(ENDPOINTS.auth.register, {
      method: "POST",
      body: payload,
    });
    return buildSession(res.token, payload.email);
  },

  async onboarding(payload: ApiOnboardingPayload): Promise<SessionInfo> {
    if (env.useMockApi) {
      const session: SessionInfo = {
        token: "mock-token-" + Date.now(),
        email: payload.adminEmail,
        role: "ADMIN_SISTEMA",
        tenantId: 1,
        userId: 1,
        fullName: `${payload.adminName} ${payload.adminLastname}`.trim(),
      };
      writeSession(session);
      return session;
    }
    const res = await http<ApiAuthResponse>(ENDPOINTS.auth.onboarding, {
      method: "POST",
      body: payload,
    });
    return buildSession(res.token, payload.adminEmail);
  },

  async me(): Promise<ApiUser | null> {
    if (env.useMockApi) return null;
    return http<ApiUser>(ENDPOINTS.users.me);
  },

  signOut() {
    writeSession(null);
  },
};
