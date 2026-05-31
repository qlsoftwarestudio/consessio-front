import { env } from "@/shared/config/env";
import { http } from "@/shared/api/http-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type { ApiExcelUpload, ApiExcelUploadStatus } from "@/shared/api/types";

export const excelService = {
  async getUploads(): Promise<ApiExcelUpload[]> {
    if (env.useMockApi) return [];
    return http<ApiExcelUpload[]>(ENDPOINTS.excel.uploads);
  },

  async getUploadById(id: number | string): Promise<ApiExcelUpload> {
    if (env.useMockApi) {
      return {
        id: Number(id),
        filename: "demo.xlsx",
        status: "COMPLETED",
        processedCount: 18,
        errorCount: 0,
        createdAt: new Date().toISOString(),
      };
    }
    return http<ApiExcelUpload>(ENDPOINTS.excel.uploadById(id));
  },

  async getUploadsByStatus(status: ApiExcelUploadStatus): Promise<ApiExcelUpload[]> {
    if (env.useMockApi) return [];
    return http<ApiExcelUpload[]>(ENDPOINTS.excel.uploadStatus(status));
  },

  async uploadFile(file: File): Promise<ApiExcelUpload> {
    if (env.useMockApi) {
      await new Promise((r) => setTimeout(r, 800));
      return {
        id: Date.now(),
        filename: file.name,
        status: "COMPLETED",
        processedCount: 18,
        errorCount: 0,
        createdAt: new Date().toISOString(),
      };
    }
    const fd = new FormData();
    fd.append("file", file);
    return http<ApiExcelUpload>(ENDPOINTS.excel.upload, {
      method: "POST",
      formData: fd,
    });
  },

  async getTemplate(): Promise<Blob> {
    if (env.useMockApi) return new Blob([]);
    return http<Blob>(ENDPOINTS.excel.template, { raw: true });
  },

  async markProcessing(id: number | string): Promise<void> {
    await http(ENDPOINTS.excel.process(id), { method: "PUT" });
  },

  async markCompleted(id: number | string): Promise<void> {
    await http(ENDPOINTS.excel.complete(id), { method: "PUT" });
  },

  async markError(id: number | string, message: string): Promise<void> {
    await http(ENDPOINTS.excel.error(id), { method: "PUT", body: { message } });
  },
};
