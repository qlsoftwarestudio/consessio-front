import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Lock, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/shared/store/app-store";
import { ROUTES } from "@/shared/constants/domain";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/features/auth/api/auth.service";
import { HttpError } from "@/shared/api/http-client";
import { env } from "@/shared/config/env";

export const LoginPage = () => {
  const navigate = useNavigate();
  const signIn = useAppStore((s) => s.signIn);
  const org = useAppStore((s) => s.organization);
  const [tenantCode, setTenantCode] = useState(env.useMockApi ? "DEMO" : "");
  const [email, setEmail] = useState(env.useMockApi ? "demo@concessio.app" : "");
  const [password, setPassword] = useState(env.useMockApi ? "demo1234" : "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantCode || !email || !password) {
      toast({ title: "Completá código de empresa, email y contraseña", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const session = await authService.login({ tenantCode, email, password });
      signIn(session.email, session.fullName, {
        role: session.role,
        tenantId: session.tenantId,
        userId: session.userId,
      });
      toast({ title: "Bienvenido a Concessio" });
      navigate(org ? ROUTES.dashboard : ROUTES.dashboard);
    } catch (err) {
      const status = err instanceof HttpError ? err.status : 0;
      const description =
        status === 401 || status === 400
          ? "Email, contraseña o código de empresa incorrectos."
          : status === 403
          ? "Tu usuario no tiene acceso a esta cuenta."
          : status === 0
          ? "No se pudo conectar al servidor. Verificá tu conexión."
          : "Algo salió mal. Intentá nuevamente en unos segundos.";
      toast({ title: "No se pudo iniciar sesión", description, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight">Iniciá sesión</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Accedé a tu concesionario en Concessio
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="tenant-code">Código de empresa</Label>
          <div className="relative">
            <Building className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="tenant-code"
              type="text"
              autoComplete="off"
              value={tenantCode}
              onChange={(e) => setTenantCode(e.target.value)}
              className="h-11 bg-surface-1/60 pl-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 bg-surface-1/60 pl-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-surface-1/60 pl-9"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full bg-gradient-gold text-primary-foreground shadow-amber hover:shadow-amber-lg"
        >
          {loading ? "Ingresando…" : "Entrar"}
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        <span>o</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        ¿No tenés cuenta?{" "}
        <Link to={ROUTES.signup} className="font-medium text-primary hover:underline">
          Creá una gratis
        </Link>
      </p>
    </div>
  );
};
