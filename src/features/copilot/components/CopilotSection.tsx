import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  empty?: boolean;
  emptyText?: string;
  className?: string;
}

export const CopilotSection = ({
  title,
  subtitle,
  children,
  isLoading,
  empty,
  emptyText = "Sin datos por ahora.",
  className,
}: Props) => (
  <section className={cn("glass rounded-xl p-4 lg:p-5", className)}>
    <div className="mb-4">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>

    {isLoading ? (
      <div className="grid place-items-center py-10 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    ) : empty ? (
      <p className="py-6 text-sm text-muted-foreground">{emptyText}</p>
    ) : (
      children
    )}
  </section>
);
