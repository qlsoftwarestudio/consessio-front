import { cn } from "@/lib/utils";

interface Props {
  score: number;
}

export const ScoreBadge = ({ score }: Props) => {
  const color =
    score >= 80
      ? "bg-success/15 text-success ring-success/30"
      : score >= 60
      ? "bg-amber-500/15 text-amber-600 ring-amber-500/30"
      : "bg-destructive/15 text-destructive ring-destructive/30";

  return (
    <span
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ring-1 ring-inset",
        color,
      )}
    >
      {score}
    </span>
  );
};
