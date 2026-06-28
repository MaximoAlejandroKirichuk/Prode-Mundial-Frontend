/// <reference types="astro/client" />

declare namespace App {
  // Augment Astro's Locals if needed in the future.
}

interface ImportMetaEnv {
  /** Base URL of the backend that serves /api/tournaments/active and /api/registrations. */
  readonly PUBLIC_BACKEND_REGISTRATION_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
