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

const rawApiUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

// eslint-disable-next-line no-console
console.log("[Concessio] VITE_API_BASE_URL raw:", JSON.stringify(import.meta.env.VITE_API_BASE_URL));

const enrichedEnv = {
  ...import.meta.env,
  VITE_API_BASE_URL: rawApiUrl || devFallbackUrl,
};

const parsed = schema.safeParse(enrichedEnv);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("[Concessio] Variables de entorno inválidas:", parsed.error.flatten().fieldErrors);
}

const data = parsed.success
  ? parsed.data
  : {
      VITE_API_BASE_URL: devFallbackUrl,
      VITE_USE_MOCK_API: false,
      VITE_AUTH_STORAGE_KEY: "concessio_auth",
    };

if (!rawApiUrl && import.meta.env.PROD) {
  // eslint-disable-next-line no-console
  console.error(
    "[Concessio] ERROR CRÍTICO: VITE_API_BASE_URL no está definida en producción. " +
      "Configurá la variable en el dashboard de Vercel (Project Settings → Environment Variables)."
  );
}

export const env = {
  apiBaseUrl: data.VITE_API_BASE_URL.replace(/\/$/, ""),
  useMockApi: data.VITE_USE_MOCK_API,
  authStorageKey: data.VITE_AUTH_STORAGE_KEY,
} as const;
