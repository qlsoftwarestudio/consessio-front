import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Loader2, Phone, Search } from "lucide-react";
import { PageHeader } from "@/atomic-design/molecules/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppStore } from "@/shared/store/app-store";
import {
  LEAD_SOURCES,
  LEAD_SOURCE_LABEL,
  LEAD_STATUSES,
  LEAD_STATUS_LABEL,
  ROUTES,
} from "@/shared/constants/domain";
import { LeadStatusBadge } from "@/atomic-design/atoms/LeadStatusBadge";
import { Avatar } from "@/atomic-design/atoms/Avatar";
import { formatPhone, formatRelative } from "@/shared/utils/format";
import { NewLeadDialog } from "../components/NewLeadDialog";
import { ImportLeadsDialog } from "../components/ImportLeadsDialog";
import { EmptyState } from "@/atomic-design/molecules/EmptyState";
import { useLeads } from "../hooks/use-leads";
import type { LeadStatus } from "@/shared/types/domain";
import { useSearchStore } from "@/shared/store/search-store";
import { PaginationBar } from "@/atomic-design/molecules/PaginationBar";
import { useAuth } from "@/shared/auth/useAuth";
import { RoleGate } from "@/shared/auth/RoleGate";
import { useMembers } from "@/features/organization/hooks/use-members";

export const LeadsPage = () => {
  const navigate = useNavigate();
  const { data: membersData } = useMembers();
  const members = membersData ?? [];
  const globalQuery = useSearchStore((s) => s.query);
  const setGlobalQuery = useSearchStore((s) => s.setQuery);
  const { can } = useAuth();
  const onlyMine = !can("seeAllLeads");
  const [q, setQ] = useState(globalQuery);
  const [debouncedQ, setDebouncedQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [source, setSource] = useState<string>("all");
  const [assigned, setAssigned] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // Sincronizar buscador local con el global del header
  useEffect(() => {
    setQ(globalQuery);
  }, [globalQuery]);

  // Debounce buscador 300ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  // Reset paginación al cambiar filtros
  useEffect(() => {
    setPage(0);
  }, [debouncedQ, status, source, assigned]);

  const { data, isLoading, isFetching } = useLeads({
    page,
    size: pageSize,
    query: debouncedQ || undefined,
    status: status !== "all" ? (status as LeadStatus) : undefined,
    onlyMine,
  });

  const items = useMemo(() => {
    let list = data?.items ?? [];
    if (source !== "all") list = list.filter((l) => l.source === source);
    if (assigned !== "all") list = list.filter((l) => l.assignedTo === assigned);
    return list;
  }, [data?.items, source, assigned]);

  const memberById = (id?: string) => members.find((m) => m.id === id);

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle={
          isLoading
            ? "Cargando…"
            : `${items.length} en esta página · ${data?.total ?? 0} en total${
                onlyMine ? " · Mis leads" : ""
              }`
        }
        actions={
          <>
            <RoleGate cap="importLeads">
              <ImportLeadsDialog />
            </RoleGate>
            <RoleGate cap="manageLeads">
              <NewLeadDialog />
            </RoleGate>
          </>
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
            placeholder="Buscar por nombre, teléfono o email"
            className="bg-surface-1/60 pl-9"
          />
          {isFetching && !isLoading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px] bg-surface-1/60">
              <Filter className="mr-1 h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {LEAD_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {LEAD_STATUS_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-[140px] bg-surface-1/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los orígenes</SelectItem>
              {LEAD_SOURCES.map((s) => (
                <SelectItem key={s} value={s}>
                  {LEAD_SOURCE_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={assigned} onValueChange={setAssigned}>
            <SelectTrigger className="w-[160px] bg-surface-1/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los vendedores</SelectItem>
              {members.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="glass grid place-items-center rounded-xl p-12 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="Sin resultados" description="Probá ajustar los filtros o creá un nuevo lead." />
      ) : (
        <>
          <div className="glass overflow-hidden rounded-xl">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead>Lead</TableHead>
                  <TableHead className="hidden sm:table-cell">Estado</TableHead>
                  <TableHead className="hidden md:table-cell">Origen</TableHead>
                  <TableHead className="hidden lg:table-cell">Vendedor</TableHead>
                  <TableHead className="hidden xl:table-cell">Actualizado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((l) => {
                  const seller = memberById(l.assignedTo);
                  return (
                    <TableRow
                      key={l.id}
                      className="cursor-pointer border-border/60"
                      onClick={() => navigate(ROUTES.leadDetail(l.id))}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar name={l.fullName} size="sm" />
                          <div className="min-w-0">
                            <div className="truncate font-medium">{l.fullName}</div>
                            <div className="truncate text-xs text-muted-foreground">{formatPhone(l.phone)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <LeadStatusBadge status={l.status} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {LEAD_SOURCE_LABEL[l.source]}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{seller?.fullName ?? "—"}</TableCell>
                      <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">
                        {formatRelative(l.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`tel:${l.phone}`} onClick={(e) => e.stopPropagation()}>
                            <Phone className="h-4 w-4" />
                          </a>
                        </Button>
                      </TableCell>
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
