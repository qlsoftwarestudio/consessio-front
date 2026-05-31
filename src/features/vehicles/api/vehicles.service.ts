import { env } from "@/shared/config/env";
import { http } from "@/shared/api/http-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import { useAppStore } from "@/shared/store/app-store";
import { fromApiVehicle, toApiVehicleStatus } from "@/shared/api/mappers";
import type { ApiPage, ApiVehicle, ApiVehicleCreatePayload } from "@/shared/api/types";
import type { Vehicle, VehicleStatus } from "@/shared/types/domain";

const orgId = () => useAppStore.getState().organization?.id ?? "org-mock";

export interface VehicleFilters {
  page?: number;
  size?: number;
  brand?: string;
  status?: VehicleStatus;
  query?: string;
}

export const vehiclesService = {
  async list(params: VehicleFilters = {}) {
    const page = params.page ?? 0;
    const size = params.size ?? 24;

    if (env.useMockApi) {
      const all = useAppStore.getState().vehicles.filter((v) => {
        if (params.brand && v.brand !== params.brand) return false;
        if (params.status && v.status !== params.status) return false;
        if (params.query) {
          const t = params.query.toLowerCase();
          if (!`${v.brand} ${v.model} ${v.version ?? ""} ${v.stockCode}`.toLowerCase().includes(t))
            return false;
        }
        return true;
      });
      const start = page * size;
      return {
        items: all.slice(start, start + size),
        total: all.length,
        page,
        size,
        totalPages: Math.max(1, Math.ceil(all.length / size)),
      };
    }

    const res = await http<ApiPage<ApiVehicle>>(ENDPOINTS.vehicles.base, {
      query: {
        page,
        size,
        sort: "createdAt,desc",
        // El back acepta `model` como filtro de búsqueda en /search; mantenemos compatibilidad básica.
        ...(params.query ? { model: params.query } : {}),
      },
    });
    return {
      items: res.content.map((v) => fromApiVehicle(v, orgId())),
      total: res.totalElements,
      page: res.number,
      size: res.size,
      totalPages: res.totalPages,
    };
  },

  async create(input: {
    vin: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    priceArs: number;
    status: VehicleStatus;
    branch?: string;
  }): Promise<Vehicle> {
    if (env.useMockApi) {
      const before = useAppStore.getState().vehicles.length;
      useAppStore.getState().addVehicle({
        brand: input.brand,
        model: input.model,
        year: input.year,
        km: 0,
        condition: "0km",
        color: input.color,
        priceArs: input.priceArs,
        status: input.status,
        stockCode: input.vin,
      });
      return useAppStore.getState().vehicles[0]!;
      void before;
    }
    const payload: ApiVehicleCreatePayload = {
      vin: input.vin,
      brand: input.brand,
      model: input.model,
      year: input.year,
      color: input.color,
      priceList: input.priceArs,
      status: toApiVehicleStatus(input.status),
      branch: input.branch,
    };
    const res = await http<ApiVehicle>(ENDPOINTS.vehicles.base, {
      method: "POST",
      body: payload,
    });
    return fromApiVehicle(res, orgId());
  },

  async updateStatus(id: string, status: VehicleStatus): Promise<void> {
    if (env.useMockApi) {
      const list = useAppStore.getState().vehicles.map((v) =>
        v.id === id ? { ...v, status } : v,
      );
      useAppStore.setState({ vehicles: list });
      return;
    }
    await http(ENDPOINTS.vehicles.status(id), {
      method: "PUT",
      body: toApiVehicleStatus(status),
    });
  },

  async reserve(id: string): Promise<void> {
    if (env.useMockApi) {
      const list = useAppStore.getState().vehicles.map((v) =>
        v.id === id ? { ...v, status: "reservado" as VehicleStatus } : v,
      );
      useAppStore.setState({ vehicles: list });
      return;
    }
    await http(ENDPOINTS.vehicles.reserve(id), { method: "PUT" });
  },

  async sell(id: string): Promise<void> {
    if (env.useMockApi) {
      const list = useAppStore.getState().vehicles.map((v) =>
        v.id === id ? { ...v, status: "vendido" as VehicleStatus } : v,
      );
      useAppStore.setState({ vehicles: list });
      return;
    }
    await http(ENDPOINTS.vehicles.sell(id), { method: "PUT" });
  },

  async release(id: string): Promise<void> {
    if (env.useMockApi) {
      const list = useAppStore.getState().vehicles.map((v) =>
        v.id === id ? { ...v, status: "disponible" as VehicleStatus } : v,
      );
      useAppStore.setState({ vehicles: list });
      return;
    }
    await http(ENDPOINTS.vehicles.release(id), { method: "PUT" });
  },

  async checkAvailability(id: string): Promise<boolean> {
    if (env.useMockApi) {
      const v = useAppStore.getState().vehicles.find((v) => v.id === id);
      return v?.status === "disponible";
    }
    return http<boolean>(ENDPOINTS.vehicles.availability(id));
  },
};
