import { useMemo } from "react";
import {
  Flame,
  Loader2,
  RotateCcw,
  Users,
  Calendar,
  Car,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Trophy,
} from "lucide-react";
import { PageHeader } from "@/atomic-design/molecules/PageHeader";
import { KpiCard } from "@/atomic-design/molecules/KpiCard";
import { useAuth } from "@/shared/auth/useAuth";
import { formatARS } from "@/shared/utils/format";
import { CopilotSection } from "../components/CopilotSection";
import { HotLeadsTable } from "../components/HotLeadsTable";
import { AbandonedLeadsTable } from "../components/AbandonedLeadsTable";
import { NextActionsList } from "../components/NextActionsList";
import { RankingTable } from "../components/RankingTable";
import {
  useDailySummary,
  useHotLeads,
  useAbandonedLeads,
  useNextActions,
  useRanking,
} from "../hooks/use-copilot";

export const CopilotPage = () => {
  const { role } = useAuth();
  const isManager = role === "GERENTE" || role === "SUPERVISOR";

  const { data: summary, isLoading: loadingSummary } = useDailySummary();
  const { data: hotLeads = [], isLoading: loadingHot } = useHotLeads();
  const { data: abandoned = [], isLoading: loadingAbandoned } = useAbandonedLeads();
  const { data: actions = [], isLoading: loadingActions } = useNextActions();
  const { data: ranking = [], isLoading: loadingRanking } = useRanking();

  const kpis = useMemo(
    () => ({
      newLeadsToday: summary?.newLeadsToday ?? 0,
      hotLeadsCount: summary?.hotLeadsCount ?? 0,
      abandonedLeadsCount: summary?.abandonedLeadsCount ?? 0,
      testDrivesToday: summary?.testDrivesToday ?? 0,
      pendingTestDrives: summary?.pendingTestDrives ?? 0,
      salesThisMonth: summary?.salesThisMonth ?? 0,
      salesRevenueThisMonth: summary?.salesRevenueThisMonth ?? 0,
    }),
    [summary],
  );

  return (
    <div>
      <PageHeader
        title="Copiloto Comercial"
        subtitle="Resumen inteligente de tu operación"
      />

      {/* Banner headline */}
      {summary && (
        <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            {summary.headline}
          </div>
          {summary.highlights.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {summary.highlights.map((h, i) => (
                <span
                  key={i}
                  className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary"
                >
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      {loadingSummary && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-border/50 bg-surface-1/40 p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Cargando resumen del día…
        </div>
      )}

      {/* KPIs */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard label="Leads nuevos hoy" value={kpis.newLeadsToday} icon={Users} accent />
        <KpiCard label="Leads calientes" value={kpis.hotLeadsCount} icon={Flame} />
        <KpiCard label="Abandonados" value={kpis.abandonedLeadsCount} icon={AlertTriangle} />
        <KpiCard label="Test drives hoy" value={kpis.testDrivesToday} icon={Calendar} />
        <KpiCard label="Ventas del mes" value={kpis.salesThisMonth} icon={Car} />
      </section>

      {/* Revenue destacado */}
      {summary && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 px-4 py-2.5 text-sm">
          <TrendingUp className="h-4 w-4 text-success" />
          <span className="font-medium text-success">Revenue estimado del mes:</span>
          <span className="ml-auto font-display text-lg font-bold text-success">
            {formatARS(kpis.salesRevenueThisMonth)}
          </span>
        </div>
      )}

      {/* Grid de secciones */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Leads calientes */}
        <CopilotSection
          title="Leads calientes"
          subtitle="Oportunidades con mayor probabilidad de conversión"
          isLoading={loadingHot}
          empty={hotLeads.length === 0}
          emptyText="No hay leads calientes por ahora."
        >
          <HotLeadsTable leads={hotLeads} />
        </CopilotSection>

        {/* Próximas acciones */}
        <CopilotSection
          title="Próximas acciones"
          subtitle={isManager ? "Acciones recomendadas del equipo" : "Tus acciones recomendadas"}
          isLoading={loadingActions}
          empty={actions.length === 0}
          emptyText="No hay acciones pendientes."
        >
          <NextActionsList actions={actions} />
        </CopilotSection>

        {/* Leads abandonados */}
        <CopilotSection
          title="Leads abandonados"
          subtitle="Sin contacto reciente"
          isLoading={loadingAbandoned}
          empty={abandoned.length === 0}
          emptyText="No hay leads abandonados."
        >
          <AbandonedLeadsTable leads={abandoned} />
        </CopilotSection>

        {/* Ranking */}
        {isManager && (
          <CopilotSection
            title="Ranking de vendedoras"
            subtitle="Últimos 30 días"
            isLoading={loadingRanking}
            empty={ranking.length === 0}
            emptyText="Sin datos de ranking."
            className="lg:col-span-2"
          >
            <RankingTable items={ranking} />
          </CopilotSection>
        )}
      </div>
    </div>
  );
};
