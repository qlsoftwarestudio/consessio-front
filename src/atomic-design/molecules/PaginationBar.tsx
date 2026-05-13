import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PaginationBarProps {
  page: number;            // 0-based
  totalPages: number;
  total: number;           // totalElements
  size: number;
  onPageChange: (page: number) => void;
  onSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  isFetching?: boolean;
}

const buildPages = (current: number, totalPages: number): (number | "…")[] => {
  // current y totalPages son 0-based para la lógica; mostramos 1-based.
  const last = totalPages - 1;
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);
  const pages: (number | "…")[] = [0];
  const start = Math.max(1, current - 1);
  const end = Math.min(last - 1, current + 1);
  if (start > 1) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < last - 1) pages.push("…");
  pages.push(last);
  return pages;
};

export const PaginationBar = ({
  page,
  totalPages,
  total,
  size,
  onPageChange,
  onSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className,
  isFetching,
}: PaginationBarProps) => {
  if (total === 0) return null;

  const from = page * size + 1;
  const to = Math.min(total, (page + 1) * size);
  const pages = buildPages(page, Math.max(1, totalPages));
  const isLast = page >= totalPages - 1;
  const isFirst = page === 0;

  return (
    <div
      className={cn(
        "mt-4 flex flex-col gap-3 rounded-xl border border-border/60 bg-surface-1/40 px-3 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
        <span>
          Mostrando <span className="font-medium text-foreground">{from}</span>–
          <span className="font-medium text-foreground">{to}</span> de{" "}
          <span className="font-medium text-foreground">{total}</span>
          {isFetching && <span className="ml-2 text-xs">· actualizando…</span>}
        </span>
        {onSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs">Por página</span>
            <Select
              value={String(size)}
              onValueChange={(v) => onSizeChange(Number(v))}
            >
              <SelectTrigger className="h-8 w-[78px] bg-surface-2/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={isFirst}
          onClick={() => onPageChange(0)}
          aria-label="Primera página"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={isFirst}
          onClick={() => onPageChange(Math.max(0, page - 1))}
          aria-label="Anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="mx-1 flex items-center gap-1">
          {pages.map((p, i) =>
            p === "…" ? (
              <span key={`gap-${i}`} className="px-1.5 text-muted-foreground">
                …
              </span>
            ) : (
              <Button
                key={p}
                variant={p === page ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-8 min-w-8 px-2.5",
                  p === page &&
                    "bg-gradient-gold text-primary-foreground shadow-amber hover:opacity-90",
                )}
                onClick={() => onPageChange(p)}
              >
                {p + 1}
              </Button>
            ),
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={isLast}
          onClick={() => onPageChange(page + 1)}
          aria-label="Siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={isLast}
          onClick={() => onPageChange(totalPages - 1)}
          aria-label="Última página"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
