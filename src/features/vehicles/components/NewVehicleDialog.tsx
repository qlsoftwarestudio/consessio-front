import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BRANDS, VEHICLE_STATUSES, VEHICLE_STATUS_LABEL } from "@/shared/constants/domain";
import { toast } from "@/hooks/use-toast";
import type { VehicleCondition, VehicleStatus } from "@/shared/types/domain";
import { useCreateVehicle } from "../hooks/use-vehicles";

export const NewVehicleDialog = () => {
  const [open, setOpen] = useState(false);
  const createVehicle = useCreateVehicle();
  const [brand, setBrand] = useState<string>(BRANDS[0]);
  const [model, setModel] = useState("");
  const [version, setVersion] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [km, setKm] = useState(0);
  const [condition, setCondition] = useState<VehicleCondition>("0km");
  const [priceStr, setPriceStr] = useState("0");
  const [status, setStatus] = useState<VehicleStatus>("disponible");
  const [color, setColor] = useState("");
  const [stockCode, setStockCode] = useState("");

  const price = Number(priceStr) || 0;

  const reset = () => {
    setBrand(BRANDS[0]);
    setModel("");
    setVersion("");
    setYear(new Date().getFullYear());
    setKm(0);
    setCondition("0km");
    setPriceStr("0");
    setStatus("disponible");
    setColor("");
    setStockCode("");
  };

  const submit = async () => {
    if (!model.trim() || price <= 0) {
      toast({ title: "Completá modelo y precio", variant: "destructive" });
      return;
    }
    try {
      await createVehicle.mutateAsync({
        vin: stockCode.trim() || `${brand.slice(0, 2).toUpperCase()}-${Date.now().toString(36)}`,
        brand,
        model,
        year,
        color: color || "—",
        priceArs: price,
        status,
        branch: undefined,
      });
      toast({ title: "Vehículo agregado al stock" });
      setOpen(false);
      reset();
    } catch {
      /* error toast disparado por http-client */
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-gold text-primary-foreground shadow-amber hover:shadow-amber-lg">
          <Plus className="mr-1 h-4 w-4" /> Nuevo vehículo
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-strong sm:max-w-2xl">
        <DialogHeader><DialogTitle className="font-display">Nuevo vehículo</DialogTitle></DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label>Marca</Label>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger className="bg-surface-1/60"><SelectValue /></SelectTrigger>
              <SelectContent>
                {BRANDS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Modelo</Label>
            <Input value={model} onChange={(e) => setModel(e.target.value)} className="bg-surface-1/60" />
          </div>
          <div className="grid gap-1.5">
            <Label>Versión</Label>
            <Input value={version} onChange={(e) => setVersion(e.target.value)} className="bg-surface-1/60" />
          </div>
          <div className="grid gap-1.5">
            <Label>Color</Label>
            <Input value={color} onChange={(e) => setColor(e.target.value)} className="bg-surface-1/60" />
          </div>
          <div className="grid gap-1.5">
            <Label>Año</Label>
            <Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="bg-surface-1/60" />
          </div>
          <div className="grid gap-1.5">
            <Label>Km</Label>
            <Input type="number" value={km} onChange={(e) => setKm(Number(e.target.value))} className="bg-surface-1/60" />
          </div>
          <div className="grid gap-1.5">
            <Label>Condición</Label>
            <Select value={condition} onValueChange={(v) => setCondition(v as VehicleCondition)}>
              <SelectTrigger className="bg-surface-1/60"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0km">0km</SelectItem>
                <SelectItem value="usado">Usado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Estado</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as VehicleStatus)}>
              <SelectTrigger className="bg-surface-1/60"><SelectValue /></SelectTrigger>
              <SelectContent>
                {VEHICLE_STATUSES.map((s) => <SelectItem key={s} value={s}>{VEHICLE_STATUS_LABEL[s]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5 col-span-2">
            <Label>Precio (ARS)</Label>
            <Input type="number" value={priceStr} onChange={(e) => setPriceStr(e.target.value)} className="bg-surface-1/60" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={createVehicle.isPending}>Cancelar</Button>
          <Button onClick={submit} disabled={createVehicle.isPending} className="bg-gradient-gold text-primary-foreground shadow-amber">
            {createVehicle.isPending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Plus className="mr-1 h-4 w-4" />}
            Agregar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
