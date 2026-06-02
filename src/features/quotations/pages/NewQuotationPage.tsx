import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Download, FileText } from "lucide-react";
import { PageHeader } from "@/atomic-design/molecules/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QUOTATION_TYPES, QUOTATION_TYPE_LABEL, ROUTES } from "@/shared/constants/domain";
import { formatARS } from "@/shared/utils/format";
import { Price } from "@/atomic-design/atoms/Price";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import type { QuotationType } from "@/shared/types/domain";
import { useCreateQuotation } from "../hooks/use-quotations";
import type { ApiPlanType } from "@/shared/api/types";
import { useLeads } from "@/features/leads/hooks/use-leads";
import { useVehicles } from "@/features/vehicles/hooks/use-vehicles";

const PLAN_TYPES: ApiPlanType[] = ["100%", "70/30", "50/50", "ADQUIRIDO"];
const PLAN_TYPE_DESC: Record<ApiPlanType, string> = {
  "100%": "100% del valor en cuotas iguales",
  "70/30": "70% en cuotas + 30% al adjudicar",
  "50/50": "50% en cuotas + 50% al adjudicar",
  "ADQUIRIDO": "Plan adjudicado en cesión",
};

const STEPS = ["Tipo", "Lead y vehículo", "Calculadora", "Resumen"] as const;

