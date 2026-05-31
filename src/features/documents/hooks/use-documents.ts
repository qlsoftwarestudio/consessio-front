import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentsService, type DocumentUploadInput } from "../api/documents.service";
import type { ApiDocumentType } from "@/shared/api/types";

export const documentsKeys = {
  all: ["documents"] as const,
  byLead: (leadId: number | string) => ["documents", "lead", leadId] as const,
  verified: (leadId: number | string) => ["documents", "verified", leadId] as const,
};

export const useDocumentsByLead = (leadId?: number | string) =>
  useQuery({
    enabled: Boolean(leadId),
    queryKey: documentsKeys.byLead(leadId ?? ""),
    queryFn: () => documentsService.listByLead(leadId!),
  });

export const useVerifiedDocuments = (leadId?: number | string) =>
  useQuery({
    enabled: Boolean(leadId),
    queryKey: documentsKeys.verified(leadId ?? ""),
    queryFn: () => documentsService.verified(leadId!),
  });

export const useUploadDocument = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: DocumentUploadInput) => documentsService.upload(input),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: documentsKeys.byLead(vars.leadId) });
      qc.invalidateQueries({ queryKey: documentsKeys.verified(vars.leadId) });
    },
  });
};

export const useVerifyDocument = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, leadId }: { id: number | string; leadId: number | string }) =>
      documentsService.verify(id),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: documentsKeys.byLead(vars.leadId) });
      qc.invalidateQueries({ queryKey: documentsKeys.verified(vars.leadId) });
    },
  });
};

export const useDeleteDocument = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, leadId }: { id: number | string; leadId: number | string }) =>
      documentsService.delete(id),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: documentsKeys.byLead(vars.leadId) });
    },
  });
};
