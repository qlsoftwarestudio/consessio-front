import { useMemo } from "react";
import { Calendar, Car, FileText, Loader2, TrendingUp, Users } from "lucide-react";
import { useAppStore } from "@/shared/store/app-store";
import { KpiCard } from "@/atomic-design/molecules/KpiCard";
import { PageHeader } from "@/atomic-design/molecules/PageHeader";
import { LEAD_STATUSES, LEAD_STATUS_LABEL, ROUTES } from "@/shared/constants/domain";
import { formatRelative } from "@/shared/utils/format";
import { Avatar } from "@/atomic-design/atoms/Avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useDashboard } from "../hooks/use-dashboard";
import { useMembers } from "@/features/organization/hooks/use-members";

export const DashboardPage = () => {
  const activities = useAppStore((s) => s.activities);
  const { data: membersData } = useMembers();
  const members = membersData ?? [];
  const user = useAppStore((s) => s.user);
  const { data: snapshot, isLoading } = useDashboard();

  const stats = {
    activeLeads: snapshot?.activeLeads ?? 0,
    availableVehicles: snapshot?.availableVehicles ?? 0,
    quotationsMonth: snapshot?.quotationsMonth ?? 0,
    pendingTestDrives: snapshot?.pendingTestDrives ?? 0,
  };

  const pipeline = useMemo(() => {
    const byStatus = new Map(snapshot?.pipeline.map((p) => [p.status, p.count]) ?? []);
    const counts = LEAD_STATUSES.map((status) => ({
      status,
      count: byStatus.get(status) ?? 0,
    }));
    const max = Math.max(1, ...counts.map((c) => c.count));
    return counts.map((c) => ({ ...c, percent: (c.count / max) * 100 }));
  }, [snapshot]);

  const memberById = (id?: string) => members.find((m) => m.id === id);

  return (
    <div>
      <PageHeader
        title={`Hola, ${user?.fullName.split(" ")[0]} 👋`}
        subtitle="Esto es lo que está pasando hoy en tu concesionario"
        actions={
          <Button asChild className="bg-gradient-gold text-primary-foreground shadow-amber hover:shadow-amber-lg">
            <Link to={ROUTES.leads}>Ver leads</Link>
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Leads activos" value={isLoading ? "…" : stats.activeLeads} icon={Users} accent />
        <KpiCard label="Vehículos disponibles" value={isLoading ? "…" : stats.availableVehicles} icon={Car} />
        <KpiCard label="Cotizaciones del mes" value={isLoading ? "…" : stats.quotationsMonth} icon={FileText} />
        <KpiCard label="Test drives pendientes" value={isLoading ? "…" : stats.pendingTestDrives} icon={Calendar} />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-xl p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">Embudo de leads</h2>
              <p className="text-xs text-muted-foreground">
                Distribución por estado
                {snapshot && ` · Conversión ${snapshot.conversionRate.toFixed(1)}%`}
              </p>
            </div>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>

          {isLoading ? (
            <div className="grid place-items-center py-10 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {pipeline.map((row) => (
              <div key={row.status} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground/80">{LEAD_STATUS_LABEL[row.status]}</span>
                  <span className="tabular-nums text-muted-foreground">{row.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-gradient-gold transition-all"
                    style={{ width: `${row.percent}%` }}
                  />
                </div>
              </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-xl p-5">
          <div className="mb-4">
            <h2 className="font-display text-lg font-semibold">Actividad reciente</h2>
            <p className="text-xs text-muted-foreground">Últimas acciones del equipo</p>
          </div>
          <ul className="space-y-3 scrollbar-thin max-h-[360px] overflow-y-auto pr-1">
            {activities.slice(0, 12).map((a) => {
              const member = memberById(a.actorId);
              return (
                <li key={a.id} className="flex items-start gap-3">
                  <Avatar name={member?.fullName ?? "Sistema"} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">{a.message}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {member?.fullName ?? "Sistema"} · {formatRelative(a.createdAt)}
                    </p>
                  </div>
                </li>
              );
            })}
            {activities.length === 0 && (
              <li className="text-sm text-muted-foreground">Sin actividad por ahora.</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
};
