import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className, showText = true, size = "md" }: LogoProps) => {
  const sizes = {
    sm: { icon: "h-7 w-7", text: "text-base", wrap: "gap-2" },
    md: { icon: "h-9 w-9", text: "text-xl", wrap: "gap-2.5" },
    lg: { icon: "h-12 w-12", text: "text-3xl", wrap: "gap-3" },
  };
  const s = sizes[size];
  return (
    <div className={cn("flex items-center", s.wrap, className)}>
      <div
        className={cn(
          "relative grid place-items-center rounded-lg bg-gradient-gold shadow-amber",
          s.icon,
        )}
      >
        <Car className="h-[55%] w-[55%] text-primary-foreground" strokeWidth={2.5} />
      </div>
      {showText && (
        <span className={cn("font-display font-bold tracking-tight", s.text)}>
          <span className="text-foreground">Conces</span>
          <span className="text-gradient-gold">sio</span>
        </span>
      )}
    </div>
  );
};