export const NewQuotationPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { data: leadsData } = useLeads();
  const { data: vehiclesData } = useVehicles();
  const leads = leadsData?.items ?? [];
  const vehicles = vehiclesData?.items ?? [];
  const createQuotation = useCreateQuotation();

  const [step, setStep] = useState(0);
  const [type, setType] = useState<QuotationType>("contado");
  const [leadId, setLeadId] = useState<string>(params.get("leadId") ?? leads[0]?.id ?? "");
  const [vehicleId, setVehicleId] = useState<string>(vehicles[0]?.id ?? "");
  const [discount, setDiscount] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [installments, setInstallments] = useState(36);
  const [annualRate, setAnnualRate] = useState(40);
  // Plan FIAT
  const [planType, setPlanType] = useState<ApiPlanType>("100%");
  const [planInstallments, setPlanInstallments] = useState(84);

  const vehicle = useMemo(() => vehicles.find((v) => v.id === vehicleId), [vehicles, vehicleId]);
  const lead = useMemo(() => leads.find((l) => l.id === leadId), [leads, leadId]);
  const listPrice = vehicle?.priceArs ?? 0;
  const total = Math.max(0, listPrice - discount);
  const financed = Math.max(0, total - downPayment);

  const monthlyInstallment = useMemo(() => {
    if (type === "contado" || installments <= 0) return 0;
    if (type === "plan-ahorro") {
      // Estimación local mientras la API confirma el monto exacto
      const months = planInstallments || installments;
      return months > 0 ? Math.round(total / months) : 0;
    }
    const r = annualRate / 100 / 12;
    if (r === 0) return Math.round(financed / installments);
    const cuota = (financed * r) / (1 - Math.pow(1 + r, -installments));
    return Math.round(cuota);
  }, [type, financed, installments, annualRate, planInstallments, total]);

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const submit = async () => {
    if (!lead || !vehicle) return;
    try {
      const created = await createQuotation.mutateAsync({
        type,
        leadId: lead.id,
        vehicleId: vehicle.id,
        vehicleModel: `${vehicle.brand} ${vehicle.model}`,
        listPriceArs: listPrice,
        discountArs: discount,
        totalArs: total,
        downPaymentArs: type === "contado" ? total : downPayment,
        installments:
          type === "contado"
            ? undefined
            : type === "plan-ahorro"
              ? planInstallments
              : installments,
        annualRate: type === "financiado" ? annualRate : undefined,
        planType: type === "plan-ahorro" ? planType : undefined,
        planInstallments: type === "plan-ahorro" ? planInstallments : undefined,
      });
      toast({
        title: "Cotización creada",
        description: `${formatARS(created.totalArs)} para ${lead.fullName}`,
      });
      navigate(ROUTES.quotations);
    } catch {
      // toast ya disparado
    }
  };

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.quotations)} className="mb-3 -ml-2 text-muted-foreground">
        <ArrowLeft className="mr-1 h-4 w-4" /> Volver
      </Button>
      <PageHeader title="Nueva cotización" subtitle={`Paso ${step + 1} de ${STEPS.length} · ${STEPS[step]}`} />

      {/* Stepper */}
      <ol className="mb-6 flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              i < step && "border-primary/40 bg-primary/10 text-primary",
              i === step && "border-primary bg-gradient-gold text-primary-foreground shadow-amber",
              i > step && "border-border bg-surface-1/50 text-muted-foreground",
            )}
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-background/30 text-[10px]">
              {i < step ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>

      <div className="glass rounded-xl p-5">
        {step === 0 && (
          <div className="grid gap-3 sm:grid-cols-3">
            {QUOTATION_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "rounded-xl border p-5 text-left transition-all",
                  type === t
                    ? "border-primary/60 bg-primary/10 shadow-amber"
                    : "border-border bg-surface-1/50 hover:border-border/80",
                )}
              >
                <FileText className={cn("mb-3 h-6 w-6", type === t ? "text-primary" : "text-muted-foreground")} />
                <p className="font-display text-base font-semibold">{QUOTATION_TYPE_LABEL[t]}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t === "contado" && "Pago total al momento de la entrega."}
                  {t === "financiado" && "Anticipo + cuotas con tasa nominal anual."}
                  {t === "plan-ahorro" && "Plan de cuotas iguales sin interés."}
                </p>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Lead</Label>
              <Select value={leadId} onValueChange={setLeadId}>
                <SelectTrigger className="bg-surface-1/60"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {leads.map((l) => <SelectItem key={l.id} value={l.id}>{l.fullName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Vehículo</Label>
              <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger className="bg-surface-1/60"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => <SelectItem key={v.id} value={v.id}>{v.brand} {v.model} {v.version ?? ""}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {vehicle && (
              <div className="sm:col-span-2 rounded-lg border border-border/60 bg-surface-1/50 p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Precio de lista</p>
                <Price amount={vehicle.priceArs} size="lg" className="text-gradient-gold" />
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Precio de lista</Label>
              <Input value={formatARS(listPrice)} readOnly className="bg-surface-2/60" />
            </div>
            <div className="grid gap-1.5">
              <Label>Descuento (ARS)</Label>
              <Input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="bg-surface-1/60" />
            </div>
            {type !== "contado" && (
              <>
                <div className="grid gap-1.5">
                  <Label>Anticipo (ARS)</Label>
                  <Input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="bg-surface-1/60" />
                </div>
                {type === "financiado" && (
                  <div className="grid gap-1.5">
                    <Label>Cuotas</Label>
                    <Input type="number" value={installments} onChange={(e) => setInstallments(Number(e.target.value))} className="bg-surface-1/60" />
                  </div>
                )}
                {type === "financiado" && (
                  <div className="grid gap-1.5">
                    <Label>TNA (%)</Label>
                    <Input type="number" value={annualRate} onChange={(e) => setAnnualRate(Number(e.target.value))} className="bg-surface-1/60" />
                  </div>
                )}
                {type === "plan-ahorro" && (
                  <>
                    <div className="grid gap-1.5">
                      <Label>Modalidad de plan</Label>
                      <Select value={planType} onValueChange={(v) => setPlanType(v as ApiPlanType)}>
                        <SelectTrigger className="bg-surface-1/60"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {PLAN_TYPES.map((p) => (
                            <SelectItem key={p} value={p}>{p} — {PLAN_TYPE_DESC[p]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1.5">
                      <Label>Cantidad de cuotas</Label>
                      <Input
                        type="number"
                        value={planInstallments}
                        onChange={(e) => setPlanInstallments(Number(e.target.value))}
                        className="bg-surface-1/60"
                        placeholder="60, 84, 120…"
                      />
                    </div>
                    <div className="sm:col-span-2 rounded-lg border border-info/30 bg-info/10 p-3 text-xs text-info">
                      Los importes finales (cuota, adjudicación, costo total) se calculan en el servidor según la modalidad seleccionada y se mostrarán al confirmar.
                    </div>
                  </>
                )}
                <div className="grid gap-1.5 sm:col-span-2 rounded-lg border border-primary/30 bg-primary/10 p-4">
                  <p className="text-xs uppercase tracking-wider text-primary">Cuota mensual estimada</p>
                  <Price amount={monthlyInstallment} size="lg" className="text-gradient-gold" />
                </div>
              </>
            )}
          </div>
        )}

        {step === 3 && lead && vehicle && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border/60 bg-surface-1/50 p-5">
              <h3 className="font-display text-lg font-semibold">{lead.fullName}</h3>
              <p className="text-sm text-muted-foreground">{vehicle.brand} {vehicle.model} {vehicle.version ?? ""}</p>
              <div className="mt-4 grid gap-2 text-sm">
                <Row label="Tipo" value={QUOTATION_TYPE_LABEL[type]} />
                <Row label="Precio lista" value={formatARS(listPrice)} />
                <Row label="Descuento" value={`- ${formatARS(discount)}`} />
                {type !== "contado" && (
                  <>
                    <Row label="Anticipo" value={formatARS(downPayment)} />
                    <Row
                      label="Cuotas"
                      value={`${type === "plan-ahorro" ? planInstallments : installments} de ${formatARS(monthlyInstallment)}`}
                    />
                    {type === "financiado" && <Row label="TNA" value={`${annualRate}%`} />}
                    {type === "plan-ahorro" && <Row label="Modalidad" value={planType} />}
                  </>
                )}
                <div className="mt-2 flex items-end justify-between border-t border-border/60 pt-3">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Total</span>
                  <Price amount={total} size="lg" className="text-gradient-gold" />
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => toast({ title: "PDF próximamente", description: "Descarga real en la próxima versión." })}>
              <Download className="mr-1 h-4 w-4" /> Descargar PDF (preview)
            </Button>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={prev} disabled={step === 0}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Anterior
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={next} className="bg-gradient-gold text-primary-foreground shadow-amber">
            Siguiente <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={submit} className="bg-gradient-gold text-primary-foreground shadow-amber">
            Confirmar cotización
          </Button>
        )}
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);
