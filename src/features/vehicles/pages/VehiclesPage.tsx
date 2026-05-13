import { useEffect, useMemo, useState } from "react";
import { Car, Grid3x3, List, Loader2, Search } from "lucide-react";
import { PageHeader } from "@/atomic-design/molecules/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BRANDS, VEHICLE_STATUSES, VEHICLE_STATUS_LABEL } from "@/shared/constants/domain";
import { VehicleStatusBadge } from "@/atomic-design/atoms/VehicleStatusBadge";
import { Price } from "@/atomic-design/atoms/Price";
import { NewVehicleDialog } from "../components/NewVehicleDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/shared/utils/format";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/atomic-design/molecules/EmptyState";
import { useVehicles } from "../hooks/use-vehicles";
import { useSearchStore } from "@/shared/store/search-store";
import type { VehicleStatus } from "@/shared/types/domain";
import { PaginationBar } from "@/atomic-design/molecules/PaginationBar";
import { useAuth } from "@/shared/auth/useAuth";
import { RoleGate } from "@/shared/auth/RoleGate";
import { useReserveVehicle, useSellVehicle } from "../hooks/use-vehicles";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckCircle2, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatARS } from "@/shared/utils/format";

export const VehiclesPage = () => {
  const [view, setView] = useState<"grid" | "table">("grid");
  const { can } = useAuth();
  const globalQuery = useSearchStore((s) => s.query);
  const setGlobalQuery = useSearchStore((s) => s.setQuery);
  const [q, setQ] = useState(globalQuery);
  const [debouncedQ, setDebouncedQ] = useState("");
  const [brand, setBrand] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(24);

  // Sync con el header global
  useEffect(() => {
    setQ(globalQuery);
  }, [globalQuery]);

  // Debounce 300ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  // Reset paginación al cambiar filtros
  useEffect(() => {
    setPage(0);
  }, [debouncedQ, brand, status]);

  const { data, isLoading, isFetching } = useVehicles({
    page,
    size: pageSize,
    query: debouncedQ || undefined,
    status: status !== "all" ? (status as VehicleStatus) : undefined,
  });

  // Filtros aún no soportados por API → en memoria sobre la página
  const items = useMemo(() => {
    let list = data?.items ?? [];
    if (brand !== "all") list = list.filter((v) => v.brand === brand);
    return list;
  }, [data?.items, brand]);

  return (
    <div>
      <PageHeader
        title="Vehículos"
        subtitle={
          isLoading
            ? "Cargando…"
            : `${items.length} en esta página · ${data?.total ?? 0} en stock`
        }
        actions={
          <RoleGate cap="manageVehicles">
            <NewVehicleDialog />
          </RoleGate>
        }
      />

      <div className="glass mb-4 flex flex-col gap-3 rounded-xl p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setGlobalQuery(e.target.value);
            }}
            placeholder="Marca, modelo o stock"
            className="bg-surface-1/60 pl-9"
          />
          {isFetching && !isLoading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger className="w-[140px] bg-surface-1/60"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las marcas</SelectItem>
              {BRANDS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px] bg-surface-1/60"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {VEHICLE_STATUSES.map((s) => <SelectItem key={s} value={s}>{VEHICLE_STATUS_LABEL[s]}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex rounded-md border border-border/60 bg-surface-1/60 p-0.5">
            <button onClick={() => setView("grid")} className={cn("grid h-8 w-8 place-items-center rounded transition-colors", view === "grid" && "bg-primary/15 text-primary")}>
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button onClick={() => setView("table")} className={cn("grid h-8 w-8 place-items-center rounded transition-colors", view === "table" && "bg-primary/15 text-primary")}>
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="glass grid place-items-center rounded-xl p-12 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={Car} title="Sin vehículos" description="Ajustá los filtros o agregá uno nuevo." />
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((v) => (
            <article key={v.id} className="glass group overflow-hidden rounded-xl transition-all hover:border-primary/40 hover:shadow-amber">
              <div className="relative aspect-video bg-gradient-to-br from-surface-2 to-surface-3">
                <div className="absolute inset-0 grid place-items-center">
                  <Car className="h-16 w-16 text-foreground/10" strokeWidth={1.2} />
                </div>
                <div className="absolute left-3 top-3"><VehicleStatusBadge status={v.status} /></div>
                <div className="absolute right-3 top-3 rounded-md bg-background/70 px-2 py-0.5 text-[10px] uppercase tracking-wider backdrop-blur">
                  {v.condition}
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{v.brand}</p>
                <h3 className="font-display text-base font-semibold leading-tight">{v.model}</h3>
                {v.version && <p className="text-xs text-muted-foreground">{v.version}</p>}
                <div className="mt-3 flex items-end justify-between">
                  <Price amount={v.priceArs} size="lg" className="text-gradient-gold" />
                  <div className="text-right text-[11px] text-muted-foreground">
                    <p>{v.year} · {formatNumber(v.km)} km</p>
                    <p className="font-mono">{v.stockCode}</p>
                  </div>
                </div>
                {can("changeVehicleStock") && v.status !== "vendido" && (
                  <div className="mt-3 flex gap-2 border-t border-border/40 pt-3">
                    <StockActions vehicleId={v.id} status={v.status} />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="glass overflow-hidden rounded-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehículo</TableHead>
                <TableHead className="hidden sm:table-cell">Año / Km</TableHead>
                <TableHead className="hidden md:table-cell">Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                {can("changeVehicleStock") && <TableHead className="text-right">Stock</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <div className="font-medium">{v.brand} {v.model}</div>
                    <div className="text-xs text-muted-foreground">{v.version} · {v.color}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{v.year} · {formatNumber(v.km)} km</TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-xs">{v.stockCode}</TableCell>
                  <TableCell><VehicleStatusBadge status={v.status} /></TableCell>
                  <TableCell className="text-right"><Price amount={v.priceArs} /></TableCell>
                  {can("changeVehicleStock") && (
                    <TableCell className="text-right">
                      {v.status !== "vendido" ? (
                        <div className="inline-flex gap-1">
                          <StockActions vehicleId={v.id} status={v.status} compact />
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {data && (
        <PaginationBar
          page={page}
          totalPages={data.totalPages}
          total={data.total}
          size={pageSize}
          pageSizeOptions={[12, 24, 48, 96]}
          onPageChange={setPage}
          onSizeChange={(s) => {
            setPageSize(s);
            setPage(0);
          }}
          isFetching={isFetching}
        />
      )}
    </div>
  );
};

// ===== Stock actions (Reservar / Vender) con confirmación =====
const StockActions = ({
  vehicleId,
  status,
  compact,
}: {
  vehicleId: string;
  status: VehicleStatus;
  compact?: boolean;
}) => {
  const reserve = useReserveVehicle();
  const sell = useSellVehicle();
  const btnSize = compact ? "sm" : "sm";
  return (
    <>
      {status === "disponible" && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size={btnSize} variant="outline" className="flex-1">
              <Lock className="mr-1 h-3.5 w-3.5" />
              Reservar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="glass-strong">
            <AlertDialogHeader>
              <AlertDialogTitle>Reservar vehículo</AlertDialogTitle>
              <AlertDialogDescription>
                Marcará la unidad como reservada. Solo Admin/Gerente o el vendedor pueden volver al estado disponible desde el backend.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  try {
                    await reserve.mutateAsync(vehicleId);
                    toast({ title: "Vehículo reservado" });
                  } catch {
                    /* toast en http-client */
                  }
                }}
              >
                Confirmar reserva
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size={btnSize}
            className="flex-1 bg-gradient-gold text-primary-foreground shadow-amber"
          >
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
            Vender
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="glass-strong">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar venta</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción marcará el vehículo como vendido y lo retirará del stock disponible.
              No se puede deshacer desde la UI.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  await sell.mutateAsync(vehicleId);
                  toast({ title: "Venta registrada", description: formatARS(0).replace("0", "✓") });
                } catch {
                  /* toast en http-client */
                }
              }}
            >
              Confirmar venta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
