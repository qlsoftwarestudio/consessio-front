import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Props {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({ icon: Icon = Inbox, title, description, action, className }: Props) => (
  <div className={cn("glass grid place-items-center rounded-xl p-10 text-center", className)}>
    <div className="grid h-14 w-14 place-items-center rounded-full bg-surface-2 text-primary">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
    {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);
