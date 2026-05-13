import { useMemo, useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";
import { PageHeader } from "@/atomic-design/molecules/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/shared/store/app-store";
import { formatDateTime } from "@/shared/utils/format";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { RoleGate } from "@/shared/auth/RoleGate";
import { useCreateTestDrive, useTestDrives } from "../hooks/use-test-drives";

const NewTestDriveDialog = () => {
  const [open, setOpen] = useState(false);
  const leads = useAppStore((s) => s.leads);
  const vehicles = useAppStore((s) => s.vehicles);
  const members = useAppStore((s) => s.members);
  const create = useCreateTestDrive();
  const [leadId, setLeadId] = useState(leads[0]?.id ?? "");
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? "");
  const [sellerId, setSellerId] = useState(members[0]?.id ?? "");
  const [when, setWhen] = useState(() => new Date(Date.now() + 86400_000).toISOString().slice(0, 16));
  const [duration, setDuration] = useState(45);

  const submit = async () => {
    if (!leadId || !vehicleId || !sellerId) return toast({ title: "Completá todos los campos", variant: "destructive" });
    try {
      await create.mutateAsync({
        leadId,
        vehicleId,
        sellerId,
        scheduledAt: new Date(when).toISOString(),
        durationMin: duration,
      });
      toast({ title: "Test drive agendado" });
      setOpen(false);
    } catch {
      /* toast en http-client */
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-gold text-primary-foreground shadow-amber hover:shadow-amber-lg">
          <Plus className="mr-1 h-4 w-4" /> Agendar
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-strong sm:max-w-lg">
        <DialogHeader><DialogTitle className="font-display">Nuevo test drive</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5"><Label>Lead</Label>
            <Select value={leadId} onValueChange={setLeadId}>
              <SelectTrigger className="bg-surface-1/60"><SelectValue /></SelectTrigger>
              <SelectContent>{leads.map((l) => <SelectItem key={l.id} value={l.id}>{l.fullName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5"><Label>Vehículo</Label>
            <Select value={vehicleId} onValueChange={setVehicleId}>
              <SelectTrigger className="bg-surface-1/60"><SelectValue /></SelectTrigger>
              <SelectContent>{vehicles.map((v) => <SelectItem key={v.id} value={v.id}>{v.brand} {v.model}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5"><Label>Vendedor</Label>
            <Select value={sellerId} onValueChange={setSellerId}>
              <SelectTrigger className="bg-surface-1/60"><SelectValue /></SelectTrigger>
              <SelectContent>{members.map((m) => <SelectItem key={m.id} value={m.id}>{m.fullName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5"><Label>Fecha y hora</Label>
              <Input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className="bg-surface-1/60" />
            </div>
            <div className="grid gap-1.5"><Label>Duración (min)</Label>
              <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="bg-surface-1/60" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={submit} className="bg-gradient-gold text-primary-foreground shadow-amber">Agendar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const TestDrivesPage = () => {
  const { data: testDrives = [], isLoading } = useTestDrives();
  const leads = useAppStore((s) => s.leads);
  const vehicles = useAppStore((s) => s.vehicles);
  const [cursor, setCursor] = useState(() => {
    const d = new Date(); d.setDate(1); return d;
  });

  const monthLabel = cursor.toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  const days = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startWeekday = (first.getDay() + 6) % 7; // monday=0
    const cells: Array<{ date: Date | null }> = [];
    for (let i = 0; i < startWeekday; i++) cells.push({ date: null });
    for (let d = 1; d <= last.getDate(); d++) cells.push({ date: new Date(year, month, d) });
    while (cells.length % 7 !== 0) cells.push({ date: null });
    return cells;
  }, [cursor]);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const upcoming = useMemo(
    () => testDrives
      .filter((t) => new Date(t.scheduledAt) >= new Date())
      .sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt)),
    [testDrives],
  );

  return (
    <div>
      <PageHeader
        title="Test drives"
        subtitle="Agenda y próximos turnos"
        actions={
          <RoleGate cap="createTestDrive">
            <NewTestDriveDialog />
          </RoleGate>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-xl p-4 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold capitalize">{monthLabel}</h2>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
            {["Lu","Ma","Mi","Ju","Vi","Sá","Do"].map((d) => <div key={d} className="py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((cell, i) => {
              if (!cell.date) return <div key={i} className="aspect-square rounded-md bg-transparent" />;
              const dayDrives = testDrives.filter((t) => sameDay(new Date(t.scheduledAt), cell.date!));
              const isToday = sameDay(cell.date, new Date());
              return (
                <div
                  key={i}
                  className={cn(
                    "relative aspect-square rounded-md border border-border/50 bg-surface-1/40 p-1 text-left text-[11px] transition-colors hover:border-primary/40",
                    isToday && "border-primary/60 bg-primary/10",
                  )}
                >
                  <span className={cn("font-medium", isToday && "text-primary")}>{cell.date.getDate()}</span>
                  {dayDrives.length > 0 && (
                    <span className="absolute bottom-1 left-1 right-1 truncate rounded bg-gradient-gold px-1 py-0.5 text-[9px] font-semibold text-primary-foreground">
                      {dayDrives.length} TD
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass rounded-xl p-4">
          <h2 className="mb-3 font-display text-lg font-semibold">Próximos</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin turnos próximos.</p>
          ) : (
            <ul className="space-y-3 scrollbar-thin max-h-[420px] overflow-y-auto">
              {upcoming.map((t) => {
                const lead = leads.find((l) => l.id === t.leadId);
                const veh = vehicles.find((v) => v.id === t.vehicleId);
                return (
                  <li key={t.id} className="rounded-lg border border-border/60 bg-surface-1/50 p-3">
                    <div className="flex items-center gap-2 text-xs text-primary">
                      <CalendarIcon className="h-3.5 w-3.5" /> {formatDateTime(t.scheduledAt)}
                    </div>
                    <p className="mt-1 text-sm font-medium">{lead?.fullName ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{veh ? `${veh.brand} ${veh.model}` : "—"} · {t.durationMin} min</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
