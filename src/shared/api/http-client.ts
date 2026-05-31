import { env } from "@/shared/config/env";
import { toast } from "@/hooks/use-toast";
import type { ApiError } from "./types";

const SESSION_EVENT = "concessio:session-expired";

export interface SessionPayload {
  token: string;
  email?: string;
  role?: string;
  tenantId?: number;
  userId?: number;
}

const readSession = (): SessionPayload | null => {
  try {
    const raw = localStorage.getItem(env.authStorageKey);
    return raw ? (JSON.parse(raw) as SessionPayload) : null;
  } catch {
    return null;
  }
};

export const writeSession = (s: SessionPayload | null) => {
  try {
    if (s) localStorage.setItem(env.authStorageKey, JSON.stringify(s));
    else localStorage.removeItem(env.authStorageKey);
  } catch {
    /* ignore */
  }
};

export const onSessionExpired = (cb: () => void) => {
  window.addEventListener(SESSION_EVENT, cb);
  return () => window.removeEventListener(SESSION_EVENT, cb);
};

export class HttpError extends Error {
  status: number;
  body?: unknown;
  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

interface RequestOpts {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  /** Si es FormData, no setea Content-Type */
  formData?: FormData;
  /** Devuelve la respuesta cruda en lugar de json (descargas binarias) */
  raw?: boolean;
  /** Silencia el toast de error */
  silent?: boolean;
}

const buildUrl = (path: string, query?: RequestOpts["query"]) => {
  const url = new URL(env.apiBaseUrl + path);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.append(k, String(v));
    });
  }
  return url.toString();
};

const errorMessage = (status: number, body: unknown): string => {
  const apiBody = body as Partial<ApiError> | undefined;
  if (apiBody?.message) return apiBody.message;
  switch (status) {
    case 400: return "Datos inválidos. Revisá el formulario.";
    case 401: return "Sesión expirada. Iniciá sesión nuevamente.";
    case 403: return "No tenés permisos para esta acción.";
    case 404: return "Recurso no encontrado.";
    case 409: return "Conflicto: el recurso ya existe.";
    case 422: return "No se pudo procesar la solicitud.";
    case 500: return "Error del servidor. Probá de nuevo en unos segundos.";
    default: return `Error ${status}.`;
  }
};

export const http = async <T = unknown>(path: string, opts: RequestOpts = {}): Promise<T> => {
  const session = readSession();
  const headers: Record<string, string> = { ...(opts.headers ?? {}) };

  if (session?.token) headers["Authorization"] = `Bearer ${session.token}`;

  let body: BodyInit | undefined;
  if (opts.formData) {
    body = opts.formData;
  } else if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }

  let res: Response;
  try {
    res = await fetch(buildUrl(path, opts.query), {
      method: opts.method ?? "GET",
      headers,
      body,
    });
  } catch (err) {
    if (!opts.silent) {
      toast({
        title: "No se pudo conectar al servidor",
        description: "Verificá tu conexión o que el backend esté disponible.",
        variant: "destructive",
      });
    }
    throw new HttpError("Network error", 0, err);
  }

  // 204 / 205
  if (res.status === 204 || res.status === 205) return undefined as T;

  if (opts.raw) {
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new HttpError(errorMessage(res.status, text), res.status, text);
    }
    return res as unknown as T;
  }

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => undefined) : await res.text().catch(() => undefined);

  if (!res.ok) {
    const msg = errorMessage(res.status, data);

    if (res.status === 401) {
      writeSession(null);
      window.dispatchEvent(new CustomEvent(SESSION_EVENT));
    }

    if (!opts.silent) {
      toast({
        title: res.status === 401 ? "Sesión expirada" : "Algo salió mal",
        description: msg,
        variant: "destructive",
      });
    }
    throw new HttpError(msg, res.status, data);
  }

  return data as T;
};
