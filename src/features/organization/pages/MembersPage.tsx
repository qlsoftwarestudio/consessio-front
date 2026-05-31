import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { PageHeader } from "@/atomic-design/molecules/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar } from "@/atomic-design/atoms/Avatar";
import { toast } from "@/hooks/use-toast";
import { APP_ROLES, ROLE_LABEL, ROLE_TONE, type AppRole } from "@/shared/auth/roles";
import { RoleGate } from "@/shared/auth/RoleGate";
import { useAuth } from "@/shared/auth/useAuth";
import { useUsers, useCreateUser } from "@/features/organization/hooks/use-users";
import { env } from "@/shared/config/env";

const InviteDialog = () => {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AppRole>("VENDEDORA");
  const createUser = useCreateUser();

  const submit = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      toast({ title: "Completá todos los campos obligatorios", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "La contraseña debe tener al menos 6 caracteres", variant: "destructive" });
      return;
    }
    createUser.mutate(
      {
        name: firstName.trim(),
        lastname: lastName.trim(),
        email: email.trim(),
        password,
        role,
        isActive: true,
      },
      {
        onSuccess: () => {
          toast({ title: "Usuario creado", description: email });
          setOpen(false);
          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");
          setRole("VENDEDORA");
        },
      }
    );
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
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5"><Label>Nombre</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-surface-1/60" />
            </div>
            <div className="grid gap-1.5"><Label>Apellido</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-surface-1/60" />
            </div>
          </div>
          <div className="grid gap-1.5"><Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-surface-1/60" />
          </div>
          <div className="grid gap-1.5"><Label>Contraseña</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-surface-1/60" />
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
          <Button onClick={submit} disabled={createUser.isPending} className="bg-gradient-gold text-primary-foreground shadow-amber">
            {createUser.isPending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
            Invitar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const MembersPage = () => {
  const { data, isLoading } = useUsers({ page: 0, size: 50 });
  const { can } = useAuth();

  const members = data?.items ?? [];

  return (
    <div>
      <PageHeader
        title="Usuarios"
        subtitle={`${members.length} miembros${!can("manageUsers") ? " · Modo lectura" : ""}`}
        actions={
          <RoleGate cap="manageUsers">
            <InviteDialog />
          </RoleGate>
        }
      />

      <div className="glass overflow-hidden rounded-xl">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Cargando usuarios…</div>
        ) : (
          <ul className="divide-y divide-border/60">
            {members.map((m) => (
              <li key={m.id} className="flex items-center gap-4 p-4 hover:bg-surface-1/40">
                <Avatar name={m.fullName} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{m.fullName}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                </div>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${ROLE_TONE[m.role as AppRole]}`}>
                  {ROLE_LABEL[m.role as AppRole]}
                </span>
              </li>
            ))}
            {members.length === 0 && (
              <li className="p-8 text-center text-sm text-muted-foreground">No hay usuarios registrados.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
