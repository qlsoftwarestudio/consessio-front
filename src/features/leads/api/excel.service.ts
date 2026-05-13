import { env } from "@/shared/config/env";
import { http } from "@/shared/api/http-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type { ApiExcelUploadResult } from "@/shared/api/types";

export const excelService = {
  async uploadLeads(file: File): Promise<ApiExcelUploadResult> {
    if (env.useMockApi) {
      // Simula procesamiento
      await new Promise((r) => setTimeout(r, 800));
      return {
        success: true,
        processed: 18,
        duplicates: 2,
        errors: 0,
        message: "18 leads creados exitosamente. 2 duplicados ignorados.",
      };
    }
    const fd = new FormData();
    fd.append("file", file);
    return http<ApiExcelUploadResult>(ENDPOINTS.excel.uploadLeads, {
      method: "POST",
      formData: fd,
    });
  },
};
