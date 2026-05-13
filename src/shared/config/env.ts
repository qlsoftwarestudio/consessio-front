import { z } from "zod";

const schema = z.object({
  VITE_API_BASE_URL: z.string().url().default("http://localhost:8080"),
  VITE_USE_MOCK_API: z
    .enum(["true", "false"])
    .default("true")
    .transform((v) => v === "true"),
  VITE_AUTH_STORAGE_KEY: z.string().min(1).default("concessio_auth"),
});

const parsed = schema.safeParse(import.meta.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("[Concessio] Variables de entorno inválidas:", parsed.error.flatten().fieldErrors);
}

const data = parsed.success
  ? parsed.data
  : {
      VITE_API_BASE_URL: "http://localhost:8080",
      VITE_USE_MOCK_API: true,
      VITE_AUTH_STORAGE_KEY: "concessio_auth",
    };

export const env = {
  apiBaseUrl: data.VITE_API_BASE_URL.replace(/\/$/, ""),
  useMockApi: data.VITE_USE_MOCK_API,
  authStorageKey: data.VITE_AUTH_STORAGE_KEY,
} as const;
