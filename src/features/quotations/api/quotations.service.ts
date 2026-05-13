import { env } from "@/shared/config/env";
import { http } from "@/shared/api/http-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import { useAppStore } from "@/shared/store/app-store";
import { fromApiQuotation, toApiQuotationType } from "@/shared/api/mappers";
import type {
  ApiPage,
  ApiPlanType,
  ApiQuotation,
  ApiQuotationCreatePayload,
} from "@/shared/api/types";
import type { Quotation, QuotationType } from "@/shared/types/domain";

const orgId = () => useAppStore.getState().organization?.id ?? "org-mock";

export interface CreateQuotationInput {
  type: QuotationType;
  leadId: string;
  vehicleId: string;
  vehicleModel: string;
  listPriceArs: number;
  discountArs: number;
  totalArs: number;
  // Financiado
  downPaymentArs?: number;
  installments?: number;
  annualRate?: number;
  bank?: string;
  // Plan Fiat
  planType?: ApiPlanType;
  planInstallments?: number;
  notes?: string;
}

export const quotationsService = {
  async list(params: { page?: number; size?: number } = {}) {
    const page = params.page ?? 0;
    const size = params.size ?? 20;
    if (env.useMockApi) {
      const all = useAppStore.getState().quotations;
      const start = page * size;
      return {
        items: all.slice(start, start + size),
        total: all.length,
        page,
        size,
        totalPages: Math.max(1, Math.ceil(all.length / size)),
      };
    }
    const res = await http<ApiPage<ApiQuotation>>(ENDPOINTS.quotations.base, {
      query: { page, size, sort: "createdAt,desc" },
    });
    return {
      items: res.content.map((q) => fromApiQuotation(q, orgId())),
      total: res.totalElements,
      page: res.number,
      size: res.size,
      totalPages: res.totalPages,
    };
  },

  async create(input: CreateQuotationInput): Promise<Quotation> {
    if (env.useMockApi) {
      const userId = useAppStore.getState().user?.id ?? "u";
      const q = useAppStore.getState().addQuotation({
        leadId: input.leadId,
        vehicleId: input.vehicleId,
        type: input.type,
        status: "enviada",
        listPriceArs: input.listPriceArs,
        discountArs: input.discountArs,
        downPaymentArs: input.downPaymentArs ?? input.totalArs,
        installments: input.installments,
        installmentArs:
          input.installments && input.totalArs
            ? Math.round(input.totalArs / input.installments)
            : undefined,
        annualRate: input.annualRate,
        totalArs: input.totalArs,
        createdBy: userId,
      });
      return q;
    }

    const payload: ApiQuotationCreatePayload = {
      type: toApiQuotationType(input.type),
      vehicleModel: input.vehicleModel,
      priceList: input.listPriceArs,
      discount: input.discountArs,
      priceFinal: input.totalArs,
      downPayment: input.downPaymentArs,
      financingMonths: input.installments,
      interestRate: input.annualRate,
      bank: input.bank,
      planType: input.planType,
      planInstallments: input.planInstallments,
      notes: input.notes,
      lead: { id: Number(input.leadId) },
    };

    const res = await http<ApiQuotation>(ENDPOINTS.quotations.base, {
      method: "POST",
      body: payload,
    });
    return fromApiQuotation(res, orgId());
  },

  async markSent(id: string): Promise<void> {
    if (env.useMockApi) {
      const list = useAppStore.getState().quotations.map((q) =>
        q.id === id ? { ...q, status: "enviada" as const } : q,
      );
      useAppStore.setState({ quotations: list });
      return;
    }
    await http(ENDPOINTS.quotations.send(id), { method: "POST" });
  },
};
