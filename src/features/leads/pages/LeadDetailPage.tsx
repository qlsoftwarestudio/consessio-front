import { useMemo } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, FileText, Mail, MessageCircle, Phone } from "lucide-react";
import { PageHeader } from "@/atomic-design/molecules/PageHeader";
import { Avatar } from "@/atomic-design/atoms/Avatar";
import { LeadStatusBadge } from "@/atomic-design/atoms/LeadStatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LEAD_SOURCE_LABEL,
  LEAD_STATUSES,
  LEAD_STATUS_LABEL,
  QUOTATION_TYPE_LABEL,
  ROUTES,
} from "@/shared/constants/domain";
import { formatARS, formatDateTime, formatPhone, formatRelative } from "@/shared/utils/format";
import type { LeadStatus } from "@/shared/types/domain";
import { useAuth } from "@/shared/auth/useAuth";
import { RoleGate } from "@/shared/auth/RoleGate";
import { useAppStore } from "@/shared/store/app-store";
import { useMembers } from "@/features/organization/hooks/use-members";
import { useLead, useSetLeadStatus } from "@/features/leads/hooks/use-leads";
import { useVehicles } from "@/features/vehicles/hooks/use-vehicles";
import { useQuotations } from "@/features/quotations/hooks/use-quotations";
import { useTestDrives } from "@/features/test-drives/hooks/use-test-drives";

export const LeadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { data: lead, isLoading: leadLoading } = useLead(id);
  const { data: vehiclesData } = useVehicles();
  const { data: members = [] } = useMembers();
  const { data: quotationsData } = useQuotations();
  const { data: testDrivesData } = useTestDrives();
  const allActivities = useAppStore((s) => s.activities);
  const activities = useMemo(() => allActivities.filter((a) => a.leadId === id), [allActivities, id]);
  const setLeadStatusMutation = useSetLeadStatus();

  const vehicles = vehiclesData?.items ?? [];
  const quotations = quotationsData?.items?.filter((q) => q.leadId === id) ?? [];
  const testDrives = testDrivesData?.filter((t) => t.leadId === id) ?? [];

  const vehicle = useMemo(() => vehicles.find((v) => v.id === lead?.interestVehicleId), [vehicles, lead]);
  const seller = useMemo(() => members.find((m) => m.id === lead?.assignedTo), [members, lead]);

  if (!lead) return <Navigate to={ROUTES.leads} replace />;

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.leads)} className="mb-3 -ml-2 text-muted-foreground">
        <ArrowLeft className="mr-1 h-4 w-4" /> Volver
      </Button>

      <PageHeader
        title={lead.fullName}
        subtitle={`Lead desde ${LEAD_SOURCE_LABEL[lead.source]} · ${formatRelative(lead.createdAt)}`}
        actions={
          <>
            <Button variant="outline" asChild><a href={`tel:${lead.phone}`}><Phone className="mr-1 h-4 w-4" /> Llamar</a></Button>
            <Button variant="outline"><MessageCircle className="mr-1 h-4 w-4" /> WhatsApp</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-4 lg:col-span-2">
          <div className="glass rounded-xl p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <Avatar name={lead.fullName} size="lg" />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl font-semibold">{lead.fullName}</h2>
                    <LeadStatusBadge status={lead.status} />
                  </div>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" /> {formatPhone(lead.phone)}
                  </p>
                  {lead.email && (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" /> {lead.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {vehicle && (
              <div className="mt-5 rounded-lg border border-border/60 bg-surface-1/50 p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Vehículo de interés</p>
                <p className="mt-1 font-medium">{vehicle.brand} {vehicle.model} {vehicle.version ?? ""}</p>
                <p className="text-sm text-muted-foreground">{formatARS(vehicle.priceArs)} · {vehicle.condition.toUpperCase()} · {vehicle.color}</p>
              </div>
            )}
          </div>

          <Tabs defaultValue="activity" className="glass rounded-xl p-2">
            <TabsList className="bg-surface-2/60">
              <TabsTrigger value="activity">Actividad</TabsTrigger>
              <TabsTrigger value="quotations">Cotizaciones ({quotations.length})</TabsTrigger>
              <TabsTrigger value="testdrives">Test drives ({testDrives.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="p-3">
              {activities.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">Sin actividad registrada.</p>
              ) : (
                <ol className="relative ml-3 space-y-4 border-l border-border/60 pl-6">
                  {activities.map((a) => (
                    <li key={a.id} className="relative">
                      <span className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
                      <p className="text-sm">{a.message}</p>
                      <p className="text-[11px] text-muted-foreground">{formatDateTime(a.createdAt)}</p>
                    </li>
                  ))}
                </ol>
              )}
            </TabsContent>

            <TabsContent value="quotations" className="p-3">
              {quotations.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">Sin cotizaciones todavía.</p>
              ) : (
                <ul className="space-y-2">
                  {quotations.map((q) => (
                    <li key={q.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-surface-1/50 p-3">
                      <div>
                        <p className="text-sm font-medium">{QUOTATION_TYPE_LABEL[q.type]}</p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(q.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatARS(q.totalArs)}</p>
                        <p className="text-xs text-muted-foreground capitalize">{q.status}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="testdrives" className="p-3">
              {testDrives.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">Sin test drives.</p>
              ) : (
                <ul className="space-y-2">
                  {testDrives.map((t) => (
                    <li key={t.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-surface-1/50 p-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{formatDateTime(t.scheduledAt)}</p>
                          <p className="text-xs text-muted-foreground">{t.durationMin} min · {t.status}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar actions */}
        <aside className="space-y-4">
          <div className="glass rounded-xl p-5">
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Acciones rápidas
            </h3>
            <div className="space-y-2">
              <RoleGate
                cap="createQuotation"
                fallback={
                  <p className="rounded-md border border-dashed border-border/50 p-2 text-xs text-muted-foreground">
                    No tenés permisos para crear cotizaciones.
                  </p>
                }
              >
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to={`${ROUTES.newQuotation}?leadId=${lead.id}`}>
                    <FileText className="mr-2 h-4 w-4" /> Nueva cotización
                  </Link>
                </Button>
              </RoleGate>
              <RoleGate cap="createTestDrive">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to={ROUTES.testDrives}>
                    <Calendar className="mr-2 h-4 w-4" /> Agendar test drive
                  </Link>
                </Button>
              </RoleGate>
            </div>
          </div>

          <div className="glass rounded-xl p-5">
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Estado
            </h3>
            <Select
              value={lead.status}
              onValueChange={(v) => setLeadStatusMutation.mutate({ id: lead.id, status: v as LeadStatus })}
              disabled={!can("manageLeads")}
            >
              <SelectTrigger className="bg-surface-1/60"><SelectValue /></SelectTrigger>
              <SelectContent>
                {LEAD_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{LEAD_STATUS_LABEL[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <h3 className="mb-2 mt-5 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Asignado a
            </h3>
            <div className="flex items-center gap-2">
              <Avatar name={seller?.fullName ?? "?"} size="sm" />
              <div>
                <p className="text-sm font-medium">{seller?.fullName ?? "Sin asignar"}</p>
                {seller && <p className="text-xs text-muted-foreground">{seller.email}</p>}
              </div>
            </div>
            {!can("reassignLeads") && (
              <p className="mt-2 text-[11px] text-muted-foreground">
                Solo Admin/Gerente pueden reasignar leads.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
