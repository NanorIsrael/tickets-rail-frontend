import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  subtitle,
  right,
  children,
  className,
  contentClassName,
}: {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section className={cn("panel flex flex-col", className)}>
      {(title || right) && (
        <header className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <div className="flex flex-col">
            {title && <span className="hud-label">{title}</span>}
            {subtitle && (
              <span className="text-sm text-foreground mt-0.5 font-medium">{subtitle}</span>
            )}
          </div>
          {right}
        </header>
      )}
      <div className={cn("flex-1 p-4", contentClassName)}>{children}</div>
    </section>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        {eyebrow && <div className="hud-label mb-1">{eyebrow}</div>}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
