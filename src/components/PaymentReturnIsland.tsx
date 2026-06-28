import { CircleCheck, CircleX, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types & contracts (matches design.md interfaces — unchanged)
// ---------------------------------------------------------------------------

type PaymentReturnVariant = "success" | "pending" | "error";

// ---------------------------------------------------------------------------
// Per-route configuration (Spanish Argentina copy — preserved verbatim)
// ---------------------------------------------------------------------------

interface VariantConfig {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

const variantConfigMap: Record<PaymentReturnVariant, VariantConfig> = {
  success: {
    title: "¡Gracias! Tu pago está siendo verificado",
    description:
      "Recibirás el acceso en el mismo email con el que te registraste apenas se confirme el pago. Si no aparece en unos minutos, revisá la carpeta de spam.",
    ctaLabel: "Volver al inicio",
    ctaHref: "/",
  },
  pending: {
    title: "Tu pago está siendo procesado",
    description:
      "Si elegiste pagar en efectivo, acreditá en el local y volvé en un rato. El estado se actualiza automáticamente cuando se confirma el pago.",
    ctaLabel: "Recargar página",
    ctaHref: "",
  },
  error: {
    title: "No se pudo completar el pago",
    description:
      "Volvé a intentarlo desde la página de inscripción o escribinos a oficialprodelito@gmail.com con tu comprobante de Mercado Pago para que te ayudemos.",
    ctaLabel: "Intentar de nuevo",
    ctaHref: "/",
  },
};

// ---------------------------------------------------------------------------
// Per-variant visual tokens (icon + glow color — semantic, not brand)
// ---------------------------------------------------------------------------

const variantVisual: Record<
  PaymentReturnVariant,
  { icon: typeof CircleCheck; glowColor: string; iconColor: string }
> = {
  success: {
    icon: CircleCheck,
    glowColor: "bg-emerald-500/15",
    iconColor: "text-emerald-500",
  },
  pending: {
    icon: Clock,
    glowColor: "bg-amber-500/15",
    iconColor: "text-amber-500",
  },
  error: {
    icon: CircleX,
    glowColor: "bg-destructive/15",
    iconColor: "text-destructive",
  },
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface PaymentReturnIslandProps {
  variant: PaymentReturnVariant;
}

// ---------------------------------------------------------------------------
// Component — pure presentational, no backend requests
// ---------------------------------------------------------------------------

export function PaymentReturnIsland({ variant }: PaymentReturnIslandProps) {
  const config = variantConfigMap[variant];
  const { icon: Icon, glowColor, iconColor } = variantVisual[variant];

  return (
    <div className="animate-hero-reveal hero-stagger-start mx-auto w-full max-w-lg">
      {/* ── Top accent bar — celeste brand marker, mirrors landing's top-stripe-celeste ── */}
      <div
        className="h-[3px] w-full rounded-t-sm bg-cancha-celeste"
        aria-hidden="true"
      />

      {/* ── Card body — matches landing card treatment (border-border bg-card) ── */}
      <div className="rounded-b-sm border border-border/60 bg-card px-8 py-12 shadow-sm sm:px-14">
        {/* Icon with radial glow — same pattern as the soccer ball glow in hero */}
        <div className="relative mx-auto mb-10 flex h-20 w-20 items-center justify-center">
          <div
            className={cn("absolute inset-0 rounded-full blur-2xl", glowColor)}
            aria-hidden="true"
          />
          <Icon
            className={cn("relative h-16 w-16", iconColor)}
            aria-hidden="true"
          />
        </div>

        {/* Title — headline-accent matches landing section titles */}
        <h1 className="headline-accent mx-auto mb-5 max-w-[20ch] text-center text-2xl font-extrabold tracking-tight sm:text-3xl">
          {config.title}
        </h1>

        {/* Description — matching landing body copy */}
        <p className="mx-auto max-w-prose text-center text-base leading-relaxed text-muted-foreground">
          {config.description}
        </p>

        {/* CTA — landing-style button (rounded-sm, font-bold tracking-wide, h-12, hover lift) */}
        <div className="mt-10 flex flex-col items-center gap-4">
          {variant === "pending" ? (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-12 items-center justify-center rounded-sm border border-border bg-background px-8 text-sm font-bold tracking-wide text-foreground shadow-sm transition-[transform,box-shadow,background-color] duration-200 ease-out hover:bg-cancha-stripe hover:-translate-y-[1px] hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {config.ctaLabel}
            </button>
          ) : (
            <a
              href={config.ctaHref}
              className="inline-flex h-12 items-center justify-center rounded-sm bg-primary px-8 text-sm font-bold tracking-wide text-primary-foreground shadow-sm transition-[transform,box-shadow,background-color] duration-200 ease-out hover:bg-primary/90 hover:-translate-y-[1px] hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {config.ctaLabel}
            </a>
          )}

          {/* Support contact — error and pending routes only */}
          {(variant === "error" || variant === "pending") && (
            <p className="text-xs text-muted-foreground">
              ¿Necesitás ayuda?{" "}
              <a
                href="mailto:oficialprodelito@gmail.com"
                className="underline hover:text-foreground"
              >
                oficialprodelito@gmail.com
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
