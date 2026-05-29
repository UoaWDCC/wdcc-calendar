// Reusable API Response wrapper
export type ServerResponse<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };
