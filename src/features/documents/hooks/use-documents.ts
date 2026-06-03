import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentsService, type DocumentUploadInput } from "../api/documents.service";

export const documentsKeys = {
  all: ["documents"] as const,
  byLead: (leadId: number | string) => ["documents", "lead", leadId] as const,
  verified: (leadId: number | string) => ["documents", "verified", leadId] as const,
  checklist: (leadId: number | string) => ["documents", "checklist", leadId] as const,
  stats: (leadId: number | string) => ["documents", "stats", leadId] as const,
};

const invalidateLeadDocuments = (qc: ReturnType<typeof useQueryClient>, leadId: number | string) => {
  qc.invalidateQueries({ queryKey: documentsKeys.byLead(leadId) });
  qc.invalidateQueries({ queryKey: documentsKeys.verified(leadId) });
  qc.invalidateQueries({ queryKey: documentsKeys.checklist(leadId) });
  qc.invalidateQueries({ queryKey: documentsKeys.stats(leadId) });
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

export const useDocumentChecklist = (leadId?: number | string) =>
  useQuery({
    enabled: Boolean(leadId),
    queryKey: documentsKeys.checklist(leadId ?? ""),
    queryFn: () => documentsService.checklist(leadId!),
  });

export const useDocumentStats = (leadId?: number | string) =>
  useQuery({
    enabled: Boolean(leadId),
    queryKey: documentsKeys.stats(leadId ?? ""),
    queryFn: () => documentsService.stats(leadId!),
  });

export const useUploadDocument = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: DocumentUploadInput) => documentsService.upload(input),
    onSuccess: (_data, vars) => invalidateLeadDocuments(qc, vars.leadId),
  });
};

export const useVerifyDocument = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number | string; leadId: number | string }) =>
      documentsService.verify(id),
    onSuccess: (_data, vars) => invalidateLeadDocuments(qc, vars.leadId),
  });
};

export const useDeleteDocument = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number | string; leadId: number | string }) =>
      documentsService.delete(id),
    onSuccess: (_data, vars) => invalidateLeadDocuments(qc, vars.leadId),
  });
};
