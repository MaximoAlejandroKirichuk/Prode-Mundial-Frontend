import { CircleCheck, CircleX, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types & contracts (matches design.md interfaces)
// ---------------------------------------------------------------------------

type PaymentReturnVariant = "success" | "pending" | "error";

// ---------------------------------------------------------------------------
// Per-route configuration (Spanish Argentina copy)
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

  /** Renders the CTA button based on variant and href */
  const renderCTA = (label: string, href: string, variantClass?: string) => {
    if (href) {
      return (
        <a href={href}>
          <Button className={cn("font-bold tracking-wide", variantClass)}>
            {label}
          </Button>
        </a>
      );
    }
    // Pending route: no href → button reloads the page
    return (
      <Button
        className="font-bold tracking-wide"
        variant="outline"
        onClick={() => window.location.reload()}
      >
        {label}
      </Button>
    );
  };

  /** Renders the appropriate icon for the variant */
  const StatusIcon = ({
    iconKind,
    className,
  }: {
    iconKind: "success" | "error" | "pending";
    className?: string;
  }) => {
    const iconMap = {
      success: CircleCheck,
      error: CircleX,
      pending: Clock,
    };
    const Icon = iconMap[iconKind];
    const colorMap = {
      success: "text-emerald-500",
      error: "text-destructive",
      pending: "text-amber-500",
    };
    return <Icon className={cn("h-12 w-12", colorMap[iconKind], className)} />;
  };

  const iconKind =
    variant === "success"
      ? ("success" as const)
      : variant === "error"
        ? ("error" as const)
        : ("pending" as const);

  return (
    <Card className="mx-auto max-w-md text-center">
      <CardHeader className="items-center gap-4 pb-2">
        <StatusIcon iconKind={iconKind} />
        <CardTitle className="text-xl">{config.title}</CardTitle>
        <CardDescription className="text-base leading-relaxed">
          {config.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3">
        {renderCTA(config.ctaLabel, config.ctaHref)}
        {/* Support contact for error and pending states */}
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
      </CardContent>
    </Card>
  );
}
