import { initials } from "@/shared/utils/format";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Avatar = ({ name, className, size = "md" }: Props) => {
  const sizes = { sm: "h-7 w-7 text-[11px]", md: "h-9 w-9 text-xs", lg: "h-12 w-12 text-sm" };
  return (
    <div
      className={cn(
        "grid place-items-center rounded-full bg-gradient-to-br from-surface-2 to-surface-3 font-semibold text-foreground/90 ring-1 ring-border",
        sizes[size],
        className,
      )}
    >
      {initials(name) || "?"}
    </div>
  );
};
