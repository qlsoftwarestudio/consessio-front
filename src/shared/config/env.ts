import { z } from "zod";

const devFallbackUrl = "http://localhost:8080";

const schema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_USE_MOCK_API: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  VITE_AUTH_STORAGE_KEY: z.string().min(1).default("concessio_auth"),
});

function normalizeUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

const rawApiUrl = normalizeUrl(import.meta.env.VITE_API_BASE_URL as string | undefined);

const enrichedEnv = {
  ...import.meta.env,
  VITE_API_BASE_URL: rawApiUrl || devFallbackUrl,
};

const parsed = schema.safeParse(enrichedEnv);

const data = parsed.success
  ? parsed.data
  : {
      VITE_API_BASE_URL: devFallbackUrl,
      VITE_USE_MOCK_API: false,
      VITE_AUTH_STORAGE_KEY: "concessio_auth",
    };

export const env = {
  apiBaseUrl: data.VITE_API_BASE_URL.replace(/\/$/, ""),
  useMockApi: data.VITE_USE_MOCK_API,
  authStorageKey: data.VITE_AUTH_STORAGE_KEY,
} as const;
