import { e2eEnv } from "../utils/env";

const API_BASE = e2eEnv.apiBaseUrl;

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = API_BASE) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private async fetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(opts.headers || {}),
      },
      ...opts,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API ${path} failed: ${res.status} ${text}`);
    }
    return res.json() as Promise<T>;
  }

  /** Requiere token obtenido previamente (ej: por login en UI) */
  async me(token: string): Promise<{ id: number; email: string; role: string; tenantId: number; name?: string; lastname?: string }> {
    return this.fetch("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async createUser(token: string, data: Record<string, unknown>): Promise<{ id: number }> {
    return this.fetch("/users", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }

  async createLead(token: string, data: Record<string, unknown>): Promise<{ id: number }> {
    return this.fetch("/api/leads", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }

  async createVehicle(token: string, data: Record<string, unknown>): Promise<{ id: number }> {
    return this.fetch("/api/vehicles", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }
}
