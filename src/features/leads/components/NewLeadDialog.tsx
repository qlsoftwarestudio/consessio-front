import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { LEAD_SOURCES, LEAD_SOURCE_LABEL } from "@/shared/constants/domain";
import { useAppStore } from "@/shared/store/app-store";
import { toast } from "@/hooks/use-toast";
import type { LeadSource } from "@/shared/types/domain";
import { useCreateLead } from "../hooks/use-leads";

interface Props {
  trigger?: React.ReactNode;
  onCreated?: (id: string) => void;
}

export const NewLeadDialog = ({ trigger, onCreated }: Props) => {
  const [open, setOpen] = useState(false);
  const members = useAppStore((s) => s.members);
  const createLead = useCreateLead();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState<LeadSource>("web");
  const [notes, setNotes] = useState("");
  const [assignedTo, setAssignedTo] = useState<string | undefined>();

  const reset = () => {
    setFullName(""); setPhone(""); setEmail(""); setSource("web");
    setNotes(""); setAssignedTo(undefined);
  };

  const submit = async () => {
    if (!fullName.trim() || !phone.trim()) {
      toast({ title: "Nombre y teléfono son obligatorios", variant: "destructive" });
      return;
    }
    try {
      const lead = await createLead.mutateAsync({
        fullName,
        phone,
        email: email || undefined,
        source,
        notes: notes || undefined,
        assignedTo,
      });
      toast({ title: "Lead creado", description: lead.fullName });
      onCreated?.(lead.id);
      reset();
      setOpen(false);
    } catch {
      // toast ya disparado por http-client
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="bg-gradient-gold text-primary-foreground shadow-amber hover:shadow-amber-lg">
            <Plus className="mr-1 h-4 w-4" /> Nuevo lead
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="glass-strong sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Nuevo lead</DialogTitle>
          <DialogDescription>Cargá los datos del interesado</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="ln">Nombre completo</Label>
            <Input id="ln" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-surface-1/60" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="lp">Teléfono</Label>
              <Input id="lp" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-surface-1/60" placeholder="11..." />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="le">Email</Label>
              <Input id="le" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-surface-1/60" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Origen</Label>
              <Select value={source} onValueChange={(v) => setSource(v as LeadSource)}>
                <SelectTrigger className="bg-surface-1/60"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LEAD_SOURCES.map((s) => (
                    <SelectItem key={s} value={s}>{LEAD_SOURCE_LABEL[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Asignar a</Label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger className="bg-surface-1/60"><SelectValue placeholder="Vendedor" /></SelectTrigger>
                <SelectContent>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.fullName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="nt">Notas</Label>
            <Input id="nt" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Vehículo de interés, comentarios…" className="bg-surface-1/60" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button
            onClick={submit}
            disabled={createLead.isPending}
            className="bg-gradient-gold text-primary-foreground shadow-amber"
          >
            {createLead.isPending ? "Creando…" : "Crear lead"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
