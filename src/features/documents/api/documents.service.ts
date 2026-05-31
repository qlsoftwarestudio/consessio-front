import { env } from "@/shared/config/env";
import { http } from "@/shared/api/http-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type { ApiDocument, ApiDocumentType } from "@/shared/api/types";

export interface DocumentUploadInput {
  leadId: number | string;
  type: ApiDocumentType;
  file: File;
  notes?: string;
}

export const documentsService = {
  async listByLead(leadId: number | string): Promise<ApiDocument[]> {
    if (env.useMockApi) return [];
    return http<ApiDocument[]>(ENDPOINTS.documents.byLead(leadId));
  },

  async listByLeadAndType(leadId: number | string, type: ApiDocumentType): Promise<ApiDocument[]> {
    if (env.useMockApi) return [];
    return http<ApiDocument[]>(ENDPOINTS.documents.byLeadType(leadId, type));
  },

  async verified(leadId: number | string): Promise<ApiDocument[]> {
    if (env.useMockApi) return [];
    return http<ApiDocument[]>(ENDPOINTS.documents.verified(leadId));
  },

  async checklist(leadId: number | string): Promise<ApiDocumentType[]> {
    if (env.useMockApi) return [];
    return http<ApiDocumentType[]>(ENDPOINTS.documents.checklist(leadId));
  },

  async upload(input: DocumentUploadInput): Promise<ApiDocument> {
    const formData = new FormData();
    const metadata = JSON.stringify({
      lead: { id: Number(input.leadId) },
      type: input.type,
      notes: input.notes,
    });
    formData.append("document", metadata);
    formData.append("file", input.file);

    return http<ApiDocument>(ENDPOINTS.documents.upload, {
      method: "POST",
      formData,
    });
  },

  async download(id: number | string): Promise<Blob> {
    return http<Blob>(ENDPOINTS.documents.download(id), { raw: true });
  },

  async verify(id: number | string): Promise<void> {
    await http(ENDPOINTS.documents.verify(id), { method: "PUT" });
  },

  async delete(id: number | string): Promise<void> {
    await http(ENDPOINTS.documents.byId(id), { method: "DELETE" });
  },
};
