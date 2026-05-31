import { env } from "@/shared/config/env";
import { http } from "@/shared/api/http-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import { fromApiUser } from "@/shared/api/mappers";
import type { ApiPage, ApiUser, ApiUserCreatePayload } from "@/shared/api/types";
import type { Member } from "@/shared/types/domain";

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export const usersService = {
  async list(params: { page?: number; size?: number; sortBy?: string } = {}): Promise<PagedResult<Member>> {
    const page = params.page ?? 0;
    const size = params.size ?? 20;

    const res = await http<ApiPage<ApiUser>>(ENDPOINTS.users.base, {
      query: { page, size, sortBy: params.sortBy },
    });

    return {
      items: res.content.map((u) => fromApiUser(u, "org-current")),
      total: res.totalElements,
      page: res.number,
      size: res.size,
      totalPages: res.totalPages,
    };
  },

  async create(payload: ApiUserCreatePayload): Promise<Member> {
    const res = await http<ApiUser>(ENDPOINTS.users.base, { method: "POST", body: payload });
    return fromApiUser(res, "org-current");
  },

  async delete(id: number | string): Promise<void> {
    await http(ENDPOINTS.users.byId(id), { method: "DELETE" });
  },
};
