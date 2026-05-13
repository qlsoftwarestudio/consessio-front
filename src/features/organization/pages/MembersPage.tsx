import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/atomic-design/molecules/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar } from "@/atomic-design/atoms/Avatar";
import { useAppStore } from "@/shared/store/app-store";
import { toast } from "@/hooks/use-toast";
import { APP_ROLES, ROLE_LABEL, ROLE_TONE, type AppRole } from "@/shared/auth/roles";
import { RoleGate } from "@/shared/auth/RoleGate";
import { useAuth } from "@/shared/auth/useAuth";

/** Mapea el rol legacy del mock (owner/manager/seller) al modelo nuevo. */
const legacyToAppRole = (r: string | undefined): AppRole => {
  switch (r) {
    case "owner": return "ADMIN";
    case "manager": return "GERENTE";
    case "seller": return "VENDEDOR";
    default: return (APP_ROLES as readonly string[]).includes(r ?? "") ? (r as AppRole) : "VENDEDOR";
  }
};

const InviteDialog = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AppRole>("VENDEDOR");
  const addMember = useAppStore((s) => s.addMember);

  const submit = () => {
    if (!name.trim() || !email.trim()) return toast({ title: "Completá nombre y email", variant: "destructive" });
    // El mock guarda el rol legacy; en producción debe ir al endpoint /api/users.
    const legacy =
      role === "ADMIN" ? "owner" : role === "GERENTE" ? "manager" : "seller";
    addMember({ fullName: name, email, role: legacy as never });
    toast({ title: "Miembro invitado", description: email });
    setOpen(false); setName(""); setEmail(""); setRole("VENDEDOR");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-gold text-primary-foreground shadow-amber hover:shadow-amber-lg">
          <Plus className="mr-1 h-4 w-4" /> Invitar miembro
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-strong sm:max-w-md">
        <DialogHeader><DialogTitle className="font-display">Invitar miembro</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5"><Label>Nombre</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-surface-1/60" />
          </div>
          <div className="grid gap-1.5"><Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-surface-1/60" />
          </div>
          <div className="grid gap-1.5"><Label>Rol</Label>
            <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
              <SelectTrigger className="bg-surface-1/60"><SelectValue /></SelectTrigger>
              <SelectContent>
                {APP_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={submit} className="bg-gradient-gold text-primary-foreground shadow-amber">Invitar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const MembersPage = () => {
  const members = useAppStore((s) => s.members);
  const org = useAppStore((s) => s.organization);
  const { can } = useAuth();

  return (
    <div>
      <PageHeader
        title="Usuarios"
        subtitle={`${members.length} miembros en ${org?.name}${
          !can("manageUsers") ? " · Modo lectura" : ""
        }`}
        actions={
          <RoleGate cap="manageUsers">
            <InviteDialog />
          </RoleGate>
        }
      />

      <div className="glass overflow-hidden rounded-xl">
        <ul className="divide-y divide-border/60">
          {members.map((m) => {
            const role = legacyToAppRole(m.role as unknown as string);
            return (
              <li key={m.id} className="flex items-center gap-4 p-4 hover:bg-surface-1/40">
                <Avatar name={m.fullName} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{m.fullName}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                </div>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${ROLE_TONE[role]}`}>
                  {ROLE_LABEL[role]}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
