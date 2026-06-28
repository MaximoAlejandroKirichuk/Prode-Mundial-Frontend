const BASE_URL = (() => {
  const raw = import.meta.env.PUBLIC_BACKEND_REGISTRATION_URL;
  if (!raw) {
    throw new Error(
      "PUBLIC_BACKEND_REGISTRATION_URL is not set. " +
        "The signup form cannot contact the backend."
    );
  }
  // Normalize: remove trailing slashes
  return raw.replace(/\/+$/, "");
})();

/**
 * Build an absolute backend URL for the given API path.
 * BASE_URL is read once at module load from the PUBLIC_BACKEND_REGISTRATION_URL env var.
 * Throws at module-load time (dev/build) if the env var is missing.
 */
export function getApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${normalizedPath}`;
}
