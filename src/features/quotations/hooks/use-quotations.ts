import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { quotationsService } from "../api/quotations.service";

export const quotationsKeys = {
  all: ["quotations"] as const,
  list: (page: number, size: number) => ["quotations", "list", page, size] as const,
};

export const useQuotations = (page = 0, size = 20) =>
  useQuery({
    queryKey: quotationsKeys.list(page, size),
    queryFn: () => quotationsService.list({ page, size }),
  });

export const useCreateQuotation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: quotationsService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: quotationsKeys.all });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};
