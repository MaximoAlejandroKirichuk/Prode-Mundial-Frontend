import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { submitSignup, clearServerError } from "@/store/signup-slice";

interface SignupFormData {
  name: string;
  email: string;
  confirmEmail: string;
}

type SignupFormErrors = Partial<Record<keyof SignupFormData, string>>;

export function SignupForm() {
  const dispatch = useAppDispatch();
  const { isSubmitting, serverError } = useAppSelector((s) => s.signup);

  const [formData, setFormData] = React.useState<SignupFormData>({
    name: "",
    email: "",
    confirmEmail: "",
  });
  const [errors, setErrors] = React.useState<SignupFormErrors>({});
  const submitRef = React.useRef(false);

  React.useEffect(() => {
    if (serverError) {
      submitRef.current = false;
    }
  }, [serverError]);

  function validate(): SignupFormErrors {
    const errs: SignupFormErrors = {};
    if (!formData.name.trim()) {
      errs.name = "El nombre es obligatorio.";
    }
    if (!formData.email.trim()) {
      errs.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Ingresa un correo valido.";
    }
    if (!formData.confirmEmail.trim()) {
      errs.confirmEmail = "Confirma tu correo.";
    } else if (
      formData.email.trim() &&
      formData.confirmEmail.trim() !== formData.email.trim()
    ) {
      errs.confirmEmail = "Los correos no coinciden.";
    }
    return errs;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof SignupFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    dispatch(clearServerError());
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (submitRef.current) return;

    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    submitRef.current = true;

    const result = await dispatch(
      submitSignup({ name: formData.name, email: formData.email })
    );

    if (submitSignup.fulfilled.match(result)) {
      window.location.href = result.payload.init_point;
    } else {
      submitRef.current = false;
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Celeste accent top line */}
      <div className="mx-auto mb-6 h-1 w-16 accent-line" aria-hidden="true"></div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            name="name"
            placeholder="Tu nombre completo"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
            aria-invalid={!!errors.name}
            autoComplete="name"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Correo electronico</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tu@correo.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmEmail">Confirmar correo</Label>
          <Input
            id="confirmEmail"
            name="confirmEmail"
            type="email"
            placeholder="Repeti tu correo"
            value={formData.confirmEmail}
            onChange={handleChange}
            disabled={isSubmitting}
            aria-invalid={!!errors.confirmEmail}
            autoComplete="email"
          />
          {errors.confirmEmail && (
            <p className="text-sm text-destructive">{errors.confirmEmail}</p>
          )}
        </div>

        {serverError && (
          <div
            role="alert"
            className="rounded-sm border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {serverError}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full mt-3 font-bold tracking-wide"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparando todo...
            </>
          ) : (
            "Quiero Jugar"
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-1">
          Al inscribirte aceptas participar del Prode del Mundial 2026.
        </p>
      </form>
    </div>
  );
}
