import { formatARS } from "@/shared/utils/format";
import { cn } from "@/lib/utils";

interface Props {
  amount: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Price = ({ amount, className, size = "md" }: Props) => {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl font-display",
  };
  return (
    <span className={cn("font-semibold tabular-nums tracking-tight", sizes[size], className)}>
      {formatARS(amount)}
    </span>
  );
};
