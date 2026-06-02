import { useQuery } from "@tanstack/react-query";
import { http } from "@/shared/api/http-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import { env } from "@/shared/config/env";
import { useAppStore } from "@/shared/store/app-store";
import type { ApiUser } from "@/shared/api/types";
import type { Member } from "@/shared/types/domain";

const toMember = (u: ApiUser): Member => ({
  id: String(u.id),
  organizationId: "org-unknown",
  fullName: `${u.name ?? ""} ${u.lastname ?? ""}`.trim() || u.email,
  email: u.email,
  role: u.role as Member["role"],
});

export const membersKeys = {
  all: ["members"] as const,
};

export const useMembers = () => {
  const storeMembers = useAppStore((s) => s.members);

  return useQuery({
    queryKey: membersKeys.all,
    queryFn: async () => {
      if (env.useMockApi) return storeMembers;
      const res = await http<ApiUser[]>(ENDPOINTS.users.base);
      return res.map(toMember);
    },
    // Si hay miembros en el store (mock), usarlos mientras carga
    initialData: env.useMockApi ? storeMembers : undefined,
  });
};
