import { cn } from "@/lib/utils";
import { BUSINESS } from "@/lib/constants";

export function Wordmark({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <span className={cn("flex flex-col leading-none", className)}>
      <span
        className={cn(
          "display-wonk text-18 font-semibold tracking-[-0.01em] whitespace-nowrap sm:text-22",
          tone === "light" ? "text-ivory" : "text-indigo-900",
        )}
      >
        {BUSINESS.name}
      </span>
      <span
        className={cn(
          "deva mt-1 text-14",
          tone === "light" ? "text-ivory/70" : "text-ink/65",
        )}
        lang="hi"
      >
        {BUSINESS.nameDevanagari}
      </span>
    </span>
  );
}
