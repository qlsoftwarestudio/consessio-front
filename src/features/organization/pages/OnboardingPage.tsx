import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/atomic-design/atoms/Logo";
import { ROUTES } from "@/shared/constants/domain";
import { useAppStore } from "@/shared/store/app-store";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Building2, Check, Loader2, ShieldCheck, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { env } from "@/shared/config/env";
import { authService } from "@/features/auth/api/auth.service";

type Step = 1 | 2 | 3;

interface FormData {
  businessName: string;
  cuit: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const STEPS: { id: Step; label: string; icon: typeof Building2 }[] = [
  { id: 1, label: "Empresa", icon: Building2 },
  { id: 2, label: "Administrador", icon: User },
  { id: 3, label: "Confirmación", icon: ShieldCheck },
];

const formatCuit = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 10) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10)}`;
};

const isValidCuit = (cuit: string) => cuit.replace(/\D/g, "").length === 11;
const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export const OnboardingPage = () => {
  const user = useAppStore((s) => s.user);
  const org = useAppStore((s) => s.organization);
  const createOrganization = useAppStore((s) => s.createOrganization);
  const signIn = useAppStore((s) => s.signIn);
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FormData>({
    businessName: "",
    cuit: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  if (org && user) return <Navigate to={ROUTES.dashboard} replace />;

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const validateStep1 = () => {
    if (!data.businessName.trim()) {
      toast({ title: "Ingresá el nombre de la empresa", variant: "destructive" });
      return false;
    }
    if (!isValidCuit(data.cuit)) {
      toast({ title: "CUIT inválido", description: "Debe tener 11 dígitos.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!data.firstName.trim() || !data.lastName.trim()) {
      toast({ title: "Ingresá nombre y apellido", variant: "destructive" });
      return false;
    }
    if (!isValidEmail(data.email)) {
      toast({ title: "Email inválido", variant: "destructive" });
      return false;
    }
    if (data.password.length < 6) {
      toast({ title: "Contraseña muy corta", description: "Mínimo 6 caracteres.", variant: "destructive" });
      return false;
    }
    if (data.password !== data.confirmPassword) {
      toast({ title: "Las contraseñas no coinciden", variant: "destructive" });
      return false;
    }
    return true;
  };

  const next = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => (s + 1) as Step);
  };

  const back = () => setStep((s) => Math.max(1, s - 1) as Step);

  const submit = async () => {
    setLoading(true);
    try {
      if (!env.useMockApi) {
        const session = await authService.onboarding({
          businessName: data.businessName.trim(),
          adminName: data.firstName.trim(),
          adminLastname: data.lastName.trim(),
          adminEmail: data.email.trim(),
          password: data.password,
        });
        signIn(session.email, session.fullName, {
          role: session.role,
          tenantId: session.tenantId,
          userId: session.userId,
        });
      } else {
        signIn(data.email.trim(), `${data.firstName} ${data.lastName}`.trim());
      }
      createOrganization(data.businessName.trim(), []);
      toast({
        title: `¡${data.businessName} listo!`,
        description: "Tu concesionario fue creado exitosamente.",
      });
      navigate(ROUTES.dashboard);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial" />
      <div className="relative z-10 w-full max-w-2xl animate-fade-in-up">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="glass-strong rounded-2xl p-6 sm:p-8">
          {/* Stepper */}
          <div className="mb-8 flex items-center justify-between gap-2">
            {STEPS.map((s, idx) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isDone = step > s.id;
              return (
                <div key={s.id} className="flex flex-1 items-center gap-2">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                        isActive && "border-primary bg-primary/10 text-primary shadow-amber",
                        isDone && "border-primary bg-primary text-primary-foreground",
                        !isActive && !isDone && "border-border bg-surface-1 text-muted-foreground",
                      )}
                    >
                      {isDone ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <span
                      className={cn(
                        "text-[11px] font-medium uppercase tracking-wider",
                        isActive ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "mb-5 h-0.5 flex-1 rounded transition-all",
                        step > s.id ? "bg-primary" : "bg-border",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step content */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h1 className="font-display text-2xl font-bold tracking-tight">Datos de la empresa</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Empezá contándonos sobre tu concesionario.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="business-name">Nombre de la empresa</Label>
                <Input
                  id="business-name"
                  placeholder="Ej: Automotores del Sur S.A."
                  value={data.businessName}
                  onChange={(e) => update("businessName", e.target.value)}
                  className="h-11 bg-surface-1/60"
                  maxLength={120}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cuit">CUIT</Label>
                <Input
                  id="cuit"
                  placeholder="30-12345678-9"
                  value={data.cuit}
                  onChange={(e) => update("cuit", formatCuit(e.target.value))}
                  className="h-11 bg-surface-1/60"
                  inputMode="numeric"
                />
                <p className="text-xs text-muted-foreground">11 dígitos. Lo usamos para identificar tu organización.</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h1 className="font-display text-2xl font-bold tracking-tight">Tu cuenta de administrador</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Vas a poder invitar a tu equipo más tarde.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="first-name">Nombre</Label>
                  <Input
                    id="first-name"
                    value={data.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    className="h-11 bg-surface-1/60"
                    maxLength={60}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last-name">Apellido</Label>
                  <Input
                    id="last-name"
                    value={data.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    className="h-11 bg-surface-1/60"
                    maxLength={60}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="h-11 bg-surface-1/60"
                  maxLength={120}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => update("password", e.target.value)}
                    className="h-11 bg-surface-1/60"
                    maxLength={120}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={data.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                    className="h-11 bg-surface-1/60"
                    maxLength={120}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h1 className="font-display text-2xl font-bold tracking-tight">Confirmá los datos</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Revisá la información antes de crear tu empresa.
                </p>
              </div>

              <div className="space-y-4">
                <section className="rounded-xl border border-border/60 bg-surface-1/50 p-4">
                  <header className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    Empresa
                  </header>
                  <dl className="grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-xs text-muted-foreground">Nombre</dt>
                      <dd className="font-medium">{data.businessName}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">CUIT</dt>
                      <dd className="font-medium">{data.cuit}</dd>
                    </div>
                  </dl>
                </section>

                <section className="rounded-xl border border-border/60 bg-surface-1/50 p-4">
                  <header className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    Administrador
                  </header>
                  <dl className="grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-xs text-muted-foreground">Nombre completo</dt>
                      <dd className="font-medium">{data.firstName} {data.lastName}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Email</dt>
                      <dd className="font-medium break-all">{data.email}</dd>
                    </div>
                  </dl>
                </section>

                <p className="text-xs text-muted-foreground">
                  Al crear la empresa aceptás los términos de uso de Concessio.
                </p>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="mt-8 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={back}
              disabled={step === 1 || loading}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Atrás
            </Button>

            {step < 3 ? (
              <Button
                type="button"
                onClick={next}
                className="h-11 gap-1 bg-gradient-gold text-primary-foreground shadow-amber hover:shadow-amber-lg"
              >
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={submit}
                disabled={loading}
                className="h-11 gap-1 bg-gradient-gold text-primary-foreground shadow-amber hover:shadow-amber-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creando…
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Crear empresa
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tenés cuenta?{" "}
          <button
            type="button"
            onClick={() => navigate(ROUTES.login)}
            className="font-medium text-primary hover:underline"
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  );
};
