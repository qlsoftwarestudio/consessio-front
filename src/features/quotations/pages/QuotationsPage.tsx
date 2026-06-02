import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Loader2, Plus } from "lucide-react";
import { PageHeader } from "@/atomic-design/molecules/PageHeader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QUOTATION_TYPE_LABEL, ROUTES } from "@/shared/constants/domain";
import { Price } from "@/atomic-design/atoms/Price";
import { formatDate } from "@/shared/utils/format";
import { EmptyState } from "@/atomic-design/molecules/EmptyState";
import { cn } from "@/lib/utils";
import { useQuotations } from "../hooks/use-quotations";
import { useSearchStore } from "@/shared/store/search-store";
import { PaginationBar } from "@/atomic-design/molecules/PaginationBar";
import { RoleGate } from "@/shared/auth/RoleGate";
import { useLeads } from "@/features/leads/hooks/use-leads";
import { useVehicles } from "@/features/vehicles/hooks/use-vehicles";

const STATUS_CLASS: Record<string, string> = {
  borrador: "bg-muted text-muted-foreground ring-border",
  enviada: "bg-info/15 text-info ring-info/30",
  aceptada: "bg-success/15 text-success ring-success/30",
  rechazada: "bg-destructive/15 text-destructive ring-destructive/30",
};

export const QuotationsPage = () => {
  const { data: leadsData } = useLeads();
  const { data: vehiclesData } = useVehicles();
  const leads = leadsData?.items ?? [];
  const vehicles = vehiclesData?.items ?? [];
  const globalQuery = useSearchStore((s) => s.query);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const { data, isLoading, isFetching } = useQuotations(page, pageSize);

  // Filtro client-side sobre la página actual (la API no expone /search para cotizaciones)
  const items = useMemo(() => {
    const list = data?.items ?? [];
    if (!globalQuery) return list;
    const t = globalQuery.toLowerCase();
    return list.filter((q) => {
      const lead = leads.find((l) => l.id === q.leadId);
      const veh = vehicles.find((v) => v.id === q.vehicleId);
      return (
        lead?.fullName.toLowerCase().includes(t) ||
        veh?.brand.toLowerCase().includes(t) ||
        veh?.model.toLowerCase().includes(t)
      );
    });
  }, [data?.items, globalQuery, leads, vehicles]);

  useEffect(() => {
    setPage(0);
  }, [globalQuery]);

  return (
    <div>
      <PageHeader
        title="Cotizaciones"
        subtitle={
          isLoading
            ? "Cargando…"
            : `${items.length} en esta página · ${data?.total ?? 0} en total`
        }
        actions={
          <RoleGate cap="createQuotation">
            <Button asChild className="bg-gradient-gold text-primary-foreground shadow-amber hover:shadow-amber-lg">
              <Link to={ROUTES.newQuotation}><Plus className="mr-1 h-4 w-4" /> Nueva cotización</Link>
            </Button>
          </RoleGate>
        }
      />

      {isLoading ? (
        <div className="glass grid place-items-center rounded-xl p-12 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Aún no hay cotizaciones"
          description="Generá tu primera cotización para un lead."
          action={
            <RoleGate cap="createQuotation">
              <Button asChild className="bg-gradient-gold text-primary-foreground shadow-amber">
                <Link to={ROUTES.newQuotation}>Crear ahora</Link>
              </Button>
            </RoleGate>
          }
        />
      ) : (
        <>
          <div className="glass overflow-hidden rounded-xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead className="hidden md:table-cell">Vehículo</TableHead>
                  <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                  <TableHead className="hidden lg:table-cell">Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((q) => {
                  const lead = leads.find((l) => l.id === q.leadId);
                  const vehicle = vehicles.find((v) => v.id === q.vehicleId);
                  return (
                    <TableRow key={q.id}>
                      <TableCell className="font-medium">{lead?.fullName ?? "—"}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{vehicle ? `${vehicle.brand} ${vehicle.model}` : "—"}</TableCell>
                      <TableCell className="hidden sm:table-cell">{QUOTATION_TYPE_LABEL[q.type]}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{formatDate(q.createdAt)}</TableCell>
                      <TableCell>
                        <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize", STATUS_CLASS[q.status])}>
                          {q.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right"><Price amount={q.totalArs} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {data && (
            <PaginationBar
              page={page}
              totalPages={data.totalPages}
              total={data.total}
              size={pageSize}
              onPageChange={setPage}
              onSizeChange={(s) => {
                setPageSize(s);
                setPage(0);
              }}
              isFetching={isFetching}
            />
          )}
        </>
      )}
    </div>
  );
};
