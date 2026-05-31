import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../api/users.service";
import type { ApiUserCreatePayload } from "@/shared/api/types";

export const usersKeys = {
  all: ["users"] as const,
  list: (p: { page?: number; size?: number }) => ["users", "list", p] as const,
};

export const useUsers = (params: { page?: number; size?: number } = {}) =>
  useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => usersService.list(params),
  });

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ApiUserCreatePayload) => usersService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => usersService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
};
